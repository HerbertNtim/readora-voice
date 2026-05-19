/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export function ThemeButton() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const current = theme === 'system' ? resolvedTheme : theme;

  const toggleTheme = () => {
    setTheme(current === 'light' ? 'dark' : 'light');
  };

  return (
    <Button
      variant="ghost"
      size="lg"
      onClick={toggleTheme}
      className="cursor-pointer mx-5"
    >
      {current === 'dark' ? (
        <Moon className="moon-icon" />
      ) : (
        <Sun className="sun-icon" />
      )}
    </Button>
  );
}
