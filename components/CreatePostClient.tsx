"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createPost } from "@/actions/user.actions";
import { ChangeEvent, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters" }).max(100, { message: "Title must not exceed 100 characters" }),
  content: z.string().min(2, { message: "Content must be at least 2 characters" }),
  reference: z.string().optional(),
  imageUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
});

const CreatePostClient = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [file, setFile] = useState<File | undefined>(undefined);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      reference: "",
      imageUrl: "",
    },
  });

  async function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.target;
    if (input.files && input.files[0]) {
      const selectedFile = input.files[0];
      setFile(selectedFile);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(URL.createObjectURL(selectedFile));
      form.setValue("imageUrl", "");

      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("upload_preset", "ml_default");
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        if (!cloudName) throw new Error("Cloudinary cloud name not configured");

        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          formData,
          {
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(progress);
              }
            },
          }
        );
        setImageUrl(response.data.secure_url);
        toast("Image uploaded successfully!");
      } catch (err) {
        console.error("Image upload failed:", err);
        toast.error("Failed to upload image");
        setPreviewUrl("");
        setFile(undefined);
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("content", values.content);
      if (imageUrl) formData.append("image", imageUrl);
      else if (values.imageUrl) formData.append("image", values.imageUrl);
      if (values.reference) formData.append("reference", values.reference);

      const response = await createPost(formData);
      if (response && "success" in response && !response.success) {
        throw new Error("Failed to create post");
      }

      form.reset();
      setImageUrl("");
      setPreviewUrl("");
      setFile(undefined);
      toast("Post Created Successfully!", {
        description: "Your post has been created successfully.",
        duration: 2000,
      });
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred");
      toast.error(error.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-background">
      <h1 className="text-4xl font-sans font-extrabold">Create New Post</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-3xl mx-auto p-6 space-y-6"
        >
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
              {error}
            </div>
          )}

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-medium">Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter title"
                    {...field}
                    className="w-full border-border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-medium">Content</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter content"
                    {...field}
                    className="w-full min-h-[150px] border-border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reference"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-medium">Reference (optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter reference"
                    {...field}
                    className="w-full border-border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <label className="text-lg font-medium">Image (optional)</label>
            <div className="space-y-4">
              <div className="flex gap-4 items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={uploading}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-muted file:text-muted-foreground hover:file:bg-muted/80 disabled:opacity-50"
                />
                {uploading && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </div>
                )}
              </div>

              {uploading && (
                <Progress value={uploadProgress} className="w-full" />
              )}

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Or enter image URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/image.jpg"
                        {...field}
                        className="w-full border-border"
                        disabled={uploading}
                        onChange={(e) => {
                          field.onChange(e);
                          setPreviewUrl(e.target.value);
                          setFile(undefined);
                          setImageUrl("");
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {previewUrl && (
                <div className="mt-4">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-full h-auto rounded-md max-h-64 object-cover"
                    onError={() => setPreviewUrl("")}
                  />
                </div>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading || uploading}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Post"
            )}
          </Button>
        </form>
      </Form>
      <Toaster position="bottom-right" />
    </div>
  );
};

export default CreatePostClient;