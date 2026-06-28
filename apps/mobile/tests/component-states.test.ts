import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { resolveCollectionState, resolveProtectedScreenState } from '../src/components/states/stateModel';

test('collection component state prioritizes loading, error, empty, and content correctly', () => {
  assert.equal(resolveCollectionState(true, null, 0), 'loading');
  assert.equal(resolveCollectionState(false, new Error('Failed'), 0), 'error');
  assert.equal(resolveCollectionState(false, null, 0), 'empty');
  assert.equal(resolveCollectionState(true, null, 2), 'content');
  assert.equal(resolveCollectionState(false, new Error('Refresh failed'), 2), 'content');
});

test('authenticated component state distinguishes restore, redirect, and content', () => {
  assert.equal(resolveProtectedScreenState(true, false), 'restoring');
  assert.equal(resolveProtectedScreenState(false, false), 'sign_in');
  assert.equal(resolveProtectedScreenState(false, true), 'content');
});
