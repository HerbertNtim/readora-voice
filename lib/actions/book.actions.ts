'use server';

import { connectToDatabase } from '@/database/mongoose';
import { CreateBook, TextSegment } from '@/types';
import { generateSlug, serializeData } from '@/lib/utils';
import Book from '@/database/models/book.model';
import BookSegment from '@/database/models/book-segments.model';

export const getAllBooks = async () => {
  try {
    await connectToDatabase();

    const books = await Book.find().sort({ createdAt: -1 }).lean();

    return {
      success: true,
      booksData: serializeData(books),
    };
  } catch (error) {
    console.error('Something Happened, books cannot be gotten ', error);

    return {
      success: false,
      error,
    };
  }
};

export const checkExistingBook = async (title: string) => {
  try {
    await connectToDatabase();

    const slug = generateSlug(title);

    const existingBook = await Book.findOne({ slug });

    if (existingBook) {
      return {
        exists: true,
        book: serializeData(existingBook),
      };
    }

    return {
      exists: false,
    };
  } catch (error) {
    console.error('Error checking existing book', error);

    return {
      exists: false,
      error,
    };
  }
};

export const createBook = async (bookData: CreateBook) => {
  try {
    await connectToDatabase();

    const slug = generateSlug(bookData.title);

    const existingBook = await Book.findOne({ slug }).lean();

    if (existingBook) {
      return {
        success: true,
        bookData: serializeData(existingBook),
        alreadyExists: true,
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

export const saveBookSegments = async (
  bookId: string,
  clerkId: string,
  segments: TextSegment[],
) => {
  try {
    await connectToDatabase();

    const segmentsToInsert = segments.map(
      ({ text, segmentIndex, pageNumber, wordCount }) => ({
        bookId,
        clerkId,
        content: text,
        segmentIndex,
        pageNumber,
        wordCount,
      }),
    );

    await BookSegment.insertMany(segmentsToInsert);
    await Book.findByIdAndUpdate(bookId, { totalSegment: segments.length });

    console.log('Book Segments saved successfully...');

    return {
      success: true,
      bookSegments: { segmentCreated: segments.length },
    };
  } catch (error) {
    console.error('Error saving book segments ', error);

    await BookSegment.deleteMany({ bookId });
    await Book.findByIdAndDelete(bookId);

    console.log('Deleted book segment and book due to error...');

    return {
      success: false,
      error: 'Failed to save book segments',
    };
  }
};
