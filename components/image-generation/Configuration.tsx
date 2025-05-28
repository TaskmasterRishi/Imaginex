"use client";

import React, { useEffect } from "react";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import useGeneratedStore from "@/store/useGeneratedStore";

export const imageGenerationFormSchema = z.object({
  model: z.string({
    required_error: "Model is required",
  }),
  prompt: z.string({
    required_error: "Prompt is required",
  }),
  guidance: z.number({
    required_error: "Guidance is required",
  }),
  num_outputs: z
    .number()
    .min(1, { message: "At least 1 output is required" })
    .max(4, { message: "Maximum 4 outputs allowed" }),
  aspect_ratio: z.string({
    required_error: "Aspect ratio is required",
  }),
  output_format: z.string({
    required_error: "Output format is required",
  }),
  output_quality: z
    .number()
    .min(1, { message: "Minimum quality is 1" })
    .max(100, { message: "Maximum quality is 100" }),
  num_inference_steps: z
    .number()
    .min(1, { message: "Minimum steps is 1" })
    .max(50, { message: "Maximum steps is 50" }),
});

const Configuration = () => {
  const generateImage = useGeneratedStore((state) => state.generateImage)
  const form = useForm<z.infer<typeof imageGenerationFormSchema>>({
    resolver: zodResolver(imageGenerationFormSchema),
    defaultValues: {
      model: "",
      prompt: "",
      aspect_ratio: "1:1",
      output_format: "jpg",
      num_outputs: 1,
      guidance: 3.5,
      output_quality: 80,
      num_inference_steps: 20,
    },
  });

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "model") {
        let newStep;
        if (value.model === "black-forest-labs/flux-schnell") {
          newStep = 4;
        } else {
          newStep = 28;
        }
        if (newStep !== undefined) {
          form.setValue("num_inference_steps", newStep);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  async function onSubmit(values: z.infer<typeof imageGenerationFormSchema>) {
     await generateImage(values);
  }

  return (
    <TooltipProvider>
      <Card className="p-6 w-full mx-auto h-full m-0">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Image Generation</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 h-full"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="font-medium">
                      Model
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Choose the AI model for image generation. Each model
                            has unique capabilities.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-background w-full">
                          <SelectValue placeholder="Select a model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="black-forest-labs/flux-schnell">
                          Flux Schnell
                        </SelectItem>
                        <SelectItem value="black-forest-labs/flux-dev">
                          Flux Dev
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="aspect_ratio"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="font-medium">
                      Aspect Ratio
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Set the width-to-height ratio of the generated image
                            (e.g., 1:1 for square, 16:9 for widescreen).
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-background w-full">
                          <SelectValue placeholder="Select aspect ratio" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[
                          "1:1",
                          "3:2",
                          "2:3",
                          "4:3",
                          "3:4",
                          "4:5",
                          "5:4",
                          "9:16",
                          "16:9",
                          "9:21",
                          "21:9",
                        ].map((ratio) => (
                          <SelectItem key={ratio} value={ratio}>
                            {ratio}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="num_outputs"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="font-medium">
                      Number of Outputs
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Specify how many images to generate (1-4). More
                            outputs may take longer.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1"
                        min={1}
                        max={4}
                        className="bg-background w-full"
                        {...field}
                        onChange={(event) =>
                          field.onChange(+event.target.value)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="output_format"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="font-medium">
                      Output Format
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Choose the file format (JPG, PNG, or WEBP) for the
                            generated images.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-background w-full">
                          <SelectValue placeholder="Select output format" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["jpg", "png", "webp"].map((format) => (
                          <SelectItem key={format} value={format}>
                            {format.toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4 w-full">
              <FormField
                control={form.control}
                name="guidance"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="flex items-center justify-between font-medium">
                      <span>
                        Guidance
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="w-4 h-4 ml-1 inline-block" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Adjust how strictly the AI follows your prompt (lower values = more creative, higher values = more precise).
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </span>
                      <span className="text-muted-foreground">
                        {field.value}
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={0}
                        max={10}
                        step={0.5}
                        defaultValue={[Number(field.value)]}
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
                  <FormItem className="w-full">
                    <FormLabel className="flex items-center justify-between font-medium">
                      <span>
                        Output Quality
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="w-4 h-4 ml-1 inline-block" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Set the quality of the generated image (1-100). Higher values produce sharper results but may take longer.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </span>
                      <span className="text-muted-foreground">
                        {field.value}
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={100}
                        step={1}
                        defaultValue={[Number(field.value)]}
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
                  <FormItem className="w-full">
                    <FormLabel className="flex items-center justify-between font-medium">
                      <span>
                        Num Inference Steps
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="w-4 h-4 ml-1 inline-block" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Control the number of refinement steps (1-50). More steps improve quality but increase generation time.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </span>
                      <span className="text-muted-foreground">
                        {field.value}
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={
                          form.getValues("model") === 'black-forest-labs/flux-schnell' ? 4 : 50
                        }
                        step={1}
                        defaultValue={[Number(field.value)]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="font-medium flex items-center gap-2">
                    Prompt
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Describe the image you want to generate in detail. Be
                          specific about objects, colors, styles, and
                          composition for better results.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the image you want to generate..."
                      className="bg-background min-h-[150px] w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-center w-full">
              <Button type="submit" className="w-full md:w-auto">
                Generate Images
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </TooltipProvider>
  );
};

export default Configuration;
