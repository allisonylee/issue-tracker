import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Doc } from "../../convex/_generated/dataModel";

type EditIssueDialogProps = {
    issue: Doc<"issues">;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

function EditIssueDialog({issue, open, onOpenChange}: EditIssueDialogProps) {
    const [title, setTitle] = useState(issue.title);
    const [description, setDescription] = useState(issue.description);

    const updateIssue = useMutation(api.issues.update);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!title.trim()) return;
        await updateIssue({
            id: issue._id,
            title: title.trim(),
            description: description.trim(),
        });
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Issue</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="edit-title" className="text-sm font-medium">
                            Title
                        </label>
                        <Input 
                            id="edit-title"
                            placeholder="Enter issue title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="edit-description" className="text-sm font-medium">
                            Description
                        </label>
                        <Textarea
                            id="edit-description"
                            placeholder="Enter issue description (optional)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">Save changes</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default EditIssueDialog;