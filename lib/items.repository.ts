import { SupabaseClient } from "@/lib/supabase.ts";

export class ItemsRepository {
  #supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.#supabase = supabase;
  }

  async create(
    { url, title, uid }: { url: string; title: string; uid: string },
  ): Promise<void> {
    await this.#supabase.from("items").insert({ url, title, uid });
  }

  findMany(minDate: string, maxDate: string) {
    const key = "created_at";
    return this.#supabase
      .from("items")
      .select("*")
      .gte(key, minDate)
      .lt(key, maxDate)
      .order(key, { ascending: true });
  }
}
