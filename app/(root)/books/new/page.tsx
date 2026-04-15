import UploadForm from '@/components/UploadForm';

const AddBook = () => {
  return (
    <main className="wrapper container">
      <div className="mx-auto max-w-180 space-y-10">
        <section className="flex flex-col gap-5">
          <p className="text-sm uppercase tracking-[0.35em] text-[#663820]">
            New chapter ahead
          </p>
          <h1 className="page-title-xl">Add New Book</h1>
          <p className="subtitle max-w-2xl">
            Gather your PDF, select a voice, and let the assistant synthesize a
            warm book experience.
          </p>
        </section>

        <UploadForm />
      </div>
    </main>
  );
};

export default AddBook;
