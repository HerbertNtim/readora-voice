import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
  return (
    <header className="w-full fixed z-50 bg-('bg-primary')">
      <div className="flex navbar-height">
        <Link href="/" className="flex items-center gap-0.5">
          <Image src="/logo.png" alt="Readora Logo" width={42} height={26} />
          <span className="logo-text">Readora</span>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
