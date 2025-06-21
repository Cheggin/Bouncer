import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { Resend } from 'npm:resend';

// Initialize Resend with your API key from environment variables
const resend = new Resend(Deno.env.get('RESEND_API_KEY')!);

serve(async (req) => {
  try {
    const { record: profile } = await req.json();

    // Check if the risk level is above the threshold
    if (profile && profile.risk_level > 50) {
      const { data, error } = await resend.emails.send({
        from: 'Bouncer Risk Alert <bouncer@bouncer-app.com>',
        to: ['reaganhsu123@gmail.com'],
        subject: `🚨 High Risk User Alert: ${profile.full_name || 'N/A'}`,
        html: `
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
        `,
      });

      if (error) {
        console.error({ error });
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      console.log({ data });
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({ message: 'Risk level not over threshold, no email sent.' }),
      { headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}); 