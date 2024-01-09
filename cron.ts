import { runReminder } from "@/lib/cron/reminder.ts";

// 08:00 AM (JST)
Deno.cron("Remind older bookmarks", { minute: 0, hour: 23 }, runReminder);
