import { useParams } from "react-router";

// TODO: 실제 데이터 패칭 로직으로 대체 필요
const mockCounselors = {
  "1": {
    image: "/ai-humans/human1.png",
    name: "홍길동 상담사",
    badges: ["10년차", "온라인상담", "인증완료"],
    totalSessions: "누적 상담 2,000회",
    description: "항상 따뜻한 마음으로 다가가는 상담사, 홍길동입니다.",
    center: "심리상담센터 논현점",
    rating: "4.81",
    reviews: "780",
    quickReserve: "오늘 오후 7:00 부터",
    minPrice: "79,000원/1시간",
    methods: "채팅, 전화, 방문, 화상",
    intro: "안녕하세요. 심리상담센터 논현점 전문 상담사 홍길동입니다. 전문가의 시선에서 빠르고 쉬운 상담을 도와드립니다.",
    sections: [
      { title: "심리상담을 망설이는 분에게", content: "어서오고 저쩌고 ..." },
      { title: "첫 상담이 중요한 이유", content: "어서오고 저쩌고 ..." },
      { title: "어떤 상담사를 선택해야하는가", content: "어서오고 저쩌고 ..." },
    ],
  },
};

export default function CounselorDetail() {
  const { id } = useParams();
  const counselor = mockCounselors[id as keyof typeof mockCounselors];

  if (!counselor) {
    return <div className="p-8 text-center text-gray-400">상담사 정보를 찾을 수 없습니다.</div>;
  }

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
              <span className="text-[#FF6B00] text-base">★</span>
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
        <button className="w-full px-4 py-3 text-base font-semibold text-[#393939] border-b-2 border-[#0C284F]">소개</button>
        <button className="w-full px-4 py-3 text-base font-semibold text-gray-400">후기</button>
        <button className="w-full px-4 py-3 text-base font-semibold text-gray-400">기사/논문</button>
      </div>

      {/* 소개글 */}
      <section className="flex-1 bg-white px-5 py-4 flex flex-col gap-4 overflow-y-auto">
        <div className="bg-[#E6F0FF] text-[#0C284F] rounded-[8px] px-4 py-3 text-sm">
          {counselor.intro}
        </div>
        {counselor.sections.map((sec, i) => (
          <div key={i}>
            <div className="font-bold text-[#222] mb-1">{sec.title}</div>
            <div className="text-sm text-[#393939] whitespace-pre-line">{sec.content}</div>
          </div>
        ))}
      </section>

      {/* 하단 버튼 */}
      <div className="flex gap-2 px-5 py-4 bg-white border-t border-gray-200">
        <button className="flex-1 h-12 rounded-[10px] border border-[#393939] text-[#393939] font-bold">이전</button>
        <button className="flex-3 h-12 rounded-[10px] bg-[#0C284F] text-white font-bold">예약하기</button>
      </div>
    </div>
  );
} 