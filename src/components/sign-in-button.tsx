import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { Github, LogOut } from "lucide-react";

function SignInButton() {
    const { signIn, signOut } = useAuthActions();

    return (
        <>
            <AuthLoading>
                <p className="text-sm text-muted-foreground">Loading...</p>
            </AuthLoading>
            <Unauthenticated>
                <Button onClick={() => void signIn("github")}>
                    <Github className="mr-2 h-4 w-4" />
                    Sign in with GitHub
                </Button>
            </Unauthenticated>
            <Authenticated>
                <Button variant="outline" onClick={() => void signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                </Button>
            </Authenticated>
        </>
    )
}

export default SignInButton;