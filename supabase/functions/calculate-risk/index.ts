// deno-lint-ignore-file no-explicit-any
// @ts-ignore Deno is available at runtime in Supabase Edge Functions
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RENDER_API_URL = 'https://bouncer-backend-t8m1.onrender.com'
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Initialize Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🔍 Risk calculation function called')
    
    const { record: profile } = await req.json()

    if (!profile) {
      console.log('Missing profile data')
      return new Response(
        JSON.stringify({ error: 'Missing profile data' }), 
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('📊 Calculating risk for user:', profile.full_name)

    // Skip if risk level already exists
    if (profile.risk_level !== null && profile.risk_level !== undefined) {
      console.log('Risk level already exists:', profile.risk_level)
      return new Response(
        JSON.stringify({ message: 'Risk level already calculated' }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (!RENDER_API_URL) {
      console.log('Render API URL not configured')
      return new Response(
        JSON.stringify({ error: 'Render API URL not configured' }), 
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Prepare user data for analysis
    const userData = {
      name: profile.full_name || 'Unknown',
      email: profile.email || 'No email',
      dateOfBirth: profile.date_of_birth || 'Not provided',
      city: profile.city || 'Not provided',
      zipCode: profile.zip_code || 'Not provided',
      createdAt: profile.created_at,
    }

    // Create analysis prompt
    const analysisPrompt = `You are a risk assessment AI analyzing user data for potential security threats. 
Analyze the following user information and provide a risk score from 0-100, where:
- 0-33: Low risk (trusted user)
- 34-66: Medium risk (requires monitoring)
- 67-100: High risk (potential threat)

User Information:
- Name: ${userData.name}
- Email: ${userData.email}
- Date of Birth: ${userData.dateOfBirth}
- City: ${userData.city}
- Zip Code: ${userData.zipCode}
- Account Created: ${userData.createdAt}

Consider factors like:
- Email domain credibility
- Name patterns that might indicate fake accounts
- Geographic location consistency
- Age appropriateness
- Account creation patterns

Respond with ONLY a JSON object in this exact format:
{
  "risk_score": <number between 0-100>,
  "reasoning": "<brief explanation of the risk assessment>",
  "risk_factors": ["<factor1>", "<factor2>", "<factor3>"]
}`

    // Create text with user information, including quotes
    const userText = `"${userData.name}" OR "${userData.email}"`;

    // Create a FormData object to build the multipart request
    const formData = new FormData();
    formData.append('prompt', analysisPrompt);
    formData.append('text', userText);

    // Call your Render API
    const renderResponse = await fetch(`${RENDER_API_URL}/analyze-summaries`, {
      method: 'POST',
      body: formData
    });

    if (!renderResponse.ok) {
      console.error('Render API error:', renderResponse.status, renderResponse.statusText)
      throw new Error(`Render API error: ${renderResponse.status}`)
    }

    const responseJson = await renderResponse.json()
    console.log('Render API response JSON:', responseJson)

    // Extract and validate data from the JSON response
    const { risk_score, explanation, raw_summaries } = responseJson;

    // Validate the response (same validation as in test file)
    if (typeof risk_score !== 'number' || risk_score < 0 || risk_score > 100) {
      console.error('❌ Invalid risk_score:', risk_score);
      throw new Error('Invalid or missing risk_score in response from Render API.');
    }

    if (typeof explanation !== 'string' || explanation.length === 0) {
      console.error('❌ Invalid explanation string:', explanation);
      throw new Error('Invalid or missing explanation in response from Render API.');
    }

    if (typeof raw_summaries !== 'object' || raw_summaries === null || !raw_summaries.summaries) {
      console.error('❌ Invalid raw_summaries object:', raw_summaries);
      throw new Error('Invalid or missing raw_summaries in response from Render API.');
    }

    console.log('✅ Validation passed!');
    console.log('🎯 Risk Score:', risk_score);
    console.log('📝 Explanation:', explanation);

    // Update the profile with the calculated risk level and analysis
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        risk_level: risk_score,
        reasoning_summary: { explanation: explanation }, // Store explanation in a JSON object
        raw_json: raw_summaries // Store the raw summaries object
      })
      .eq('id', profile.id)

    if (updateError) {
      console.error('Error updating profile:', updateError)
      throw updateError
    }

    console.log('✅ Risk level updated successfully')

    return new Response(
      JSON.stringify({ 
        success: true, 
        risk_score: risk_score,
        explanation: explanation,
        raw_summaries: raw_summaries
      }), 
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ success: false, error: String(error) }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
}) 