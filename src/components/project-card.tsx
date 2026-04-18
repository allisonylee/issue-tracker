import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Doc } from "../../convex/_generated/dataModel";
import DeleteProjectDialog from "@/components/delete-project-dialog";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

type ProjectCardProps = {
  project: Doc<"projects">;
};

function ProjectCard({ project }: ProjectCardProps) {
  const currentUser = useQuery(api.users.currentUser);
  const isOwner = currentUser?._id === project.ownerId;

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Link to="/projects/$projectId" params={{ projectId: project._id }}>
            <CardTitle className="text-base">{project.name}</CardTitle>
          </Link>
          {
            isOwner && (
              <DeleteProjectDialog
                projectId={project._id}
                projectName={project.name}
              />
            )
          }
          
        </div>
      </CardHeader>
      {project.description && (
        <Link to="/projects/$projectId" params={{ projectId: project._id }}>
          <CardContent>
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {project.description}
            </p>
          </CardContent>
        </Link>
      )}
    </Card>
  );
}

export default ProjectCard;
