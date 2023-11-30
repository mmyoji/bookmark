import { runReminder } from "@/lib/cron/reminder.ts";

// 08:00 AM (JST)
Deno.cron("Remind older bookmarks", "0 23 * * *", runReminder);
