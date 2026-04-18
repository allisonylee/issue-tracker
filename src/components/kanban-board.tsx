import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { useQuery } from "convex/react";
import useUpdateIssueStatus from "@/hooks/use-update-issue-status";
import { api } from "../../convex/_generated/api";
import type { Doc, Id } from "../../convex/_generated/dataModel";
import Column from "@/components/column";
import IssueCard from "@/components/issue-card";
import AddIssueDialog from "@/components/add-issue-dialog";

type IssueStatus = "todo" | "in-progress" | "done";

const COLUMNS: { title: string; status: IssueStatus }[] = [
  { title: "To Do", status: "todo" },
  { title: "In Progress", status: "in-progress" },
  { title: "Done", status: "done" },
];

type KanbanBoardProps = {
  projectId: Id<"projects">;
};

function KanbanBoard({ projectId }: KanbanBoardProps) {
  const issues = useQuery(api.issues.list, { projectId });
  const updateStatus = useUpdateIssueStatus(projectId);
  const [activeIssue, setActiveIssue] = useState<Doc<"issues"> | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  function handleDragStart(event: DragStartEvent) {
    const issue = issues?.find((i) => i._id === event.active.id);
    setActiveIssue(issue ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) {
      setActiveIssue(null);
      return;
    }

    const issueId = active.id as Id<"issues">;
    const newStatus = over.id as IssueStatus;
    const issue = issues?.find((i) => i._id === issueId);

    if (issue && issue.status !== newStatus) {
      updateStatus({ id: issueId, status: newStatus });
    }

    setActiveIssue(null);
  }

  if (issues === undefined) {
    return <p className="text-muted-foreground">Loading issues...</p>;
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div>
        <div className="mb-6 flex justify-end">
          <AddIssueDialog projectId={projectId} />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {COLUMNS.map((column) => (
            <Column
              key={column.status}
              title={column.title}
              status={column.status}
              issues={issues.filter((issue) => issue.status === column.status)}
            />
          ))}
        </div>
      </div>
      <DragOverlay>
        {activeIssue ? <IssueCard issue={activeIssue} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}

export default KanbanBoard;
