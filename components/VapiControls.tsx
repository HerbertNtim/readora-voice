'use client';

import { IBook } from '@/types';
import Image from 'next/image';

const VapiControls = ({ book }: { book: IBook }) => {
  return (
    <>
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        {/* Header Card */}
        <div className="vapi-header-card">
          <div className="vapi-cover-wrapper relative">
            <Image
              src={book.coverURL || '/images/book-placeholder.png'}
              alt={book.title}
              width={120}
              height={180}
              className="vapi-cover-image w-30! h-auto!"
              priority
            />
            <div className="vapi-mic-wrapper absolute">
              <button
                disabled={status === 'connecting'}
                className={`vapi-mic-btn shadow-md w-15! h-15! z-1 'vapi-mic-btn-active' : 'vapi-mic-btn-inactive'}`}
              >
                mic
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4 flex-1">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#212a3b] mb-1">
                {book.title}
              </h1>
              <p className="text-[#3d485e] font-medium">by {book.author}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="vapi-status-indicator">
                <span className={`vapi-status-dot`} />
                <span className="vapi-status-text">Indicator</span>
              </div>

              <div className="vapi-status-indicator">
                <span className="vapi-status-text">
                  Voice: {book.persona || 'Daniel'}
                </span>
              </div>

              <div className="vapi-status-indicator">
                <span className="vapi-status-text">Status</span>
              </div>
            </div>
          </div>
        </div>

        <div className="vapi-transcript-wrapper">
          <div className="transcript-container min-h-100">Transcript</div>
        </div>
      </div>
    </>
  );
};

export default VapiControls;
