// Cloudflare Function: functions/api/submit.js
// Handles POST requests to submit new entries, including reCAPTCHA validation.

import { createClient } from '@supabase/supabase-js';

const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';
const TABLE_NAME = 'knowledge_entries';

export async function onRequestPost(context) {
  // Environment variables (set as Secrets in Cloudflare Pages settings)
  const SUPABASE_URL = context.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = context.env.SUPABASE_ANON_KEY;
  const RECAPTCHA_SECRET_KEY = context.env.RECAPTCHA_SECRET_KEY;

  // Basic validation of environment variables
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !RECAPTCHA_SECRET_KEY) {
    console.error("Required environment variables not set.");
    return new Response(JSON.stringify({ success: false, message: 'Server configuration error.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // 1. Parse Incoming Data
    const submissionData = await context.request.json();
    const { recaptchaToken, ...formData } = submissionData; // Separate token from form data

    if (!recaptchaToken) {
      return new Response(JSON.stringify({ success: false, message: 'reCAPTCHA token missing.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Verify reCAPTCHA Token
    const recaptchaResponse = await fetch(RECAPTCHA_VERIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${encodeURIComponent(RECAPTCHA_SECRET_KEY)}&response=${encodeURIComponent(recaptchaToken)}`,
    });

    const recaptchaResult = await recaptchaResponse.json();

    // Check if reCAPTCHA verification failed
    // You might add score checking for v3: && recaptchaResult.score > 0.5
    if (!recaptchaResult.success) {
      console.error('reCAPTCHA verification failed:', recaptchaResult['error-codes']);
      return new Response(JSON.stringify({ success: false, message: 'reCAPTCHA validation failed.' }), {
        status: 403, // Forbidden
        headers: { 'Content-Type': 'application/json' },
      });
    }
    // console.log('reCAPTCHA score:', recaptchaResult.score); // Optional: Log score for tuning

    // 3. Insert Data into Supabase (if reCAPTCHA is valid)
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Prepare data for insertion (handle nulls - although client already does this)
    const dataToInsert = {
        headline: formData.headline || null,
        knowledge_domain: formData.knowledge_domain, // Required field
        knowledge_details: formData.knowledge_details, // Required field
        day_job: formData.day_job, // Required field
        name: formData.name || null,
    };

    // Validate required fields server-side as well (basic check)
    if (!dataToInsert.knowledge_domain || !dataToInsert.knowledge_details || !dataToInsert.day_job) {
         return new Response(JSON.stringify({ success: false, message: 'Required fields missing.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
         });
    }


    const { error: insertError } = await supabase
      .from(TABLE_NAME)
      .insert([dataToInsert]);

    if (insertError) {
      console.error('Supabase Insert Error:', insertError);
      return new Response(JSON.stringify({ success: false, message: 'Failed to save submission.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 4. Return Success Response
    return new Response(JSON.stringify({ success: true, message: 'Thank you for sharing your knowledge!' }), {
      status: 201, // Created
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
     // Handle potential JSON parsing errors or other unexpected errors
    if (err instanceof SyntaxError) {
         return new Response(JSON.stringify({ success: false, message: 'Invalid request format.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
         });
    }
    console.error('Unexpected error in /api/submit:', err);
    return new Response(JSON.stringify({ success: false, message: 'An unexpected error occurred.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Optional: Handle other methods
// export async function onRequest(context) {
//   if (context.request.method === 'POST') {
//     return await onRequestPost(context);
//   }
//   return new Response('Method Not Allowed', { status: 405 });
// }
