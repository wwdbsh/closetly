import { useOutletContext } from "react-router";

export default function ProfileOverviewPage() {
  // 레이아웃에서 전달받은 상담사 데이터 사용
  const layoutData = useOutletContext<any>();
  const { counselor } = layoutData;

  return (
    <section className="flex-1 bg-white px-5 py-4 flex flex-col gap-6 overflow-y-auto">
      {/* 환영 인사 */}
      {counselor.introduction_greeting && (
        <div className="bg-[#E6F0FF] text-[#0C284F] rounded-[8px] px-4 py-3 text-sm leading-relaxed">
          {counselor.introduction_greeting}
        </div>
      )}

      {counselor.introItems.map((item: any) => (
        <div key={item.display_order}>
          <h3 className="font-bold text-[#222] mb-3 text-base">{item.title}</h3>
          <div className="text-sm text-[#393939] leading-relaxed whitespace-pre-line">
            {item.description}
          </div>
        </div>
      ))}

    </section>
  );
}
