'use client';

import { type ChangeEvent } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImageIcon, Trash2, UploadCloud } from 'lucide-react';
import {
  Form,
  FormField,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { UploadSchema } from '@/lib/zod';
import { BookUploadFormValues } from '@/types';
import { DEFAULT_VOICE, voiceCategories, voiceOptions } from '@/lib/constants';
import { cn } from '@/lib/utils';

const voiceCategoryLabels: Record<string, string> = {
  male: 'Male Voices',
  female: 'Female Voices',
};

type VoiceKey = keyof typeof voiceOptions;

const UploadForm = () => {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BookUploadFormValues>({
    resolver: zodResolver(UploadSchema),
    defaultValues: {
      pdfFile: undefined,
      coverFile: undefined,
      title: '',
      author: '',
      voice: DEFAULT_VOICE,
    },
  });

  const pdfFile = useWatch({ control, name: 'pdfFile' }) as File | undefined;
  const coverFile = useWatch({ control, name: 'coverFile' }) as
    | File
    | undefined;
  const selectedVoice = useWatch({
    control,
    name: 'voice',
  }) as BookUploadFormValues['voice'];

  const getErrorMessage = (value: unknown) =>
    typeof value === 'string' ? value : undefined;
  const pdfError = getErrorMessage(errors.pdfFile?.message);
  const coverError = getErrorMessage(errors.coverFile?.message);
  const titleError = getErrorMessage(errors.title?.message);
  const authorError = getErrorMessage(errors.author?.message);
  const voiceError = getErrorMessage(errors.voice?.message);

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
    field: 'pdfFile' | 'coverFile',
  ) => {
    const file = event.target.files?.[0];
    setValue(field, file, { shouldValidate: true, shouldDirty: true });
  };

  const removeFile = (field: 'pdfFile' | 'coverFile') => {
    setValue(field, undefined, { shouldValidate: true, shouldDirty: true });
  };

  const onSubmit = async (values: BookUploadFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    console.log('Book upload payload', values);
  };

  return (
    <div className="new-book-wrapper">
      <Form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <FormField>
          <FormLabel htmlFor="pdf-upload">PDF file upload</FormLabel>
          <FormDescription>PDF file (max 50MB)</FormDescription>
          <label htmlFor="pdf-upload" className="upload-dropzone">
            <UploadCloud className="h-8 w-8 text-[#663820]" />
            <div className="space-y-1">
              <p className="text-lg font-semibold text-[#212a3b]">
                Click to upload PDF
              </p>
              <p className="text-sm text-[#3d485e]">
                Drag or click to add your manuscript.
              </p>
            </div>
          </label>
          <input
            id="pdf-upload"
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(event) => handleFileChange(event, 'pdfFile')}
          />
          {pdfError && <FormMessage>{pdfError}</FormMessage>}

          {pdfFile ? (
            <div className="mt-4 flex items-center justify-between rounded-3xl border border-(--border-subtle) bg-white px-4 py-3 shadow-(--shadow-soft)">
              <div className="text-sm text-[#212a3b]">
                <p className="font-medium">{pdfFile.name}</p>
                <p className="text-[#3d485e] text-sm">
                  {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-[#d9c2ad] bg-[#fff4e8] px-3 py-2 text-sm font-medium text-[#663820] transition hover:bg-[#f4e0d4]"
                onClick={() => removeFile('pdfFile')}
              >
                <Trash2 className="h-4 w-4" /> Remove
              </button>
            </div>
          ) : null}
        </FormField>

        <FormField>
          <FormLabel htmlFor="cover-upload">Cover image upload</FormLabel>
          <FormDescription>
            Leave empty to auto-generate from PDF.
          </FormDescription>
          <label htmlFor="cover-upload" className="upload-dropzone">
            <ImageIcon className="h-8 w-8 text-[#663820]" />
            <div className="space-y-1">
              <p className="text-lg font-semibold text-[#212a3b]">
                Click to upload cover image
              </p>
              <p className="text-sm text-[#3d485e]">
                Optional cover to make the book feel more polished.
              </p>
            </div>
          </label>
          <input
            id="cover-upload"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
            onChange={(event) => handleFileChange(event, 'coverFile')}
          />
          {coverError && <FormMessage>{coverError}</FormMessage>}

          {coverFile ? (
            <div className="mt-4 flex items-center justify-between rounded-3xl border border-(--border-subtle) bg-white px-4 py-3 shadow-(--shadow-soft)">
              <div className="text-sm text-[#212a3b]">
                <p className="font-medium">{coverFile.name}</p>
                <p className="text-[#3d485e] text-sm">
                  {(coverFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-[#d9c2ad] bg-[#fff4e8] px-3 py-2 text-sm font-medium text-[#663820] transition hover:bg-[#f4e0d4]"
                onClick={() => removeFile('coverFile')}
              >
                <Trash2 className="h-4 w-4" /> Remove
              </button>
            </div>
          ) : null}
        </FormField>

        <FormField>
          <FormLabel htmlFor="title">Title</FormLabel>
          <input
            id="title"
            placeholder="ex: Rich Dad Poor Dad"
            className="form-input"
            {...register('title')}
          />
          {titleError && <FormMessage>{titleError}</FormMessage>}
        </FormField>

        <FormField>
          <FormLabel htmlFor="author">Author Name</FormLabel>
          <input
            id="author"
            placeholder="ex: Robert Kiyosaki"
            className="form-input"
            {...register('author')}
          />
          {authorError && <FormMessage>{authorError}</FormMessage>}
        </FormField>

        <FormField>
          <FormLabel>Choose Assistant Voice</FormLabel>
          <div className="space-y-6 rounded-3xl border border-(--border-subtle) bg-white p-5 shadow-(--shadow-soft)">
            {Object.entries(voiceCategories).map(([category, keys]) => (
              <div key={category} className="space-y-4">
                <p className="text-sm uppercase tracking-[0.35em] text-[#663820]">
                  {voiceCategoryLabels[category] || category}
                </p>
                <div className="grid gap-3">
                  {(keys as VoiceKey[]).map((voiceKey) => {
                    const voice = voiceOptions[voiceKey];
                    const active = selectedVoice === voiceKey;
                    return (
                      <label
                        key={voiceKey}
                        className={cn(
                          'voice-selector-option grid gap-2 rounded-3xl border p-4 transition hover:shadow-(--shadow-soft)',
                          active && 'voice-selector-option-selected',
                        )}
                      >
                        <input
                          type="radio"
                          value={voiceKey}
                          className="sr-only"
                          {...register('voice')}
                        />
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold text-[#212a3b]">
                              {voice.name}
                            </p>
                            <p className="text-sm text-[#3d485e]">
                              {voice.description}
                            </p>
                          </div>
                          {active ? (
                            <span className="rounded-full bg-[#663820] px-3 py-1 text-sm font-semibold text-white">
                              Selected
                            </span>
                          ) : null}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          {voiceError && <FormMessage>{voiceError}</FormMessage>}
        </FormField>

        <button type="submit" className="form-btn" disabled={isSubmitting}>
          Begin Synthesis
        </button>
      </Form>

      {isSubmitting ? (
        <div className="loading-wrapper">
          <div className="loading-shadow-wrapper bg-(--bg-card)">
            <div className="loading-shadow p-6">
              <div className="loading-animation rounded-full border-4 border-[#663820] border-t-transparent h-16 w-16" />
              <div className="text-center">
                <p className="loading-title">Preparing your book</p>
                <p className="text-sm text-[#3d485e]">
                  We’re generating the warm assistant voice and synthesizing the
                  story.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default UploadForm;
