import { Send, SendIcon } from "lucide-react";
import { Button } from "~/core/components/ui/button";

const message = {
  counselor: {
    name: "홍길동",
    center: "심리상담센터 논현점",
    avatar: "/ai-humans/human1.png",
  },
  date: "2025년 05월 30일",
  content: "안녕하세요. 우울증 관련 상담 받고 싶어요",
};

export default function MessagePage() {
  return (
    <div className="w-full min-h-screen flex flex-col overflow-hidden">

      {/* 상담사 정보 */}
      <div className="flex items-center gap-3 px-5 py-4 bg-[#FFF] border-b border-[#E8EBEE]">
        <img
          src={message.counselor.avatar}
          alt={message.counselor.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <div className="font-semibold text-[#393939] text-base">{message.counselor.name}</div>
          <div className="text-xs text-[#393939]">{message.counselor.center}</div>
        </div>
      </div>

      {/* 채팅 영역 */}
      <div className="flex-1 bg-[#FAFAF8] px-5 py-6 flex flex-col overflow-y-auto">
        <div className="mx-auto text-xs text-[#222] mb-2">{message.date}</div>
        <div className="flex justify-end">
          <div className="bg-white rounded-[8px] px-4 py-2 text-sm text-[#222] shadow max-w-[70%]">
            {message.content}
          </div>
        </div>
      </div>

      {/* 입력창 */}
      <div className="bg-white px-5 py-4 flex items-center gap-2">
        <textarea
          placeholder="메시지 입력"
          rows={4}
          className="w-full border-none outline-none bg-transparent text-[#393939] placeholder:text-[#B2B2B2] text-sm resize-none min-h-[80px] max-h-[160px] rounded-lg"
        />
        <Button
          className="bg-[#0C284F] hover:bg-[#395B85] transition-colors rounded-sm"
        >
          <Send className="size-5 text-white" />
        </Button>
      </div>
    </div>
  );
} 