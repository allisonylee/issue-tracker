import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import KanbanBoard from "@/components/kanban-board";

export const Route = createFileRoute("/projects/$projectId")({
  component: ProjectDetailPage,
});

function ProjectDetailPage() {
  const { projectId } = Route.useParams();
  const project = useQuery(api.projects.get, {
    id: projectId as Id<"projects">,
  });

  if (project === undefined) {
    return <p className="text-muted-foreground">Loading project...</p>;
  }

  if (project === null) {
    return <p className="text-destructive">Project not found.</p>;
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">{project.name}</h2>
        {project.description && (
          <p className="mt-1 text-sm text-muted-foreground">
            {project.description}
          </p>
        )}
      </div>
      <KanbanBoard projectId={project._id} />
    </div>
  );
}
