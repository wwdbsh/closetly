import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

export async function getUserProfile(
  client: SupabaseClient<Database>,
  { userId }: { userId: string | null },
) {
  if (!userId) {
    return null;
  }
  const { data, error } = await client
    .from("profiles")
    .select("*")
    .eq("profile_id", userId)
    .single();
  if (error) {
    throw error;
  }
  return data;
}

export async function getCounselors(
  client: SupabaseClient<Database>,
) {
  const { data, error } = await client
    .from("profiles")
    .select(`
      profile_id,
      avatar_url,
      name,
      counselors!inner (
        average_rating,
        center_name,
        short_introduction,
        is_verified,
        review_count,
        total_counseling_count,
        years_of_experience
      )
    `)
    .then(({ data }) => ({
      data: data?.map(({ counselors, ...rest }) => ({
        ...rest,
        ...counselors
      })),
      error: null
    }));
    
  if (error) {
    throw error;
  }
  return data;
}
