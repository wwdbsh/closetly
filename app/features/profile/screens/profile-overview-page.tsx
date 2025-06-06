export default function ProfileOverviewPage({}) {
  return (
    <section className="flex-1 bg-white px-5 py-4 flex flex-col gap-4 overflow-y-auto">
      <div className="bg-[#E6F0FF] text-[#0C284F] rounded-[8px] px-4 py-3 text-sm">
        안녕하세요. 심리상담센터 논현점 전문 상담사 홍길동입니다. 전문가의 시선에서 빠르고 쉬운 상담을 도와드립니다.
      </div>
      <div>
        <div className="font-bold text-[#222] mb-1">심리상담을 망설이는 분에게</div>
        <div className="text-sm text-[#393939] whitespace-pre-line">어서오고 저쩌고 ...</div>
      </div>
      <div>
        <div className="font-bold text-[#222] mb-1">첫 상담이 중요한 이유</div>
        <div className="text-sm text-[#393939] whitespace-pre-line">어서오고 저쩌고 ...</div>
      </div>
      <div>
        <div className="font-bold text-[#222] mb-1">어떤 상담사를 선택해야하는가</div>
        <div className="text-sm text-[#393939] whitespace-pre-line">어서오고 저쩌고 ...</div>
      </div>
    </section>
  );
} 