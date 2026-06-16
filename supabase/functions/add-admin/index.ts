import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Missing authorization" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  try {
    // Verify the caller is authenticated
    const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        Authorization: authHeader,
        Apikey: Deno.env.get("SUPABASE_ANON_KEY")!,
      },
    });
    const userData = await userRes.json();

    if (!userData.id) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { email, password } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if the caller is already an admin (only admins can add other admins)
    // For the first admin, allow if no admins exist yet
    const adminCheckRes = await fetch(
      `${supabaseUrl}/rest/v1/admins?select=user_id&limit=1`,
      {
        headers: {
          Apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
      }
    );
    const existingAdmins = await adminCheckRes.json();

    if (existingAdmins.length > 0) {
      // There are already admins - verify the caller is one
      const callerAdminRes = await fetch(
        `${supabaseUrl}/rest/v1/admins?user_id=eq.${userData.id}&select=user_id`,
        {
          headers: {
            Apikey: serviceRoleKey,
            Authorization: `Bearer ${serviceRoleKey}`,
          },
        }
      );
      const callerAdmin = await callerAdminRes.json();

      if (callerAdmin.length === 0) {
        return new Response(
          JSON.stringify({ error: "Only existing admins can add new admins" }),
          {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // Find or create the user to be made admin
    let targetUserId: string;

    // Look up user by email using admin API
    const userLookupRes = await fetch(
      `${supabaseUrl}/auth/v1/admin/users?email=${encodeURIComponent(email)}`,
      {
        headers: {
          Apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
      }
    );
    const userLookup = await userLookupRes.json();

    if (userLookup.users && userLookup.users.length > 0) {
      targetUserId = userLookup.users[0].id;
    } else if (password) {
      // Create the user if password provided
      const createRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
        body: JSON.stringify({
          email,
          password,
          email_confirm: true,
        }),
      });
      const created = await createRes.json();
      if (!created.id) {
        return new Response(
          JSON.stringify({ error: "Failed to create user", details: created }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      targetUserId = created.id;
    } else {
      return new Response(
        JSON.stringify({
          error: "User not found. Provide a password to create the user.",
        }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Add to admins table
    const insertRes = await fetch(`${supabaseUrl}/rest/v1/admins`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify({ user_id: targetUserId }),
    });

    if (!insertRes.ok) {
      const err = await insertRes.json();
      // If already exists, that's fine
      if (err.code === "23505") {
        return new Response(
          JSON.stringify({ message: "User is already an admin" }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      return new Response(
        JSON.stringify({ error: "Failed to add admin", details: err }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ message: "Admin added successfully", user_id: targetUserId }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
