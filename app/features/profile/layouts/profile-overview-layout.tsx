import { StarIcon } from "lucide-react";
import { Link, NavLink, Outlet, useParams } from "react-router";
import { Button } from "~/core/components/ui/button";
import { cn } from "~/core/lib/utils";

// TODO: 실제 데이터 패칭 로직으로 대체 필요
const mockCounselors = {
  "1": {
    image: "/ai-humans/human1.png",
    name: "홍길동 상담사",
    badges: ["10년차", "인증완료"],
    totalSessions: "누적 상담 2,000회",
    description: "항상 따뜻한 마음으로 다가가는 상담사, 홍길동입니다.",
    center: "심리상담센터 논현점",
    rating: "4.81",
    reviews: "780",
    quickReserve: "오늘 오후 7:00 부터",
    minPrice: "79,000원/1시간",
    methods: "채팅, 전화, 방문, 화상",
  },
};


export default function ProfileOverviewLayout() {
  const { counselorId } = useParams();
  // const counselor = mockCounselors[counselorId as keyof typeof mockCounselors];
  const counselor = mockCounselors["1"];

  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* 프로필 카드 */}
      <section className="bg-[#E8EBEE] px-5 py-5">
        <div className="flex gap-4">
          <img src={counselor.image} alt="상담사 프로필" className="w-[100px] object-cover rounded-[12px] flex-shrink-0" />
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex items-start justify-between">
              <span className="text-[18px] font-medium text-[#393939]">{counselor.name}</span>
              <span className="text-xs bg-[#FAFAF8] text-[#393939] px-2 py-1 rounded-[20px]">
                {counselor.totalSessions}
              </span>
            </div>
            <div className="flex gap-1 mt-1">
              {counselor.badges.map((b, i) => (
                <span key={i} className="text-xs bg-[#395B85] text-[#FFF] px-2 py-1 rounded-[10px]">{b}</span>
              ))}
            </div>
            <div className="text-sm text-[#393939] mt-3">{counselor.description}</div>
            <div className="flex items-center text-xs text-[#393939] mt-2 gap-1">
              <span>📍</span>
              <span>{counselor.center}</span>
            </div>
            <div className="flex items-center mt-2 gap-1">
              <div className="flex text-yellow-400">
                <StarIcon className="size-3" fill="currentColor" />
              </div>
              <span className="text-xs text-[#393939]">{counselor.rating} ({counselor.reviews})</span>
            </div>
          </div>
        </div>
      </section>

      {/* 빠른예약/최저가격/상담방식 */}
      <section className="bg-[#FAFAF8] px-5 py-3 flex flex-col gap-2">
        <div className="flex gap-8 text-sm">
          <span className="text-[#393939] font-bold">빠른 예약</span>
          <span className="text-[#707070]">{counselor.quickReserve}</span>
        </div>
        <div className="flex gap-8 text-sm">
          <span className="text-[#393939] font-bold">최저 가격</span>
          <span className="text-[#707070]">{counselor.minPrice}</span>
        </div>
        <div className="flex gap-8 text-sm">
          <span className="text-[#393939] font-bold">상담 방식</span>
          <span className="text-[#707070]">{counselor.methods}</span>
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
          to={`/profile/${counselorId}/overview`}
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
          to={`/profile/${counselorId}/reviews`}
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
          to={`/profile/${counselorId}/articles`}
        >
          기사/논문
        </NavLink>
      </div>

      <div className="flex-1 bg-white">
        <Outlet />
      </div>

      {/* 하단 버튼 */}
      <div className="flex gap-2 px-5 py-4 bg-white border-t border-gray-200">
        <Button variant="outline" className="flex-1 h-12 rounded-[10px] border border-[#393939] text-[#393939] font-bold">이전</Button>
        <Button className="flex-4 h-12 rounded-[10px] bg-[#0C284F] text-white font-bold" asChild>
          <Link to={`/profile/${counselorId}/reservation`}>바로 예약</Link>
        </Button>
      </div>
    </div>
  )
}