import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";
import { counselorViewSchema } from "./z-schema";
import { z } from "zod";

export async function getCounselors(
  client: SupabaseClient<Database>,
) {
  try {
    const { data, error } = await client
        .from("counselor_view")
        .select("*")
  
    if (error) {
      throw error;
    }
  
    const counselors = z.array(counselorViewSchema).parse(data);
    
    return counselors;
  } catch (error) {
    console.error('Error fetching counselors:', error);
    return null;
  }
}

/**
 * Helper function to get counselor data by profile ID
 * This is used internally for generating URLs and validating access
 * 
 * @param profileId - The profile UUID
 * @returns Counselor data or null
 */
export async function getCounselorWithDetails(
  client: SupabaseClient<Database>,
  { profileId }: { profileId: string }
) {
  try {
    const { data, error } = await client
      .from("counselor_view")
      .select("*")
      .eq("profile_id", profileId)
      .single();

    if (error) {
      throw error;
    }

    const counselor = counselorViewSchema.parse(data);

    const [articles, methods, introItems] = await Promise.all([
      client
        .from("counselor_articles")
        .select("*")
        .eq("counselor_id", counselor.profile_id),
      client
        .from("counselor_available_methods")
        .select("*")
        .eq("is_active", true)
        .eq("counselor_id", counselor.profile_id),
      client
        .from("counselor_introduction_items")
        .select("*")
        .eq("counselor_id", counselor.profile_id),
    ]);

    console.log(counselor.profile_id);
    console.log(articles.data);
    console.log(methods.data);
    console.log(introItems.data);

    return {
      ...counselor,
      articles: articles.data || [],
      methods: methods.data || [],
      introItems: introItems.data || [],
    };
  } catch (error) {
    console.error('Error fetching counselor by profile ID:', error);
    return null;
  }
}
