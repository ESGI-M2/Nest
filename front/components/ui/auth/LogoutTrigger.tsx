'use client';

import React, { useState, ReactElement, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface LogoutTriggerProps {
  children: ReactElement;
}

export default function LogoutTrigger({ children }: LogoutTriggerProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      router.push('/login');
    }
  };

  // wrap the child’s onClick, prevent default (for <a>), and inject our loader flag
  const onClick = (e: MouseEvent) => {
    e.preventDefault();
    handleLogout();
    children.props.onClick?.(e);
  };

  return React.cloneElement(children, {
    onClick,
  });
}
