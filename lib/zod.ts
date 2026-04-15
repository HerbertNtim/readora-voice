import z from 'zod';
import {
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_PDF_TYPES,
  MAX_FILE_SIZE,
  MAX_IMAGE_SIZE,
} from './constants';

const pdfFileSchema = z
  .any()
  .refine((value) => value instanceof File, 'PDF file is required.')
  .refine(
    (value) => value instanceof File && ACCEPTED_PDF_TYPES.includes(value.type),
    'Please upload a valid PDF file.',
  )
  .refine(
    (value) => value instanceof File && value.size <= MAX_FILE_SIZE,
    'PDF file must be 50MB or smaller.',
  );

const coverFileSchema = z
  .any()
  .optional()
  .refine(
    (value) => !value || value instanceof File,
    'Cover image must be a valid file.',
  )
  .refine(
    (value) => !value || ACCEPTED_IMAGE_TYPES.includes(value.type),
    'Cover image must be JPG, PNG, or WEBP.',
  )
  .refine(
    (value) => !value || value.size <= MAX_IMAGE_SIZE,
    'Cover image must be 10MB or smaller.',
  );

export const UploadSchema = z.object({
  pdfFile: pdfFileSchema,
  coverFile: coverFileSchema,
  title: z.string().min(1, 'Title is required.'),
  author: z.string().min(1, 'Author name is required.'),
  voice: z.enum(['dave', 'daniel', 'chris', 'rachel', 'sarah']),
});
