import { LearningPathDetail } from "@/components/learning-path-detail";
import { learningPaths } from "@/lib/learning-data";

export default async function PathPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  const path = learningPaths[domain as keyof typeof learningPaths];

  if (!path) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-4xl font-bold text-foreground">Path not found</h1>
      </div>
    );
  }

  return <LearningPathDetail path={path} domain={domain} />;
}
