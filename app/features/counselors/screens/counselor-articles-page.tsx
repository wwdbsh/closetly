import { Link } from "react-router";
import { Card, CardDescription, CardTitle } from "~/core/components/ui/card";

const articles = [
  {
    id: 1,
    title: "심리상담 받는 게 왜 창피해요?...감기 치료하듯 간다는 2030",
    source: "매일경제",
    date: "2023.10.29",
  },
  {
    id: 2,
    title: "초췌할 땐 없었다는 그들, 원스톱 전문 심리상담 필요",
    source: "중앙일보",
    date: "2023.08.11",
  },
  {
    id: 3,
    title: "우울증과 조울증의 상관관계",
    source: "서강대학교",
    date: "2021.09.22",
  },
  {
    id: 4,
    title: "전시과약 먹으며 바보된다? 정신의학과 경계하는 심리상담",
    source: "동아일보",
    date: "2020.12.01",
  },
];

export default function CounselorArticlesPage() {
  return (
    <section className="flex flex-col gap-3 px-4 py-6 bg-white">
      {articles.map((article) => (
        <Link to={`/counselors/articles/${article.id}`} key={article.id}>
          <Card
            key={article.id}
            className="rounded-[10px] border border-[#E0E0E0] bg-white px-4 py-3 shadow-sm gap-2"
          >
            <CardTitle className="font-semibold text-[#393939] text-base leading-snug">
              {article.title}
            </CardTitle>
            <CardDescription className="text-xs text-[#707070] mb-3">{article.source}</CardDescription>
            <span className="text-xs text-[#707070]">{article.date}</span>
          </Card>
        </Link>
      ))}
    </section>
  );
} 