import { Link } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "~/core/components/ui/avatar";
import { Card } from "~/core/components/ui/card";

const messages = [
  {
    id: 1,
    name: "홍길동",
    center: "심리상담센터 논현점",
    avatar: "/ai-humans/human1.png",
    isNew: true,
    date: "",
  },
  {
    id: 2,
    name: "김서윤",
    center: "강남심리상담",
    avatar: "/ai-humans/human2.png",
    isNew: true,
    date: "",
  },
  {
    id: 3,
    name: "이시연",
    center: "우리함께상담센터 미사리점",
    avatar: "/ai-humans/human3.png",
    isNew: false,
    date: "05.21",
  },
  {
    id: 4,
    name: "박준호",
    center: "마음치료센터 인계점",
    avatar: "/ai-humans/human4.png",
    isNew: false,
    date: "05.19",
  },
];

export default function MessageListPage() {
  return (
    <div className="p-8 bg-[#FFF] min-h-screen">
      <h2 className="text-lg font-semibold mb-4">상담내역</h2>
      <div className="flex flex-col gap-3">
        {messages.map((msg) => (
          <Link to={`/my/messages/${msg.id}`}>
            <Card
              key={msg.id}
              className="flex flex-row items-center justify-between bg-white rounded-[12px] px-4 py-3"
            >
              <div className="flex flex-row items-center gap-3">
                <Avatar className="size-10 rounded-full">
                  <AvatarImage src={msg.avatar} />
                  <AvatarFallback>{msg.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-[#222] text-base">{msg.name}</div>
                  <div className="text-xs text-[#888]">{msg.center}</div>
                </div>
              </div>
              {msg.isNew ? (
                <span className="text-[#395B85] text-sm font-semibold">새 메시지</span>
              ) : (
                <span className="text-xs text-[#888]">{msg.date}</span>
                )}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
} 