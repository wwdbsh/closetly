import { Card, CardDescription, CardTitle } from "~/core/components/ui/card";
import { useOutletContext } from "react-router";
import { DateTime } from "luxon";

export default function ProfileArticlesPage() {
  const layoutData = useOutletContext<any>();
  const { counselor } = layoutData;
  
  return (
    <section className="flex flex-col gap-3 px-4 py-6 bg-white">
      {counselor.articles.length > 0 ? (
        counselor.articles.map((article: any, index: number) => (
          <a 
            href={article.article_url}
            target="_blank"
            rel="noopener noreferrer"
            key={index}
          >
            <Card className="rounded-[10px] border border-[#E0E0E0] bg-white px-4 py-3 shadow-sm gap-2 hover:shadow-md transition-shadow">
              <CardTitle className="font-semibold text-[#393939] text-base leading-snug">
                {article.title}
              </CardTitle>
              <CardDescription className="text-xs text-[#707070] mb-3">
                {article.institution}
              </CardDescription>
              <span className="text-xs text-[#707070]">
                {DateTime.fromJSDate(article.published_date).toLocaleString(DateTime.DATE_MED)}
              </span>
            </Card>
          </a>
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-sm text-[#666]">아직 등록된 기사나 논문이 없습니다.</p>
        </div>
      )}
    </section>
  );
}
