import Link from 'next/link';

const Navbar = () => {
  return (
    <header className="w-full fixed z-50 bg-('bg-primary')">
      <div className="flex navbar-height">
        <Link href="/" className="">
          Readora
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
