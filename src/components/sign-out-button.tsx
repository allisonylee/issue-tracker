import { useQuery } from "convex/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "../../convex/_generated/api";

function SignedOutButton({ onSignOut }: { onSignOut: () => void }) {
  const user = useQuery(api.users.currentUser);

  return (
    <div className="flex items-center gap-3">
      {user && (
        <div className="flex items-center gap-2">
          {user.image && (
            <img
              src={user.image}
              alt={user.name ?? "User avatar"}
              className="h-8 w-8 rounded-full border"
            />
          )}
          {user.name && (
            <span className="text-sm font-medium">{user.name}</span>
          )}
        </div>
      )}
      <Button variant="outline" onClick={onSignOut}>
        <LogOut className="mr-2 h-4 w-4" />
        Sign out
      </Button>
    </div>
  );
}

export default SignedOutButton;
