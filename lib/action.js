'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { saveMeal } from './meals';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isInvalidText(text) {
  return !text || text.trim().length === 0;
}

export async function shareMeal(prevState, formData) {
  const meal = {
    title: formData.get('title'),
    summary: formData.get('summary'),
    instructions: formData.get('instructions'),
    image: formData.get('image'),
    creator: formData.get('name'),
    creator_email: formData.get('email'),
  };

  if (
    isInvalidText(meal.title) ||
    isInvalidText(meal.summary) ||
    isInvalidText(meal.instructions) ||
    isInvalidText(meal.creator)
  ) {
    return {
      message: 'Please fill in all text fields.',
    };
  }

  if (isInvalidText(meal.creator_email) || !EMAIL_REGEX.test(meal.creator_email)) {
    return {
      message: 'Please provide a valid email address.',
    };
  }

  if (!meal.image || meal.image.size === 0) {
    return {
      message: 'Please select an image for your meal.',
    };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(meal.image.type)) {
    return {
      message: 'Invalid image format. Only JPEG, PNG, and WebP are allowed.',
    };
  }

  if (meal.image.size > MAX_IMAGE_SIZE) {
    return {
      message: 'Image is too large. Maximum allowed size is 5 MB.',
    };
  }

  try {
    await saveMeal(meal);
    revalidatePath('/meals');
  } catch (error) {
    return {
      message: error.message || 'Failed to save meal. Please try again.',
    };
  }

  redirect('/meals');
}
