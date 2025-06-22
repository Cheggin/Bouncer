// deno-lint-ignore-file no-explicit-any
// @ts-ignore Deno is available at runtime in Supabase Edge Functions
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Log the request for debugging
    console.log('Request method:', req.method)
    console.log('Request headers:', Object.fromEntries(req.headers.entries()))

    const { record: profile, highRiskThreshold } = await req.json()

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

    // Use the provided threshold or default to 50 for backward compatibility
    const threshold = highRiskThreshold || 50
    console.log('Using threshold:', threshold, 'for user risk level:', profile.risk_level)

    // Check if the risk level is above the threshold
    if (!profile.risk_level || profile.risk_level <= threshold) {
      console.log(`Risk level (${profile.risk_level}) not over threshold (${threshold}), no email sent`)
      return new Response(
        JSON.stringify({ message: 'Risk level not over threshold, no email sent.' }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (!RESEND_API_KEY) {
      console.log('Resend API key not configured')
      return new Response(
        JSON.stringify({ error: 'Resend API key not configured' }), 
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Sending high risk alert for user:', profile.full_name)

    // Prepare reasoning summary and raw data for email
    const reasoningSummary = profile.reasoning_summary?.explanation || 'No reasoning provided';
    const rawDataSummary = profile.raw_json?.summaries || {};
    
    // Format raw data for display
    const formatRawData = (rawData: any) => {
      if (!rawData || typeof rawData !== 'object') return 'No raw data available';
      
      let formattedData = '';
      
      // Handle array of objects (like summaries)
      if (Array.isArray(rawData)) {
        rawData.forEach((item, index) => {
          if (typeof item === 'object' && item !== null) {
            formattedData += `<li style="margin: 15px 0; padding: 10px; background-color: #f8f9fa; border-radius: 4px;">
              <strong>Result ${index + 1}:</strong><br>
              <ul style="margin: 5px 0; padding-left: 20px;">`;
            
            Object.entries(item).forEach(([key, value]) => {
              const displayValue = typeof value === 'string' && value.length > 200 
                ? value.substring(0, 200) + '...' 
                : String(value || 'N/A');
              formattedData += `<li style="margin: 5px 0;"><strong>${key}:</strong> ${displayValue}</li>`;
            });
            
            formattedData += `</ul></li>`;
          } else {
            formattedData += `<li><strong>${index}:</strong> ${String(item || 'N/A')}</li>`;
          }
        });
      } else {
        // Handle regular object
        Object.entries(rawData).forEach(([key, value]) => {
          if (typeof value === 'object' && value !== null) {
            formattedData += `<li style="margin: 10px 0;"><strong>${key}:</strong> ${JSON.stringify(value, null, 2)}</li>`;
          } else {
            const displayValue = typeof value === 'string' && value.length > 200 
              ? value.substring(0, 200) + '...' 
              : String(value || 'N/A');
            formattedData += `<li style="margin: 5px 0;"><strong>${key}:</strong> ${displayValue}</li>`;
          }
        });
      }
      
      return formattedData || '<li>No data available</li>';
    };

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #ff4444; border-bottom: 2px solid #ff4444; padding-bottom: 10px;">🚨 High Risk User Detected</h1>
        
        <p style="font-size: 16px; color: #333;">A user has been flagged with a risk level greater than ${threshold}.</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">User Information</h2>
          <ul style="list-style-type: none; padding: 0;">
            <li style="margin: 10px 0;"><strong>User ID:</strong> ${profile.id}</li>
            <li style="margin: 10px 0;"><strong>Full Name:</strong> ${profile.full_name || 'N/A'}</li>
            <li style="margin: 10px 0;"><strong>Email:</strong> ${profile.email || 'N/A'}</li>
            <li style="margin: 10px 0;"><strong>City:</strong> ${profile.city || 'N/A'}</li>
            <li style="margin: 10px 0;"><strong>Date of Birth:</strong> ${profile.date_of_birth || 'N/A'}</li>
            <li style="margin: 10px 0;"><strong>Risk Level:</strong> <span style="color: #ff4444; font-weight: bold; font-size: 18px;">${profile.risk_level}</span></li>
            <li style="margin: 10px 0;"><strong>Risk Threshold:</strong> ${threshold}</li>
            <li style="margin: 10px 0;"><strong>Timestamp:</strong> ${new Date().toUTCString()}</li>
          </ul>
        </div>

        <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <h2 style="color: #856404; margin-top: 0;">🧠 AI Risk Assessment</h2>
          <p style="color: #856404; margin: 0;"><strong>Reasoning:</strong></p>
          <p style="color: #333; background-color: white; padding: 15px; border-radius: 4px; margin: 10px 0;">${reasoningSummary}</p>
        </div>

        <div style="background-color: #d1ecf1; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #17a2b8;">
          <h2 style="color: #0c5460; margin-top: 0;">📊 Raw Background Check Data</h2>
          <ul style="list-style-type: none; padding: 0; background-color: white; padding: 15px; border-radius: 4px; margin: 10px 0;">
            ${formatRawData(rawDataSummary)}
          </ul>
        </div>

        <div style="background-color: #f8d7da; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
          <h2 style="color: #721c24; margin-top: 0;">⚠️ Action Required</h2>
          <p style="color: #721c24; margin: 0;">Please review this user's activity in your dashboard immediately and take appropriate action based on the risk level and assessment details provided above.</p>
        </div>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #dee2e6;">
        <p style="color: #6c757d; font-size: 12px; text-align: center;">
          This is an automated alert from the Bouncer Risk Assessment System.<br>
          Generated on ${new Date().toUTCString()}
        </p>
      </div>
    `

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Bouncer Risk Alert <bouncer@bouncer-app.com>',
        to: ['reaganhsu123@gmail.com'],
        subject: `🚨 High Risk User Alert: ${profile.full_name || 'N/A'}`,
        html: emailHtml,
      }),
    })

    const data = await res.json()
    console.log('Resend response status:', res.status)
    console.log('Resend response data:', data)

    if (!res.ok) {
      return new Response(
        JSON.stringify({ success: false, error: data }), 
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    return new Response(
      JSON.stringify({ success: true, data }), 
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