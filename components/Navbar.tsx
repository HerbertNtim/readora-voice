'use client';

import { cn } from '@/lib/utils';
import { Show, SignInButton, UserButton, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { label: 'Library', href: '/' },
  { label: 'Add New', href: '/books/new' },
];

const Navbar = () => {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <header className="w-full fixed z-50 bg-(--bg-primary)">
      <div className="wrapper flex items-center justify-between navbar-height py-4">
        <Link href="/" className="flex items-center gap-0.5">
          <Image
            src="/logo.png"
            alt="Readora Logo"
            width={42}
            height={26}
            style={{ width: 42, height: 26 }}
          />
          <span className="logo-text">Readora</span>
        </Link>

        <nav className="w-fit flex gap-7 items-center">
          {navLinks.map((link) => {
            const isActive = pathname === link.href && pathname !== '/';

            return (
              <Link
                href={link.href}
                key={link.label}
                className={cn(
                  'nav-link-base',
                  isActive ? 'nav-link-active' : 'text-black hover:opacity-70',
                )}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="flex items-center gap-2">
            <Show when="signed-out">
              <SignInButton />
            </Show>
            <Show when="signed-in">
              <div className="flex items-center gap-2">
                <UserButton />
                <Link href="/subscriptions" className="nav-user-name">
                  {user?.firstName && <span>{user.firstName}</span>}
                </Link>
              </div>
            </Show>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
