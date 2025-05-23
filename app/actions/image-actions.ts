"use server";

import { imageGenerationFormSchema } from "@/components/image-generation/Configuration";
import { z } from "zod";
import Replicate from "replicate";
import { writeFile } from "fs/promises";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
  useFileOutput: false,
});

console.log("Replicate API Token:", process.env.REPLICATE_API_TOKEN);

interface ImageResponse {
  error: string | null;
  success: boolean;
  data: any | null;
}

export async function generateImages(
  input: z.infer<typeof imageGenerationFormSchema>
): Promise<ImageResponse> {
  const modelInput = {
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

  try {
    console.log("Running model with input:", modelInput);
    const output = await replicate.run(input.model as `${string}/${string}`, {
      input: modelInput,
    });

    console.log("Model output received:", output);

    // Save each output to a file
    for (const [index, item] of Object.entries(output)) {
      console.log(`Writing output_${index}.png to disk`);
      await writeFile(`output_${index}.png`, item);
    }

    return {
      error: null,
      success: true,
      data: output,
    };
  } catch (error: any) {
    console.error("Error generating images:", error.message || error);
    return {
      error: error.message || "Failed to generate images",
      success: false,
      data: null,
    };
  }
}
