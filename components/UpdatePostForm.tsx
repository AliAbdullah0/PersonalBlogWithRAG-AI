"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getPosts, updatePost } from "@/actions/user.actions";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "./ui/sonner";

type Post = Awaited<ReturnType<typeof getPosts>>[0];



const UpdatePostForm = ({ post }: { post: Post }) => {
  const [title, setTitle] = useState(post.title || "");
  const [content, setContent] = useState(post.content || "");
  const [image, setImage] = useState(post.image || "");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(post.image || null);
  const [references, setReferences] = useState(post.reference || "");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);


  useEffect(() => {
    if (open) {
      setTitle(post.title);
      setContent(post.content);
      setImage(post.image || "");
      setReferences(post.reference || "");
      setPreviewUrl(post.image || null);
      setFile(null);
      setError(null);
    }
  }, [open, post]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    if (input.files && input.files[0]) {
      const selectedFile = input.files[0];
      setFile(selectedFile);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleImageUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ml_default");
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      if (!cloudName) throw new Error("Cloudinary cloud name not configured");

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );
      const imageUrl = response.data.secure_url;
      setImage(imageUrl);
      setPreviewUrl(imageUrl);
      setFile(null);
      toast("Image uploaded successfully!",{
        description:"Updated!"
      });
    } catch (err) {
      console.error("Image upload failed:", err);
      toast("Image uploaded Failed!",{
        description:"Error"
      });
      setError("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData();
    formData.append("id", post.id);
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image);
    if (references) formData.append("reference", references);

    try {
      await updatePost(post.id, formData);
      setOpen(false);
      setError(null);
    } catch (err) {
      setError("Failed to update post. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Post</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
          <DialogDescription>
            Update your post details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter post content"
              className="min-h-[100px] text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Image (optional)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                disabled={uploading || !file}
                onClick={handleImageUpload}
                className="flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading
                  </>
                ) : (
                  "Upload"
                )}
              </Button>
            </div>
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="mt-2 max-w-full h-auto rounded-md max-h-48 object-cover"
              />
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="references">References (optional)</Label>
            <Textarea
              id="references"
              value={references}
              onChange={(e) => setReferences(e.target.value)}
              placeholder="Enter references, separated by commas"
              className="min-h-[60px]"
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          <DialogFooter>
            <Button
              type="submit"
              disabled={submitting || uploading}
              className="w-full"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
      <Toaster position="bottom-right"/>
    </Dialog>
  );
};

export default UpdatePostForm;