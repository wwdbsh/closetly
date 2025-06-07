import { StarIcon } from "lucide-react";
import { Link, NavLink, Outlet, useParams, useLoaderData, data } from "react-router";
import type { Route } from "./+types/profile-overview-layout";
import { Button } from "~/core/components/ui/button";
import { cn } from "~/core/lib/utils";
import { getCounselorFromSlug } from "~/core/lib/profile-encryption.server";
import { z } from "zod";
import { counselorSchema, loaderDataSchema } from "../z-shema";
import makeServerClient from "~/core/lib/supa-client.server";
import { getCounselorWithDetails } from "~/features/common/queries";
import { mapCounselingMethod } from "~/core/lib/mappers";
import type { CounselingMethodKey } from "~/core/lib/constants";
import { formatNumberWithCommas, formatPricePerHour } from "~/core/lib/formatters";

export async function loader({ params, request }: Route.LoaderArgs) {
  const [client] = makeServerClient(request);
  const { slug } = params;

  // Validate slug parameter
  const slugValidation = z.string().min(1, "Slug is required").safeParse(slug);
  if (!slugValidation.success) {
    throw new Response("Invalid slug parameter", { status: 400 });
  }
  
  // Get counselor info from slug
  const counselorSlugData = await getCounselorFromSlug(slug);
  
  if (!counselorSlugData) {
    throw new Response("Counselor not found", { status: 404 });
  }
  
  // Get full counselor details
  const counselor = await getCounselorWithDetails(client, { profileId: counselorSlugData.profile_id });
  
  if (!counselor) {
    throw new Response("Counselor details not found", { status: 404 });
  }

  const counselorValidation = counselorSchema.safeParse(counselor);

  if (!counselorValidation.success) {
    console.error("Counselor data validation failed:", counselorValidation.error);
    throw data(
      {
        error_code: "INVALID_COUNSELOR_DATA",
        message: "Invalid counselor data format",
        details: counselorValidation.error.errors,
      },
      { status: 500 }
    );
  }

  const validatedCounselor = counselorValidation.data;

  // Return only public information
  return {
    counselor: {
      name: validatedCounselor.name,
      avatar_url: validatedCounselor.avatar_url,
      short_introduction: validatedCounselor.short_introduction,
      introduction_greeting: validatedCounselor.introduction_greeting,
      total_counseling_count: validatedCounselor.total_counseling_count,
      years_of_experience: validatedCounselor.years_of_experience,
      average_rating: validatedCounselor.average_rating,
      review_count: validatedCounselor.review_count,
      center_name: validatedCounselor.center_name,
      center_address: validatedCounselor.center_address,
      is_verified: validatedCounselor.is_verified,
      articles: validatedCounselor.articles,
      methods: validatedCounselor.methods,
      introItems: validatedCounselor.introItems,
      slug: slug,
    },
  };
}

export default function ProfileOverviewLayout() {
  const { slug } = useParams();
  const loaderData = useLoaderData<typeof loader>();

  const validationResult = loaderDataSchema.safeParse(loaderData);

  if (!validationResult.success) {
    console.error("Client-side data validation failed:", validationResult.error);
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">상담사 정보를 불러올 수 없습니다.</p>
        </div>
      </div>
    );
  }

  const { counselor } = validationResult.data;

  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* 프로필 카드 */}
      <section className="bg-[#E8EBEE] px-5 py-5">
        <div className="flex gap-4">
          {/* TODO: 프로필 이미지 추가 */}
          <img src={counselor.avatar_url} alt="상담사 프로필" className="w-[100px] object-cover rounded-[12px] flex-shrink-0" />
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex items-start justify-between">
              <span className="text-[18px] font-medium text-[#393939]">{counselor.name} 상담사</span>
              <span className="text-xs bg-[#FAFAF8] text-[#393939] px-2 py-1 rounded-[20px]">
              {formatNumberWithCommas(counselor.total_counseling_count)}회
              </span>
            </div>
            <div className="flex gap-1 mt-1">
              <span className="text-xs bg-[#395B85] text-[#FFF] px-2 py-1 rounded-[10px]">
                경력 {counselor.years_of_experience}년
              </span>
              {counselor.is_verified && (
                <span className="text-xs bg-[#395B85] text-[#FFF] px-2 py-1 rounded-[10px]">인증완료</span>
              )}
            </div>
            <div className="text-sm text-[#393939] mt-3">
              {counselor.short_introduction || "따뜻한 마음으로 다가가는 전문 상담사입니다."}
            </div>
            {counselor.center_name && (
              <div className="flex items-center text-xs text-[#393939] mt-2 gap-1">
                <span>📍</span>
                <span>{counselor.center_name}</span>
              </div>
            )}
            <div className="flex items-center mt-2 gap-1">
              <div className="flex text-yellow-400">
                <StarIcon className="size-3" fill="currentColor" />
              </div>
              <span className="text-xs text-[#393939]">{counselor.average_rating} ({counselor.review_count})</span>
            </div>
          </div>
        </div>
      </section>

      {/* 최저가격/상담방식 */}
      <section className="bg-[#FAFAF8] px-5 py-3 flex flex-col gap-2">
        <div className="flex gap-8 text-sm">
          <span className="text-[#393939] font-bold">최저 가격</span>
          <span className="text-[#707070]">
            {formatPricePerHour(Math.min(...counselor.methods.map((method) => method.price_per_hour)))}
          </span>
        </div>
        <div className="flex gap-8 text-sm">
          <span className="text-[#393939] font-bold">상담 방식</span>
          <span className="text-[#707070]">
            {counselor.methods.map((method) => mapCounselingMethod(method.method as CounselingMethodKey)).join(", ")}
          </span>
        </div>
      </section>

      {/* 탭바 */}
      <div className="w-full flex border-b border-gray-200 bg-[#FAFAF8]">
        <NavLink
          end
          className={({ isActive }) =>
            cn(
              "w-full px-4 py-2 text-base font-semibold text-center",
              isActive ? "text-[#393939] border-b-2 border-[#0C284F]" : "text-[#B2B2B2]"
            )
          }
          to={`/profile/${slug}/overview`}
        >
          소개
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            cn(
              "w-full px-4 py-2 text-base font-semibold text-center",
              isActive ? "text-[#393939] border-b-2 border-[#0C284F]" : "text-[#B2B2B2]"
            )
          }
          to={`/profile/${slug}/reviews`}
        >
          후기
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            cn(
              "w-full px-4 py-2 text-base font-semibold text-center",
              isActive ? "text-[#393939] border-b-2 border-[#0C284F]" : "text-[#B2B2B2]"
            )
          }
          to={`/profile/${slug}/articles`}
        >
          기사/논문
        </NavLink>
      </div>

      <div className="flex-1 bg-white">
        <Outlet context={{ counselor }} />
      </div>

      {/* 하단 버튼 */}
      <div className="flex gap-2 px-5 py-4 bg-white border-t border-gray-200">
        <Button variant="outline" className="flex-1 h-12 rounded-[10px] border border-[#393939] text-[#393939] font-bold">이전</Button>
        <Button className="flex-4 h-12 rounded-[10px] bg-[#0C284F] text-white font-bold" asChild>
          <Link to={`/profile/${slug}/reservation`}>바로 예약</Link>
        </Button>
      </div>
    </div>
  )
}