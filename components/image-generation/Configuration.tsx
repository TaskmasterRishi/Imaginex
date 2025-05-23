"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { generateImages } from "@/app/actions/image-actions";

export const imageGenerationFormSchema = z.object({
  model: z.string({
    required_error: "Model is required",
  }),
  prompt: z.string({
    required_error: "Prompt is required",
  }),
  guidance: z.number({
    required_error: "Guidance Scale is required",
  }),
  num_outputs: z
    .number()
    .min(1, { message: "Number of outputs must be at least 1" })
    .max(4, { message: "Number of outputs must be at most 4" }),
  aspect_ratio: z.enum(
    ["1:1", "16:9", "9:16", "4:3", "3:4"],
    {
      required_error: "Aspect ratio is required",
    }
  ),
  output_format: z.enum(["png", "jpg", "webp"], {
    required_error: "Output format is required",
  }),
  output_quality: z
    .number()
    .min(1, { message: "Output quality must be at least 1" })
    .max(100, { message: "Output quality must be at most 100" }),
  num_inference_steps: z
    .number()
    .min(1, { message: "Number of inference steps must be at least 1" })
    .max(50, { message: "Number of inference steps must be at most 50" }),
});

const Configuration = () => {
  const form = useForm<z.infer<typeof imageGenerationFormSchema>>({
    resolver: zodResolver(imageGenerationFormSchema),
    defaultValues: {
      model: "black-forest-labs/flux-dev",
      prompt: "",
      guidance: 3.5,
      num_outputs: 1,
      aspect_ratio: "1:1",
      output_format: "png",
      output_quality: 80,
      num_inference_steps: 20,
    }, 
  });

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "model") {
        let newSteps = 28; // Default steps for flux-dev
        if (value.model === "black-forest-labs/flux-schnell") {
          newSteps = 4;
        }
        form.setValue("num_inference_steps", newSteps);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  async function onSubmit(values: z.infer<typeof imageGenerationFormSchema>) {
    console.log(values);
    const { error, success, data } = await generateImages(values);
  }

  return (
    <Card className="max-w-6xl mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Image Generation</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
            <div className="grid grid-cols-1 md:grid-cols-1 w-full gap-6">
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Model
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Select the AI model for image generation</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="black-forest-labs/flux-dev">Flux Dev</SelectItem>
                        <SelectItem value="black-forest-labs/flux-schnell">Flux Schnell</SelectItem>
                        <SelectItem value="stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4">Stable Diffusion</SelectItem>
                        <SelectItem value="google/imagen-4">Imagen 4</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="aspect_ratio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Aspect Ratio
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Controls the aspect ratio of the generated image</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select aspect ratio" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1:1">1:1 (Square)</SelectItem>
                          <SelectItem value="16:9">16:9 (Widescreen)</SelectItem>
                          <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                          <SelectItem value="4:3">4:3 (Standard)</SelectItem>
                          <SelectItem value="3:4">3:4 (Portrait)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="output_format"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Output Format
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Controls the output format of the generated image</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select output format" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="png">PNG</SelectItem>
                          <SelectItem value="jpg">JPG</SelectItem>
                          <SelectItem value="webp">WebP</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="guidance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Guidance Scale: {field.value}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Controls how closely the model follows the prompt (1-20)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={20}
                        step={0.5}
                        defaultValue={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="num_outputs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Number of Outputs: {field.value}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Controls the number of images generated</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={4}
                        step={1}
                        defaultValue={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="output_quality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Output Quality: {field.value}%
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Controls the quality of the generated image</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={100}
                        step={1}
                        defaultValue={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="num_inference_steps"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Inference Steps: {field.value}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Controls the number of inference steps</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={
                          form.getValues("model") === "black-forest-labs/flux-schnell" ? 4 : 50
                        }
                        step={1}
                        defaultValue={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Prompt
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Describe the image you want to generate</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <FormControl>
                      <textarea
                        placeholder="Enter your prompt"
                        {...field}
                        className="w-full p-2 border rounded"
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Generate Image
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default Configuration;
