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

    // Check if the risk level is above the threshold
    if (!profile.risk_level || profile.risk_level <= 50) {
      console.log('Risk level not over threshold:', profile.risk_level)
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

    const emailHtml = `
      <h1>High Risk User Detected</h1>
      <p>A user has been flagged with a risk level greater than 50.</p>
      <ul>
        <li><strong>User ID:</strong> ${profile.id}</li>
        <li><strong>Full Name:</strong> ${profile.full_name || 'N/A'}</li>
        <li><strong>Email:</strong> ${profile.email || 'N/A'}</li>
        <li><strong>Risk Level:</strong> <strong>${profile.risk_level}</strong></li>
        <li><strong>Timestamp:</strong> ${new Date().toUTCString()}</li>
      </ul>
      <p>Please review this user's activity in your dashboard.</p>
    `

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Bouncer Risk Alert <noreply@thankmyteacher.net>',
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