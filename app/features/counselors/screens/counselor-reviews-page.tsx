import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/core/components/ui/avatar";

const reviews = [
  {
    id: 1,
    date: "25.05.21",
    score: 5,
    content: "어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고",
  },
  {
    id: 2,
    date: "25.05.19",
    score: 5,
    content: "어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고 어쩌고 저쩌고",
  },
];

export default function CounselorReviewsPage() {
  return (
    <section className="flex flex-col gap-6 px-5 py-6 bg-white">
      {/* 상단 별점/후기 요약 */}
      <div>
        <div className="flex flex-col mb-2">
          <span className="text-[#395B85] font-semibold">
            780개<span className="text-[#393939]">의 후기</span>
          </span>
          <div className="flex items-center text-yellow-400 gap-3">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} className="size-6" fill="currentColor" />
            ))}
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-[#393939]">4.81</span>
              <span className="text-sm text-[#707070] font-semibold">/5.0</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 text-[#393939] text-sm">
          <div className="flex flex-col gap-1">
            <span>상담 전문성</span>
            <span className="flex items-center text-yellow-400 gap-3">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className="size-3" fill="currentColor" />
              ))}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span>좋은 해결책</span>
            <span className="flex items-center text-yellow-400 gap-3">
              {[...Array(4)].map((_, i) => (
                <StarIcon key={i} className="size-3" fill="currentColor" />
              ))}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span>친절한 설명</span>
            <span className="flex items-center text-yellow-400 gap-3">
              {[...Array(3)].map((_, i) => (
                <StarIcon key={i} className="size-3" fill="currentColor" />
              ))}
            </span>
          </div>
        </div>
      </div>

      {/* 후기 리스트 */}
      <div className="flex flex-col gap-6 border-t border-gray-200">
        {reviews.map((review) => (
          <div key={review.id} className=" pt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarFallback className="text-xs font-mono text-[#FFF] bg-[#395B85]">도닥</AvatarFallback>
                  <AvatarImage src='' />
                </Avatar>
                <span className="text-xs text-[#393939]">{review.date}</span>
              </div>
              <span className="text-base font-bold text-[#393939]">
                {review.score}.0
                <span className="text-[#888] text-sm font-normal">/5.0</span>
              </span>
            </div>
            <div className="text-[#707070] text-sm leading-relaxed">
              {review.content}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 