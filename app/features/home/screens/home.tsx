/**
 * Home Page Component
 * 
 * This file implements the main landing page of the application with internationalization support.
 * It demonstrates the use of i18next for multi-language content, React Router's data API for
 * server-side rendering, and responsive design with Tailwind CSS.
 * 
 * Key features:
 * - Server-side translation with i18next
 * - Client-side translation with useTranslation hook
 * - SEO-friendly metadata using React Router's meta export
 * - Responsive typography with Tailwind CSS
 */

import type { Route } from "./+types/home";

import { useTranslation } from "react-i18next";
import CounselorCard from "~/core/components/counselor-card";

import i18next from "~/core/lib/i18next.server";
import makeServerClient from "~/core/lib/supa-client.server";
import { getCounselors } from "~/features/common/queries";
import { generateSlugsForAllCounselors, encryptProfileId } from "~/core/lib/profile-encryption.server";
import { z } from "zod";
import { data } from "react-router";

const counselorSchema = z.array(z.object({
  profile_id: z.string(),
  avatar_url: z.string(),
  name: z.string(),
  average_rating: z.number(),
  center_name: z.string(),
  short_introduction: z.string(),
  is_verified: z.boolean(),
  review_count: z.number(),
  total_counseling_count: z.number(),
  years_of_experience: z.number()
}));

/**
 * Meta function for setting page metadata
 * 
 * This function generates SEO-friendly metadata for the home page using data from the loader.
 * It sets:
 * - Page title from translated "home.title" key
 * - Meta description from translated "home.subtitle" key
 * 
 * The metadata is language-specific based on the user's locale preference.
 * 
 * @param data - Data returned from the loader function containing translated title and subtitle
 * @returns Array of metadata objects for the page
 */
export const meta: Route.MetaFunction = ({ data }) => {
  return [
    { title: data?.title },
    { name: "description", content: data?.subtitle },
  ];
};

/**
 * Loader function for server-side data fetching
 * 
 * This function is executed on the server before rendering the component.
 * It:
 * 1. Extracts the user's locale from the request (via cookies or Accept-Language header)
 * 2. Creates a translation function for that specific locale
 * 3. Returns translated strings for the page title and subtitle
 * 
 * This approach ensures that even on first load, users see content in their preferred language,
 * which improves both user experience and SEO (search engines see localized content).
 * 
 * @param request - The incoming HTTP request containing locale information
 * @returns Object with translated title and subtitle strings
 */
export async function loader({ request }: Route.LoaderArgs) {
  // Get a translation function for the user's locale from the request
  const t = await i18next.getFixedT(request);
  const [client] = makeServerClient(request);
  const counselors = await getCounselors(client);

  const { success, data: parsedData } = counselorSchema.safeParse(counselors);

  if (!success) {
    throw data(
      {
        error_code: "INVALID_DATA",
        message: "Invalid data",
      },
      { status: 400 }
    );
  }
  
  // Generate slugs for all counselors
  const slugsData = await generateSlugsForAllCounselors();
  
  // Merge counselor data with their slugs
  const counselorsWithSlugs = parsedData.map(counselor => {
    try {
      const slugInfo = slugsData.find(s => s.profile_id === counselor.profile_id);
      return {
        ...counselor,
        slug: slugInfo?.slug || encryptProfileId(counselor.profile_id)
      };
    } catch (error) {
      console.error(`Failed to generate slug for counselor ${counselor.profile_id}:`, error);
      // Fallback to profile_id if encryption fails
      return {
        ...counselor,
        slug: counselor.profile_id
      };
    }
  });
  
  return {
    title: t("home.title"),
    subtitle: t("home.subtitle"),
    counselors: counselorsWithSlugs
  };
}

/**
 * Home page component
 * 
 * This is the main landing page component of the application. It displays a simple,
 * centered layout with a headline and subtitle, both internationalized using i18next.
 * 
 * Features:
 * - Uses the useTranslation hook for client-side translation
 * - Implements responsive design with Tailwind CSS
 * - Maintains consistent translations between server and client
 * 
 * The component is intentionally simple to serve as a starting point for customization.
 * It demonstrates the core patterns used throughout the application:
 * - Internationalization
 * - Responsive design
 * - Clean, semantic HTML structure
 * 
 * @returns JSX element representing the home page
 */
export default function Home({ loaderData }: Route.ComponentProps) {
  // Get the translation function for the current locale
  const { t } = useTranslation();
  const { counselors } = loaderData;
  
  return (
    <div className="flex flex-col bg-[#FFF]">
      <h1
        className="
          text-[20px]
          font-medium
          text-[#393939] 
          px-5 py-8
        "
      >
        상담 분야를 선택해 보세요.
      </h1>

      <div className="w-full">
        {/* 탭바 */}
        <div className="flex border-b border-gray-200 justify-between">
          <button
            className="w-full px-4 pb-1 text-base font-bold text-[#393939] border-b-2 border-[#0C284F] items-center justify-center"
            type="button"
          >
            장소
          </button>
          <button
            className="w-full px-4 pb-1 text-base text-gray-400"
            type="button"
          >
            상황
          </button>
          <button
            className="w-full px-4 pb-1 text-base text-gray-400"
            type="button"
          >
            증상
          </button>
        </div>

        {/* 카테고리 버튼 리스트 */}
        <div className="flex gap-2 px-2 py-4">
          <button className="px-3 py-1 rounded-[13px] bg-[#0C284F] text-white font-semibold text-sm">
            전체
          </button>
          <button className="px-3 py-1 rounded-[13px] bg-[#E8EBEE] text-[#393939] text-sm">
            직장
          </button>
          <button className="px-3 py-1 rounded-[13px] bg-[#E8EBEE] text-[#393939] text-sm">
            학교
          </button>
          <button className="px-3 py-1 rounded-[13px] bg-[#E8EBEE] text-[#393939] text-sm">
            가정
          </button>
          <button className="px-3 py-1 rounded-[13px] bg-[#E8EBEE] text-[#393939] text-sm">
            연애
          </button>
          <button className="px-3 py-1 rounded-[13px] bg-[#E8EBEE] text-[#393939] text-sm">
            자아(본인)
          </button>
        </div>
      </div>

      <ul className="flex flex-col gap-4 px-2 py-4">
        {counselors.map((c, index) => (
          <CounselorCard
            key={index}
            profile_id={c.profile_id}
            name={c.name}
            avatar_url={c.avatar_url}
            average_rating={c.average_rating}
            center_name={c.center_name}
            is_verified={c.is_verified}
            review_count={c.review_count}
            short_introduction={c.short_introduction}
            total_counseling_count={c.total_counseling_count}
            years_of_experience={c.years_of_experience}
            slug={c.slug}
          />
        ))}
      </ul>
    </div>
  );
}
