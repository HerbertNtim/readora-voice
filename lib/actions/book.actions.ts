import { PLAN_LIMITS } from './../subscription-constants';
('use server');

import { connectToDatabase } from '@/database/mongoose';
import { CreateBook, TextSegment } from '@/types';
import { escapeRegex, generateSlug, serializeData } from '@/lib/utils';
import Book from '@/database/models/book.model';
import BookSegment from '@/database/models/book-segments.model';
import mongoose from 'mongoose';
import { revalidatePath } from 'next/cache';

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

    // Todo: Check subscription limits before creating a book
    const { getUserPlan } = await import('@/lib/subscription.server');
    const { PLAN_LIMITS } = await import('@/lib/subscription-constants');

    const plan = await getUserPlan();
    const limits = PLAN_LIMITS[plan];

    const bookCount = await Book.countDocuments({
      clerkId: bookData.clerkId,
    });

    if (bookCount >= limits.maxBooks) {
      return {
        success: false,
        error: `You have reached the maximum number of books allowed for your ${plan} plan (${limits.maxBooks}). Please Upgrade to add more books.`,
      };
    }

    const book = await Book.create({ ...bookData, slug, totalSegment: 0 });

    revalidatePath('/');

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

export const getBookBySlug = async (slug: string) => {
  try {
    await connectToDatabase();

    const book = await Book.findOne({ slug }).lean();

    if (!book) return { success: false, error: 'Book is not found' };

    return {
      success: true,
      slugData: serializeData(book),
    };
  } catch (error) {
    console.error('Error fetching book by slug', error);
    return {
      success: false,
      error,
    };
  }
};

// Searches book segments using MongoDB text search with regex fallback
export const searchBookSegments = async (
  bookId: string,
  query: string,
  limit: number = 5,
) => {
  try {
    await connectToDatabase();

    console.log(`Searching for: "${query}" in book ${bookId}`);

    const bookObjectId = new mongoose.Types.ObjectId(bookId);

    // Try MongoDB text search first (requires text index)
    let segments: Record<string, unknown>[] = [];
    try {
      segments = await BookSegment.find({
        bookId: bookObjectId,
        $text: { $search: query },
      })
        .select('_id bookId content segmentIndex pageNumber wordCount')
        .sort({ score: { $meta: 'textScore' } })
        .limit(limit)
        .lean();
    } catch {
      // Text index may not exist — fall through to regex fallback
      segments = [];
    }

    // Fallback: regex search matching ANY keyword
    if (segments.length === 0) {
      const keywords = query.split(/\s+/).filter((k) => k.length > 2);
      const pattern = keywords.map(escapeRegex).join('|');

      if (keywords.length === 0) {
        return {
          success: true,
          data: [],
        };
      }

      segments = await BookSegment.find({
        bookId: bookObjectId,
        content: { $regex: pattern, $options: 'i' },
      })
        .select('_id bookId content segmentIndex pageNumber wordCount')
        .sort({ segmentIndex: 1 })
        .limit(limit)
        .lean();
    }

    console.log(`Search complete. Found ${segments.length} results`);

    return {
      success: true,
      data: serializeData(segments),
    };
  } catch (error) {
    console.error('Error searching segments:', error);
    return {
      success: false,
      error: (error as Error).message,
      data: [],
    };
  }
};
