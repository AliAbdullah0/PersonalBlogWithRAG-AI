'use server';

import { prisma } from "@/lib/Prisma";

export async function submitFeedback(email: string, message: string) {
  try {

    const response = await prisma.feedbacks.create({
      data: {
        email,
        message,
      },
    });
    return response;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
}