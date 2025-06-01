'use client'
import { Database } from "@/database.types";
import React, { useId } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Link from "next/link";
import { Button } from "../ui/button";
import { formatDistanceToNow } from "date-fns";
import {
  CheckCircle2,
  Clock,
  Loader2,
  Trash2,
  User2,
  XCircle,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { deleteModel } from "@/app/actions/model-actions";

type ModelType = {
  error: string | null;
  success: boolean;
  data: Database["public"]["Tables"]["models"]["Row"][] | null;
};

interface ModelListProps {
  models: ModelType;
}

const ModelList = ({ models }: ModelListProps) => {
  const { data, success, error } = models;

  const toastId = useId();

  const handleDeleteModel = async (id: number, model_id: string, model_version: string) => {
    toast.loading("Deleting the model ...", { id: toastId });

    const { success, error } = await deleteModel(id, model_id, model_version);

    if (success) {
      toast.success("Model Deleted successfully!", { id: toastId });
      window.location.reload(); // Refresh the page to show updated models list
    }

    if (error) {
      toast.error(error, { id: toastId });
    }
  };

  if (data?.length === 0) {
    return (
      <Card className="flex h-[450px] justify-center text-center bg-gradient-to-br from-muted/20 to-background rounded-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight">No Models Found</CardTitle>
        </CardHeader>
        <CardDescription className="px-6 flex flex-col items-center">
          <p className="mb-6 text-lg text-muted-foreground">You haven't created any models yet.</p>
          <Link href="/model-training">
            <Button className="w-fit px-8 py-6 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-lg font-medium shadow-lg transition-all hover:shadow-xl">
              Create Your First Model
            </Button>
          </Link>
        </CardDescription>
      </Card>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {data?.map((model) => (
        <Card
          key={model.id}
          className="relative flex flex-col h-full transition-all hover:shadow-2xl hover:-translate-y-2 border-0 hover:ring-2 ring-primary/20 bg-white overflow-hidden rounded-2xl group"
        >
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <CardTitle className="text-2xl font-bold tracking-tight text-primary">
                  {model.model_name}
                </CardTitle>
              </div>

              <div className="flex items-center justify-between gap-2">
                {model.training_status === "succeeded" ? (
                  <div className="flex items-center gap-2 text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="capitalize">Ready</span>
                  </div>
                ) : model.training_status === "failed" ||
                  model.training_status === "canceled" ? (
                  <div className="flex items-center gap-2 text-sm font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full">
                    <XCircle className="w-4 h-4" />
                    <span className="capitalize">{model.training_status}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm font-medium text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="capitalize">Training</span>
                  </div>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-9 h-9 text-muted-foreground/70 hover:text-destructive hover:bg-destructive/10 cursor-pointer rounded-full transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-2xl">
                        Delete Model?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-base">
                        This will permanently delete "{model.model_name}" and cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-destructive hover:bg-destructive/90 rounded-xl" onClick={() => handleDeleteModel(model.id , model.model_id || "", model.version || "")}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            <CardDescription className="text-muted-foreground mt-1">
              Created{" "}
              {formatDistanceToNow(new Date(model.created_at), {
                addSuffix: true,
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-muted/80 p-4 border border-muted/30">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Clock className="w-4 h-4" />
                    <span>Training Time</span>
                  </div>
                  <p className="font-semibold text-xl">
                    {Math.round(Number(model.training_time) / 60)} min
                  </p>
                </div>
                <div className="rounded-xl bg-muted/80 p-4 border border-muted/30">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <User2 className="w-4 h-4" />
                    <span>Gender</span>
                  </div>
                  <p className="font-semibold text-xl capitalize">
                    {model.gender}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ModelList;
