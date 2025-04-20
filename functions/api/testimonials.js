// Cloudflare Function: functions/api/testimonials.js
// Handles GET requests to fetch random testimonials from Supabase.

// IMPORTANT: You might need to install the Supabase client library
// Add "@supabase/supabase-js" to your package.json and run `npm install`
// if deploying via Wrangler CLI or Git integration with build step.
import { createClient } from '@supabase/supabase-js';

// Name of the RPC function created in Supabase
const RPC_FUNCTION_NAME = 'get_random_knowledge_entries';

export async function onRequestGet(context) {
  // Environment variables (set as Secrets in Cloudflare Pages settings)
  const SUPABASE_URL = context.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = context.env.SUPABASE_ANON_KEY;

  // Basic validation of environment variables
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("Supabase environment variables not set.");
    return new Response(JSON.stringify({ message: 'Server configuration error.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Initialize Supabase client within the function
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Call the database function to get 4 random entries
    const { data, error } = await supabase
      .rpc(RPC_FUNCTION_NAME, { limit_count: 4 });

    if (error) {
      console.error(`Supabase RPC Error (${RPC_FUNCTION_NAME}):`, error);
      // Don't expose detailed Supabase errors to the client
      return new Response(JSON.stringify({ message: 'Failed to fetch testimonials.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Return the fetched data
    return new Response(JSON.stringify(data || []), { // Return empty array if data is null
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate' // Prevent caching of random results
       },
    });

  } catch (err) {
    console.error('Unexpected error in /api/testimonials:', err);
    return new Response(JSON.stringify({ message: 'An unexpected error occurred.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Optional: Handle other methods if needed, otherwise Pages Functions default to 405 Method Not Allowed
// export async function onRequest(context) {
//   if (context.request.method === 'GET') {
//     return await onRequestGet(context);
//   }
//   return new Response('Method Not Allowed', { status: 405 });
// }
