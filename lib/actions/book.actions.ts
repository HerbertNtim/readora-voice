'use server';

import { connectToDatabase } from '@/database/mongoose';
import { CreateBook } from '@/types';
import { generateSlug, serializeData } from '@/lib/utils';
import Book from '@/database/models/book.model';

export const createBook = async (bookData: CreateBook) => {
  try {
    await connectToDatabase();

    const slug = generateSlug(bookData.title);

    const existingBook = await Book.findOne({ slug }).lean();

    if (existingBook) {
      return {
        success: true,
        bookData: serializeData(existingBook),
        existing: true,
      };
    }

    const book = await Book.create({ ...bookData, slug, totalSegment: 0 });

    return {
      success: true,
      bookData: serializeData(book),
    };
  } catch (error) {
    console.error('Error creating Book', error);

    return {
      success: false,
      error,
    };
  }
};
