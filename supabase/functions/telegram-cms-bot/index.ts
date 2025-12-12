import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const telegramBotToken = Deno.env.get("TELEGRAM_BOT_TOKEN")!;
const telegramChatId = Deno.env.get("TELEGRAM_CHAT_ID")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface TelegramMessage {
  update_id: number;
  message?: {
    message_id: number;
    from: {
      id: number;
      is_bot: boolean;
      first_name: string;
      username?: string;
    };
    chat: {
      id: number;
      type: string;
    };
    date: number;
    text: string;
  };
}

async function sendTelegramMessage(chatId: string, text: string) {
  const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: "HTML",
    }),
  });

  return response.json();
}

async function handleTelegramCommand(message: TelegramMessage["message"]) {
  if (!message || !message.text) return;

  const text = message.text.trim();
  const userId = message.from.id;
  const username = message.from.username || "unknown";
  const chatId = message.chat.id.toString();

  // Log the command
  await supabase.from("telegram_bot_logs").insert({
    telegram_user_id: userId,
    telegram_username: username,
    command: text.split(" ")[0],
    status: "received",
  });

  try {
    if (text.startsWith("/publish")) {
      // /publish blog 123
      const parts = text.split(" ");
      const contentType = parts[1];
      const contentId = parseInt(parts[2]);

      if (!contentType || !contentId) {
        await sendTelegramMessage(chatId, "❌ Usage: /publish <blog|vlog|recipe|health_tip> <id>");
        return;
      }

      // Publish content
      const tableName = `${contentType}s`;
      const { error } = await supabase
        .from(tableName)
        .update({
          status: "published",
          published_at: new Date().toISOString(),
        })
        .eq("id", contentId);

      if (error) throw error;

      await sendTelegramMessage(
        chatId,
        `✅ <b>${contentType}</b> #${contentId} published successfully!`
      );

      // Log success
      await supabase.from("telegram_bot_logs").insert({
        telegram_user_id: userId,
        telegram_username: username,
        command: "/publish",
        content_type: contentType,
        content_id: contentId,
        action: "publish",
        status: "success",
      });
    } else if (text.startsWith("/schedule")) {
      // /schedule blog 123 2024-12-25 10:00
      const parts = text.split(" ");
      const contentType = parts[1];
      const contentId = parseInt(parts[2]);
      const date = parts[3];
      const time = parts[4] || "10:00";

      if (!contentType || !contentId || !date) {
        await sendTelegramMessage(
          chatId,
          "❌ Usage: /schedule <type> <id> <YYYY-MM-DD> [HH:MM]"
        );
        return;
      }

      const scheduledFor = new Date(`${date}T${time}:00`).toISOString();

      // Schedule content
      const tableName = `${contentType}s`;
      const { error } = await supabase
        .from(tableName)
        .update({
          status: "scheduled",
          scheduled_at: scheduledFor,
        })
        .eq("id", contentId);

      if (error) throw error;

      await sendTelegramMessage(
        chatId,
        `📅 <b>${contentType}</b> #${contentId} scheduled for ${date} ${time}`
      );

      // Log success
      await supabase.from("telegram_bot_logs").insert({
        telegram_user_id: userId,
        telegram_username: username,
        command: "/schedule",
        content_type: contentType,
        content_id: contentId,
        action: "schedule",
        status: "success",
      });
    } else if (text.startsWith("/delete")) {
      // /delete blog 123
      const parts = text.split(" ");
      const contentType = parts[1];
      const contentId = parseInt(parts[2]);

      if (!contentType || !contentId) {
        await sendTelegramMessage(chatId, "❌ Usage: /delete <type> <id>");
        return;
      }

      // Archive content (soft delete)
      const tableName = `${contentType}s`;
      const { error } = await supabase
        .from(tableName)
        .update({
          status: "archived",
        })
        .eq("id", contentId);

      if (error) throw error;

      await sendTelegramMessage(chatId, `🗑️ <b>${contentType}</b> #${contentId} archived`);

      // Log success
      await supabase.from("telegram_bot_logs").insert({
        telegram_user_id: userId,
        telegram_username: username,
        command: "/delete",
        content_type: contentType,
        content_id: contentId,
        action: "delete",
        status: "success",
      });
    } else if (text.startsWith("/stats")) {
      // Get content statistics
      const { data: blogCount } = await supabase
        .from("blog_posts")
        .select("id", { count: "exact" })
        .eq("status", "published");

      const { data: recipeCount } = await supabase
        .from("recipes")
        .select("id", { count: "exact" })
        .eq("status", "published");

      const { data: vlogCount } = await supabase
        .from("vlogs")
        .select("id", { count: "exact" })
        .eq("status", "published");

      const stats = `
📊 <b>Content Statistics</b>

📝 Blog Posts: ${blogCount?.length || 0}
🎥 Vlogs: ${vlogCount?.length || 0}
🍳 Recipes: ${recipeCount?.length || 0}

Use /help for more commands
      `;

      await sendTelegramMessage(chatId, stats);
    } else if (text.startsWith("/help")) {
      const help = `
🤖 <b>Nuta CMS Bot Commands</b>

<b>Publishing:</b>
/publish &lt;type&gt; &lt;id&gt; - Publish content immediately
/schedule &lt;type&gt; &lt;id&gt; &lt;date&gt; [time] - Schedule content
/delete &lt;type&gt; &lt;id&gt; - Archive content

<b>Types:</b> blog, vlog, recipe, health_tip, story

<b>Moderation:</b>
/approve &lt;id&gt; - Approve community story
/reject &lt;id&gt; - Reject community story
/pending - Show pending submissions

<b>Analytics:</b>
/stats - Show content statistics
/trending - Show trending content

<b>Examples:</b>
/publish blog 42
/schedule recipe 15 2024-12-25 14:30
/delete vlog 8
      `;

      await sendTelegramMessage(chatId, help);
    } else if (text.startsWith("/approve")) {
      // /approve 123
      const communityStoryId = parseInt(text.split(" ")[1]);

      if (!communityStoryId) {
        await sendTelegramMessage(chatId, "❌ Usage: /approve <community_story_id>");
        return;
      }

      const { error } = await supabase
        .from("community_stories")
        .update({
          status: "approved",
          moderated_at: new Date().toISOString(),
        })
        .eq("id", communityStoryId);

      if (error) throw error;

      await sendTelegramMessage(chatId, `✅ Community story #${communityStoryId} approved!`);

      // Log success
      await supabase.from("telegram_bot_logs").insert({
        telegram_user_id: userId,
        telegram_username: username,
        command: "/approve",
        content_type: "community_story",
        content_id: communityStoryId,
        action: "approve",
        status: "success",
      });
    } else if (text.startsWith("/reject")) {
      // /reject 123 reason
      const parts = text.split(" ");
      const communityStoryId = parseInt(parts[1]);
      const reason = parts.slice(2).join(" ") || "Violates community guidelines";

      if (!communityStoryId) {
        await sendTelegramMessage(chatId, "❌ Usage: /reject <id> [reason]");
        return;
      }

      const { error } = await supabase
        .from("community_stories")
        .update({
          status: "rejected",
          moderation_notes: reason,
          moderated_at: new Date().toISOString(),
        })
        .eq("id", communityStoryId);

      if (error) throw error;

      await sendTelegramMessage(
        chatId,
        `❌ Community story #${communityStoryId} rejected\n<i>${reason}</i>`
      );

      // Log success
      await supabase.from("telegram_bot_logs").insert({
        telegram_user_id: userId,
        telegram_username: username,
        command: "/reject",
        content_type: "community_story",
        content_id: communityStoryId,
        action: "reject",
        status: "success",
      });
    } else if (text === "/pending") {
      // Show pending community stories
      const { data: pending } = await supabase
        .from("community_stories")
        .select("id, title, author_id")
        .eq("status", "pending")
        .limit(10);

      if (!pending || pending.length === 0) {
        await sendTelegramMessage(chatId, "✅ No pending submissions!");
        return;
      }

      let message = "⏳ <b>Pending Community Stories</b>\n\n";
      pending.forEach((story: any) => {
        message += `• #${story.id}: ${story.title}\n`;
      });

      await sendTelegramMessage(chatId, message);
    } else {
      // Unknown command
      await sendTelegramMessage(
        chatId,
        "❓ Unknown command. Type /help for available commands."
      );
    }
  } catch (error) {
    console.error("Error handling command:", error);
    await sendTelegramMessage(chatId, `❌ Error: ${error.message}`);

    // Log error
    await supabase.from("telegram_bot_logs").insert({
      telegram_user_id: userId,
      telegram_username: username,
      command: text.split(" ")[0],
      status: "failed",
      error_message: error.message,
    });
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*" } });
  }

  try {
    const body = (await req.json()) as TelegramMessage;

    if (body.message) {
      await handleTelegramCommand(body.message);
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
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
