import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN,
});

const WEBHOOK_URL =
  process.env.SITE_URL ||
  "https://56ff-2409-40c1-3023-a254-c24e-b5d4-89ce-3e7d.ngrok-free.app";

export async function POST(request: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN) {
      throw new Error("The Replicate API token is not set.");
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const input = {
      fileKey: formData.get("fileKey") as string,
      modelName: formData.get("modelName") as string,
      gender: formData.get("gender") as string,
    };

    if (!input.fileKey || !input.modelName) {
      return NextResponse.json(
        {
          error: "Missing required fields!",
        },
        { status: 400 }
      );
    }

    const fileName = input.fileKey.replace("training-data/", "");
    const { data: fileUrl } = await supabaseAdmin.storage
      .from("training-data")
      .createSignedUrl(fileName, 3600);

    if (!fileUrl?.signedUrl) {
      return NextResponse.json({ error: "Failed to get file url" });
    }

    const modelId = `${user.id}_${Date.now()}_${input.modelName
      .toLowerCase()
      .replace(" ", "_")}`;

    await replicate.models.create("taskmasterrishi", modelId, {
      visibility: "private",
      hardware: "gpu-a100-large",
    });

    const training = await replicate.trainings.create(
      "ostris",
      "flux-dev-lora-trainer",
      "c6e78d2501e8088876e99ef21e4460d0dc121af7a4b786b9a4c2d75c620e300d",
      {
        destination: `taskmasterrishi/${modelId}`,
        input: {
          steps: 1200,
          resolution: "1024",
          input_images: fileUrl.signedUrl,
          trigger_word: "omzx",
        },
        webhook: `${WEBHOOK_URL}/api/webhooks/training`,
        webhook_events_filter: ["completed"],
      }
    );

    //add model to supabase
    await supabaseAdmin.from("models").insert({
      model_id: modelId,
      user_id: user.id,
      model_name: input.modelName,
      gender: input.gender,
      training_status: training.status,
      trigger_word: "omzx",
      training_steps: 1200,
      training_id: training.id,
    });

    return NextResponse.json(
      {
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Training Error:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to start the model training!";

    return NextResponse.json(
      {
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
