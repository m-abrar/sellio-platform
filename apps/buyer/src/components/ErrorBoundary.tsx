import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { EmptyState } from './EmptyState';

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('Buyer panel route failed:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <EmptyState
          icon={AlertTriangle}
          title="Something went wrong"
          description="This buyer panel view could not be loaded."
          actionLabel="Reload"
          onAction={() => window.location.reload()}
        />
      );
    }

    return this.props.children;
  }
}
