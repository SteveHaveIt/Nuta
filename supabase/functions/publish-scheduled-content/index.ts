import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*" } });
  }

  try {
    const now = new Date().toISOString();

    // Get all scheduled content that should be published now
    const { data: scheduledContent, error: fetchError } = await supabase
      .from("content_schedule")
      .select("*")
      .eq("status", "pending")
      .lte("scheduled_for", now);

    if (fetchError) throw fetchError;

    if (!scheduledContent || scheduledContent.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "No content to publish",
          published: 0,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    let publishedCount = 0;
    const errors = [];

    // Publish each scheduled content
    for (const schedule of scheduledContent) {
      try {
        const tableName = `${schedule.content_type}s`;

        // Update content status to published
        const { error: updateError } = await supabase
          .from(tableName)
          .update({
            status: "published",
            published_at: now,
          })
          .eq("id", schedule.content_id);

        if (updateError) throw updateError;

        // Update schedule status
        const { error: scheduleError } = await supabase
          .from("content_schedule")
          .update({
            status: "published",
            published_at: now,
          })
          .eq("id", schedule.id);

        if (scheduleError) throw scheduleError;

        publishedCount++;
        console.log(
          `Published ${schedule.content_type} #${schedule.content_id}`
        );
      } catch (error) {
        errors.push({
          scheduleId: schedule.id,
          error: error.message,
        });

        // Update schedule status to failed
        await supabase
          .from("content_schedule")
          .update({
            status: "failed",
            error_message: error.message,
          })
          .eq("id", schedule.id);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Published ${publishedCount} content items`,
        published: publishedCount,
        errors: errors.length > 0 ? errors : undefined,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
