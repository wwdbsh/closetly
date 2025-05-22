import { Card } from "./ui/card";
import { Link } from "react-router";

interface CounselorCardProps {
  id: string;
  image: string;
  name: string;
  totalSessions: string;
  description: string;
  center: string;
  career: string;
  online: string;
  certified: string;
  rating: string;
  reviews: string;
}

export default function CounselorCard({
  id,
  image,
  name,
  totalSessions,
  description,
  center,
  career,
  online,
  certified,
  rating,
  reviews,
}: CounselorCardProps) {
  return (
    <Link to={`/counselors/${id}`}>
      <div className="flex rounded-[10px] gap-3 w-full">
        {/* 프로필 이미지 */}
        <img
          src={image}
          alt="상담사 프로필"
          className="w-[150px] object-cover rounded-[12px] flex-shrink-0 shadow-md"
        />
        {/* 상담사 정보 */}
        <Card className="flex flex-col flex-1 gap-1 bg-[#FFF] rounded-[10px] p-4">
          <div className="flex items-start justify-between">
            <span className="text-[18px] font-bold text-[#222]">{name}</span>
            <span className="text-xs bg-[#F5F5F5] text-[#888] px-2 py-1 rounded-[6px]">
              {totalSessions}
            </span>
          </div>
          <div className="text-sm text-[#393939] mt-1">{description}</div>
          <div className="flex items-center text-xs text-[#393939] mt-2 gap-1">
            <span>📍</span>
            <span>{center}</span>
          </div>
          <div className="text-xs text-[#888] mt-1">
            {career} · {online} · {certified}
          </div>
          <div className="flex items-center mt-2 gap-1">
            <span className="text-[#FF6B00] text-base">★</span>
            <span className="text-sm font-semibold text-[#393939]">{rating}</span>
            <span className="text-xs text-[#888]">({reviews})</span>
          </div>
        </Card>
      </div>
    </Link>
  );
} 