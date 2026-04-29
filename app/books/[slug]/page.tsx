import VapiControls from '@/components/VapiControls';
import { getBookBySlug } from '@/lib/actions/book.actions';
import { auth } from '@clerk/nextjs/server';
import { ArrowLeft, Mic, MicOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';

const BookDetails = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  const { slug } = await params;
  const slugResult = await getBookBySlug(slug);

  if (!slugResult.success || !slugResult.slugData) return redirect('/');

  const book = slugResult.slugData;

  return (
    <div className="book-page-container">
      <Link href="/" className="back-btn-floating">
        <ArrowLeft className="size-6 text-[#212a3b]" />
      </Link>

      <VapiControls book={book} />
    </div>
  );
};

export default BookDetails;
