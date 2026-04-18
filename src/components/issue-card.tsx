import { useDraggable } from "@dnd-kit/core";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation } from "convex/react";
import useUpdateIssueStatus from "@/hooks/use-update-issue-status";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";

type IssueCardProps = {
  issue: Doc<"issues">;
  isOverlay?: boolean;
};

function IssueCard({ issue, isOverlay }: IssueCardProps) {
  const updateStatus = useUpdateIssueStatus(issue.projectId);
  const removeIssue = useMutation(api.issues.remove);

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: issue._id,
    disabled: isOverlay,
  });

  return (
    <Card
      ref={isOverlay ? undefined : setNodeRef}
      className={`transition-shadow hover:shadow-md ${isDragging ? "opacity-0" : ""} ${isOverlay ? "shadow-lg ring-2 ring-primary opacity-100" : ""}`}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle
          className="flex-1 cursor-grab text-sm font-medium leading-snug active:cursor-grabbing"
          {...listeners}
          {...attributes}
        >
          {issue.title}
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {issue.status !== "todo" && (
              <DropdownMenuItem
                onClick={() => updateStatus({ id: issue._id, status: "todo" })}
              >
                Move to To Do
              </DropdownMenuItem>
            )}
            {issue.status !== "in-progress" && (
              <DropdownMenuItem
                onClick={() =>
                  updateStatus({ id: issue._id, status: "in-progress" })
                }
              >
                Move to In Progress
              </DropdownMenuItem>
            )}
            {issue.status !== "done" && (
              <DropdownMenuItem
                onClick={() => updateStatus({ id: issue._id, status: "done" })}
              >
                Move to Done
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => removeIssue({ id: issue._id })}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      {issue.description && (
        <CardContent>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {issue.description}
          </p>
        </CardContent>
      )}
    </Card>
  );
}

export default IssueCard;
