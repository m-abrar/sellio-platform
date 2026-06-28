export type CollectionState = 'loading' | 'error' | 'empty' | 'content';

export function resolveCollectionState(loading: boolean, error: unknown, itemCount: number): CollectionState {
  if (loading && itemCount === 0) return 'loading';
  if (error && itemCount === 0) return 'error';
  if (itemCount === 0) return 'empty';
  return 'content';
}

export type ProtectedScreenState = 'restoring' | 'sign_in' | 'content';

export function resolveProtectedScreenState(isLoading: boolean, isAuthenticated: boolean): ProtectedScreenState {
  if (isLoading) return 'restoring';
  if (!isAuthenticated) return 'sign_in';
  return 'content';
}
