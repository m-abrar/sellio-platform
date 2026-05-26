import React from 'react';
import { Link } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';

export default function NotFoundView() {
  return (
    <div className="px-3">
      <EmptyState
        icon={SearchX}
        title="Page not found"
        description="That buyer panel page does not exist or has moved."
        actionLabel="Back to dashboard"
        onAction={() => {
          window.location.href = '/';
        }}
      />
      <div className="mt-4 text-center">
        <Link to="/" className="text-xs font-bold text-zinc-400 hover:text-zinc-900">
          Open dashboard
        </Link>
      </div>
    </div>
  );
}
