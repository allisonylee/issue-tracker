import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

function useUpdateIssueStatus(projectId: Id<"projects">) {
  return useMutation(api.issues.updateStatus).withOptimisticUpdate(
    (localStore, args) => {
      const issues = localStore.getQuery(api.issues.list, {
        projectId,
      });

      if (!issues) {
        return;
      }

      localStore.setQuery(
        api.issues.list,
        { projectId },
        issues.map((issue) =>
          issue._id === args.id ? { ...issue, status: args.status } : issue,
        ),
      );
    },
  );
}

export default useUpdateIssueStatus;
