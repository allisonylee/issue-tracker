import { useDroppable } from "@dnd-kit/core";
import { Badge } from "@/components/ui/badge";
import IssueCard from "@/components/issue-card";
import type { Doc } from "../../convex/_generated/dataModel";

type ColumnProps = {
  title: string;
  status: string;
  issues: Doc<"issues">[];
};

function Column({ title, status, issues }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  const borderColor: Record<string, string> = {
    todo: "border-l-blue-500",
    "in-progress": "border-l-amber-500",
    done: "border-l-green-500",
  };

  return (
    <div
      ref={setNodeRef}
      className={`rounded-lg border-l-4 bg-muted/50 p-4 transition-colors ${borderColor[status]} ${isOver ? "bg-muted" : ""}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </h2>
        <Badge variant="secondary">{issues.length}</Badge>
      </div>
      <div className="space-y-3">
        {issues.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No issues
          </p>
        ) : (
          issues.map((issue) => <IssueCard key={issue._id} issue={issue} />)
        )}
      </div>
    </div>
  );
}

export default Column;
