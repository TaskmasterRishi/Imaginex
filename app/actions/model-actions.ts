"use server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function getPresignedStorageUrl(filePath: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: urlData, error } = await supabaseAdmin.storage
    .from("training-data")
    .createSignedUploadUrl(`${user?.id}/${new Date().getTime()}_${filePath}`);

  return {
    signedUrl: urlData?.signedUrl || "",
    error: error?.message || null,
  };
}

export async function fetchModels() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data, error, count } = await supabase
    .from("models")
    .select("*", { count: "exact" })
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  return {
    error: error?.message || null,
    success: !error,
    data: data || null,
    count: count || 0,
  };
}

export async function deleteModel(
  id: number,
  model_id: String,
  model_version: String
) {
  const supabase = await createClient();
  if (model_version) {
    try {
      const res = await fetch(
        `https://api.replicate.com/v1/models/taskmasterrishi/${model_id}/versions/${model_version}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete the model version");
      }
    } catch (e) {
      console.log("Failed to delete the model version", e);
      return {
        error: "Failed to delete the model version",
        success: false,
      };
    }
  }

  if (model_id) {
    try {
      const res = await fetch(
        `https://api.replicate.com/v1/models/taskmasterrishi/${model_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete the model");
      }
    } catch (e) {
      console.log("Failed to delete the model : ", e);
      return {
        error: "Failed to delete the model",
        success: false,
      };
    }
  }

  const { error } = await supabase.from("models").delete().eq("id", id);

  return {
    error: error ? error.message : null,
    success: !error,
  };
}
