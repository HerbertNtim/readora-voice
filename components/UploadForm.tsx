'use client';

import {
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_PDF_TYPES,
  DEFAULT_VOICE,
} from '@/lib/constants';
import { UploadSchema } from '@/lib/zod';
import { BookUploadFormValues } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import LoadingOverlay from './LoadingOverlay';
import FileUploader from './FileUploader';
import { Upload } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import VoiceSelector from './VoiceSelector';
import { Button } from './ui/button';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { checkExistingBook } from '@/lib/actions/book.actions';
import { useRouter } from 'next/router';
import { parsePDFFile } from '@/lib/utils';

const UploadForm = () => {
  const { user } = useUser();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BookUploadFormValues>({
    resolver: zodResolver(UploadSchema),
    defaultValues: {
      title: '',
      author: '',
      persona: DEFAULT_VOICE,
    },
  });

  const onSubmit = async (bookData: BookUploadFormValues) => {
    if (!user) {
      toast.error('Please, log in to upload a pdf');
      form.reset();
      return;
    }

    setIsSubmitting(true);

    try {
      const existingBook = await checkExistingBook(bookData.title);

      if (existingBook.exists && existingBook.book) {
        toast.info('Book already exists.');
        form.reset();
        router.push(`/books/${existingBook.book.slug}`);
        return;
      }

      const fileTitle = bookData.title.replace(/\s+/g, '-').toLowerCase();
      const pdfFile = bookData.pdfFile;
      const parsedPdf = await parsePDFFile(pdfFile);

      if (parsedPdf.content.length === 0) {
        toast.error(
          'Failed to parse PDF. Please Upload a new PDF file to continue',
        );
        return;
      }
    } catch (error) {
      console.error('Error Uploading pdf ', error);
      toast.error('Failed to upload pdf');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isSubmitting && <LoadingOverlay />}

      <div className="new-book-wrapper">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* 1. PDF File Upload */}
            <FileUploader
              control={form.control}
              name="pdfFile"
              label="Book PDF File"
              acceptTypes={ACCEPTED_PDF_TYPES}
              icon={Upload}
              placeholder="Click to upload PDF"
              hint="PDF file (max 50MB)"
              disabled={isSubmitting}
            />

            {/* 2. Cover Image Upload */}
            <FileUploader
              control={form.control}
              name="coverImage"
              label="Cover Image (Optional)"
              acceptTypes={ACCEPTED_IMAGE_TYPES}
              icon={Upload}
              placeholder="Click to upload cover image"
              hint="Leave empty to auto-generate from PDF"
              disabled={isSubmitting}
            />

            {/* 3. Title Input */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-label">Title</FormLabel>
                  <FormControl>
                    <Input
                      className="form-input"
                      placeholder="ex: Rich Dad Poor Dad"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 4. Author Input */}
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-label">Author</FormLabel>
                  <FormControl>
                    <Input
                      className="form-input"
                      placeholder="ex: Robert Kiyosaki"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 5. Voice Selector */}
            <FormField
              control={form.control}
              name="persona"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-label">
                    Choose Voice Assistant
                  </FormLabel>
                  <FormControl>
                    <VoiceSelector
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 6. Submit Button */}
            <Button
              type="submit"
              className={'form-btn'}
              disabled={isSubmitting}
            >
              Begin Synthesis
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default UploadForm;
