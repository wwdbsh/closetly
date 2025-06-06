import { Card } from "./ui/card";
import { Link } from "react-router";

interface CounselorCardProps {
  profile_id: string;
  name: string;
  avatar_url: string;
  average_rating: number;
  center_name: string;
  is_verified: boolean;
  review_count: number;
  short_introduction: string;
  total_counseling_count: number;
  years_of_experience: number;
}

export default function CounselorCard({
  profile_id,
  name,
  avatar_url,
  average_rating,
  center_name,
  is_verified,
  review_count,
  short_introduction,
  total_counseling_count,
  years_of_experience
}: CounselorCardProps) {
  return (
    <Link to={`/profile/${profile_id}`}>
      <div className="flex rounded-[10px] gap-3 w-full">
        {/* 프로필 이미지 */}
        <img
          src={avatar_url}
          alt="상담사 프로필"
          className="w-[150px] object-cover rounded-[12px] flex-shrink-0 shadow-md"
        />
        {/* 상담사 정보 */}
        <Card className="flex flex-col flex-1 gap-1 bg-[#FFF] rounded-[10px] p-4">
          <div className="flex items-start justify-between">
            <span className="text-[18px] font-bold text-[#222]">{name}</span>
            <span className="text-xs bg-[#F5F5F5] text-[#888] px-2 py-1 rounded-[6px]">
              {total_counseling_count}회
            </span>
          </div>
          <div className="text-sm text-[#393939] mt-1">{short_introduction}</div>
          <div className="flex items-center text-xs text-[#393939] mt-2 gap-1">
            <span>📍</span>
            <span>{center_name}</span>
          </div>
          <div className="text-xs text-[#888] mt-1">
            {years_of_experience}년차 {is_verified && " · 인증완료"}
          </div>
          <div className="flex items-center mt-2 gap-1">
            <span className="text-[#FF6B00] text-base">★</span>
            <span className="text-sm font-semibold text-[#393939]">{average_rating}</span>
            <span className="text-xs text-[#888]">({review_count})</span>
          </div>
        </Card>
      </div>
    </Link>
  );
} 