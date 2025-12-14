import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface PublishRequest {
  contentType: "blog" | "vlog" | "story" | "recipe" | "health_tip" | "community_story";
  contentId: number;
  publishNow?: boolean;
  scheduledFor?: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*" } });
  }

  try {
    const { contentType, contentId, publishNow = true, scheduledFor } = (await req.json()) as PublishRequest;

    // Validate input
    if (!contentType || !contentId) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const tableName = `${contentType}s`;
    const now = new Date().toISOString();

    if (publishNow) {
      // Publish immediately
      const { data, error } = await supabase
        .from(tableName)
        .update({
          status: "published",
          published_at: now,
        })
        .eq("id", contentId)
        .select();

      if (error) throw error;

      return new Response(
        JSON.stringify({
          success: true,
          message: `${contentType} published successfully`,
          data,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else if (scheduledFor) {
      // Schedule for later
      const { data: scheduleData, error: scheduleError } = await supabase
        .from("content_schedule")
        .insert({
          content_type: contentType,
          content_id: contentId,
          scheduled_for: scheduledFor,
          status: "pending",
        })
        .select();

      if (scheduleError) throw scheduleError;

      // Update content status to scheduled
      const { data, error } = await supabase
        .from(tableName)
        .update({
          status: "scheduled",
          scheduled_at: scheduledFor,
        })
        .eq("id", contentId)
        .select();

      if (error) throw error;

      return new Response(
        JSON.stringify({
          success: true,
          message: `${contentType} scheduled for ${scheduledFor}`,
          data,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
