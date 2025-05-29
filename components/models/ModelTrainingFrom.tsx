"use client";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CardContent, CardHeader } from "../ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const ACCEPTED_ZIP_FILES = ["application/x-zip-compressed", "application/zip"];
const MAX_FILE_SIZE = 45 * 1024 * 1024; // 45MB

const formSchema = z.object({
  modelName: z
    .string({
      required_error: "Model name is required!",
    })
    .min(1, "Model name cannot be empty"),
  gender: z.enum(["man", "woman"], {
    required_error: "Please select a gender",
  }),
  zipFile: z
    .any()
    .refine((files) => files?.[0] instanceof File, "Please upload a file")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      "Maximum file size is 45MB"
    )
    .refine(
      (files) =>
        files?.[0]?.type && ACCEPTED_ZIP_FILES.includes(files?.[0]?.type),
      "Only .zip files are accepted"
    ),
});

const ModelTrainingFrom = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      modelName: "",
      zipFile: undefined,
      gender: "man",
    },
  });

  const fileRef = form.register("zipFile")

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardContent className="grid max-w-5xl bg-background p-8 rounded-lg gap-6 border-2 shadow-lg">
            <FormField
              control={form.control}
              name="modelName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Model name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This will be the name of your trained model.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>
                    Plese select the gender of the image model.
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="man" />
                        </FormControl>
                        <FormLabel className="font-normal">Male</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="woman" />
                        </FormControl>
                        <FormLabel className="font-normal">Female</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zipFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex flex-col items-start gap-2">
                    Training Data (zip file) |{" "}
                    <span className="text-destructive">
                      Read the requirements below
                    </span>
                    <div className="space-y-4 text-xs">
                      <div>
                        <h4 className="font-medium">📦 Image Submission Guidelines (ZIP Format)</h4>
                        <p className=" text-muted-foreground">
                          Please prepare and upload a ZIP file of images following these criteria:
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium">✅ Total Image Count</h4>
                        <ul className="list-disc pl-5 text-muted-foreground space-y-1 ">
                          <li>Submit 10, 12, or 15 images in total</li>
                          <li>
                            For reference, a 12-image set should ideally include:
                            <ul className="list-disc pl-5 space-y-1 mt-1">
                              <li>6 close-up face portraits</li>
                              <li>3 or 4 mid-length shots (from head to waist)</li>
                              <li>2 or 3 full-body images</li>
                            </ul>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium ">📸 Photo Guidelines</h4>
                        <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                          <li>No face/head accessories (e.g., hats, sunglasses)</li>
                          <li>Subject only — no other people</li>
                          <li>Mix of expressions, outfits, and backgrounds</li>
                          <li>Good lighting, no shadows</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium">🔒 File Format</h4>
                        <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                          <li>One ZIP file (under 45MB)</li>
                          <li>No folders — images in root only</li>
                        </ul>
                      </div>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input type="file" accept=".zip" {...fileRef}/>
                  </FormControl>
                  <FormDescription>
                    Upload zip file containg images of a model (max 45MB).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </CardContent>
        </form>
      </Form>
    </CardHeader>
  );
};

export default ModelTrainingFrom;
