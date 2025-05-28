'use server'

import { imageGenerationFormSchema } from "@/components/image-generation/Configuration";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import Replicate from "replicate";

const replicate = new Replicate({
 auth: process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN,
 useFileOutput: false,
})

interface ImageResponse {
  error: string | null;
  success: boolean;
  data: any | null;
}

export async function generateImage(input: z.infer<typeof imageGenerationFormSchema>): Promise<ImageResponse> {
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
      num_inference_steps: input.num_inference_steps
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
      num_inference_steps: input.num_inference_steps
    };
  } else {
    return {
      error: "Invalid model selected",
      success: false,
      data: null
    };
  }
  
  try {
    const output = await replicate.run(input.model as `${string}/${string}`, { input: modelInput });
    console.log("Output : ", output );
    return {
      error: null,
      success: true,
      data: output
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to generate image",
      success: false,
      data: null
    };
  }
}