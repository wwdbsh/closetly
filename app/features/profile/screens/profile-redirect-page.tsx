import { redirect } from "react-router";
import type { Route } from "./+types/profile-redirect-page";
import { getCounselorFromSlug } from "~/core/lib/profile-encryption.server";

export async function loader({ params }: Route.LoaderArgs) {
  const { slug } = params;
  
  // Validate that the slug corresponds to a real counselor
  const counselor = await getCounselorFromSlug(slug);
  
  if (!counselor) {
    // Redirect to 404 or error page if counselor not found
    throw new Response("Counselor not found", { status: 404 });
  }
  
  return redirect(`/profile/${slug}/overview`);
}