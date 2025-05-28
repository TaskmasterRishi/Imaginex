"use server";

import { imageGenerationFormSchema } from "@/components/image-generation/Configuration";
import z from "zod";
import Replicate from "replicate";
import { createClient } from "@/lib/supabase/server";
import { Database } from "@/database.types";
import { imageMeta } from "image-meta";
import { randomUUID } from "crypto";


const replicate = new Replicate({
  auth: process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN,
  useFileOutput: false,
});

interface ImageResponse {
  error: string | null;
  success: boolean;
  data: any | null;
}

export async function generateImageAction(
  input: z.infer<typeof imageGenerationFormSchema>
): Promise<ImageResponse> {
  let modelInput;

  if (input.model === "black-forest-labs/flux-dev") {
    modelInput = {
      prompt: input.prompt,
      go_fast: true,
      guidance: input.guidance,
      megapixels: "1",
      num_outputs: input.num_outputs,
      aspect_ratio: input.aspect_ratio,
      output_format: input.output_format,
      output_quality: input.output_quality,
      prompt_strength: 0.8,
      num_inference_steps: input.num_inference_steps,
    };
  } else if (input.model === "black-forest-labs/flux-schnell") {
    modelInput = {
      prompt: input.prompt,
      go_fast: true,
      megapixels: "1",
      num_outputs: input.num_outputs,
      aspect_ratio: input.aspect_ratio,
      output_format: input.output_format,
      output_quality: input.output_quality,
      num_inference_steps: input.num_inference_steps,
    };
  } else {
    return {
      error: "Invalid model selected",
      success: false,
      data: null,
    };
  }

  try {
    const output = await replicate.run(input.model as `${string}/${string}`, {
      input: modelInput,
    });
    console.log("Output : ", output);
    return {
      error: null,
      success: true,
      data: output,
    };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to generate image",
      success: false,
      data: null,
    };
  }
}

export async function imgURLToBlob(url: string) {
  const response = await fetch(url);
  const blob = await response.blob();
  return await blob.arrayBuffer();
}

type storeImageInput = {
  url: string;
} & Database["public"]["Tables"]["generated_images"]["Insert"];

export async function storeImages(data: storeImageInput[]) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      error: "unauthorized",
      success: false,
      data: null,
    };
  }

  const uploadResults = [];

  for (const img of data) {
    const arraybuffer = await imgURLToBlob(img.url);
    const { width, height, type } = imageMeta(new Uint8Array(arraybuffer));

    const fileName = `image_${randomUUID()}.${type}`;
    const filePath = `${user.id}/${fileName}`;

    const { error: storageError } = await supabase.storage
      .from("generated-images")
      .upload(filePath, arraybuffer, {
        contentType: `image/${type}`,
        cacheControl: "3600",
        upsert: false,
      });

    if (storageError) {
      uploadResults.push({
        fileName,
        error: storageError.message,
        success: false,
        data: null,
      });
      continue;
    }

    const { data: dbData, error: dbError } = await supabase
      .from("generated_images")
      .insert([
        {
          user_id: user.id,
          model: img.model,
          prompt: img.prompt,
          aspect_ratio: img.aspect_ratio,
          guidance: img.guidance,
          num_inference_steps: img.num_inference_steps,
          output_format: img.output_format,
          image_name: fileName,
          width,
          height,
        },
      ])
      .select();

    if (dbError) {
      uploadResults.push({
        fileName,
        error: dbError.message,
        success: false,
        data: dbData || null,
      });
      continue;
    }

    uploadResults.push({
      fileName,
      error: null,
      success: true,
      data: dbData,
    });
  }
  console.log("UploadResults : ",uploadResults)
  return {
    error: null,
    success: true,
    data: { results: uploadResults },
  };
}
