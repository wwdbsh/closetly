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
  
  // Return translated strings for use in both the component and meta function
  return {
    title: t("home.title"),
    subtitle: t("home.subtitle"),
  };
}

const dummyData = [
  {
    image: "/ai-humans/human1.png",
    name: "홍길동",
    totalSessions: "2,000회",
    description: "항상 따뜻한 마음으로 다가가는 상담사, 홍길동입니다.",
    center: "심리상담센터 논현점",
    career: "10년차",
    online: "온라인상담가능",
    certified: "인증완료",
    rating: "4.81",
    reviews: "780",
  },
  {
    image: "/ai-humans/human2.png",
    name: "김서윤",
    totalSessions: "1,842회",
    description: "당신의 이야기를 끝까지 들어주는 상담사",
    center: "강남심리상담",
    career: "14년차",
    online: "온라인상담가능",
    certified: "인증완료",
    rating: "4.95",
    reviews: "58",
  },
  {
    image: "/ai-humans/human3.png",
    name: "이시연",
    totalSessions: "1,210회",
    description: "불안과 우울, 함께 천천히 마주해볼까요?",
    center: "우리함께상담센터 미사리점",
    career: "3년차",
    online: "온라인상담가능",
    certified: "인증완료",
    rating: "4.88",
    reviews: "492",
  },
  {
    image: "/ai-humans/human4.png",
    name: "박준호",
    totalSessions: "1,117회",
    description: "내 마음을 나도 모를 때, 제가 도와드릴게요.",
    center: "마음치료센터 인계점",
    career: "9년차",
    online: "온라인상담가능",
    certified: "인증완료",
    rating: "4.76",
    reviews: "39",
  },
  {
    image: "/ai-humans/human5.png",
    name: "김영호",
    totalSessions: "1,022회",
    description: "육아 스트레스와 부부관계, 저와 함께 정리해봐요",
    center: "심리상담재활센터 중화점",
    career: "11년차",
    online: "온라인상담가능",
    certified: "인증완료",
    rating: "4.77",
    reviews: "290",
  },
  {
    image: "/ai-humans/human6.png",
    name: "임하진",
    totalSessions: "830회",
    description: "감정 조절과 분노 관리, 훈련이 아니라 이해로 시작합니다",
    center: "마음치료센터 강북점",
    career: "4년차",
    online: "온라인상담가능",
    certified: "인증완료",
    rating: "4.91",
    reviews: "188",
  },
];

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
export default function Home() {
  // Get the translation function for the current locale
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col justify-center">
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
        {dummyData.map((data, index) => (
          <CounselorCard
            key={index}
            {...data}
          />
        ))}
      </ul>
    </div>
  );
}
