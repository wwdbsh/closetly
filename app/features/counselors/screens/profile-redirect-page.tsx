import { redirect } from "react-router";
import type { Route } from "./+types/profile-redirect-page";

export function loader({ params }: Route.LoaderArgs) {
  const { counselorId } = params;
  return redirect(`/counselors/${counselorId}/overview`);
}