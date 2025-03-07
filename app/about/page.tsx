"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { submitFeedback } from "@/actions/feedbacks.actions";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Loader2Icon } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  message: z.string().min(1, { message: "Message cannot be empty" }),
});

const About = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      message: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await submitFeedback(values.email, values.message);

      if (response?.id) {
        toast.success("Feedback Submitted!", {
          description: "Thank you for your feedback!",
        });
        form.reset();
      }
    } catch (error) {
      toast.error("Error Submitting Feedback!", {
        description: "Something went wrong. Please try again.",
      });
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-14">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* About Content Section */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            About Us
          </h1>
          <p className="text-muted-foreground mb-4">
            Welcome to Blog AI, where innovation meets creativity. We’re a team passionate about harnessing artificial intelligence to revolutionize content creation. Our mission is to empower writers, bloggers, and creators with tools that make crafting compelling stories easier and more efficient.
          </p>
          <p className="text-muted-foreground">
            Founded in 2023, we’ve been working tirelessly to build a platform that blends cutting-edge technology with user-friendly design. Whether you’re here to explore our blog, share your thoughts, or join our journey, we’re excited to have you with us!
          </p>
        </div>

        {/* Feedback Form Section */}
        <div className="flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
            Share Your Feedback
          </h2>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., johndoe@gmail.com"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      This won’t appear in public.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provide Feedback</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Your feedback here"
                        {...field}
                        disabled={isSubmitting}
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (<div className="animate-spin h-5 w-5"><Loader2Icon/></div>) : "Submit"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
      <Toaster position="bottom-right" />
    </section>
  );
};

export default About;