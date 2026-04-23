import BookCard from '@/components/BookCard';
import HeroSection from '@/components/HeroSection';
import { getAllBooks } from '@/lib/actions/book.actions';
import { sampleBooks } from '@/lib/constants';

const HomePage = async () => {
  const booksResult = await getAllBooks();
  const books =
    booksResult?.success && booksResult?.booksData?.length
      ? booksResult.booksData
      : sampleBooks;

  return (
    <main className="wrapper container">
      <HeroSection />

      <div className="library-books-grid">
        {books.map((book) => (
          <BookCard
            key={book._id}
            title={book.title}
            author={book.author}
            coverURL={book.coverURL}
            slug={book.slug}
          />
        ))}
      </div>
    </main>
  );
};

export default HomePage;
