import { getBookBySlug } from '@/lib/actions/book.actions';
import { auth } from '@clerk/nextjs/server';
import { ArrowLeft, Mic, MicOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const BookDetails = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
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

      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        {/* HEADER CARD */}
        <div className="vapi-header-card">
          <Image
            src={book.coverURL}
            alt={book.title}
            width={120}
            height={180}
            style={{ width: 120, height: 180 }}
            className="vapi-cover-image w-30! h-auto!"
            priority
          />

          <div className="vapi-mic-wrapper">
            <button className="vapi-mic-btn vapi-mic-btn-inactive shadow-md w-15! h-15!">
              <MicOff className="size-7 text-[#212a3b]" />
            </button>
          </div>
        </div>

        {/* TRANSCRIPT AREA */}
        <div className="transcript-container min-h-100">
          <div className="transcript-empty">
            <Mic className="size-12 text-[#212a3b] mb-4" />
            <h2 className="transcript-empty-text">No Conversation Yet.</h2>
            <p className="transcript-empty-hint">
              Click the mic button above to start talking
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
