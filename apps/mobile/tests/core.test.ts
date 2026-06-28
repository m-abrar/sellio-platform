import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { firstValidationMessage, responseErrorMessage } from '../src/api/errors';
import { supportsBuyerMobile } from '../src/auth/buyerAccess';
import { parseStoredSession, serializeStoredUser } from '../src/auth/sessionCodec';
import { validateBuyerRegistration, validatePasswordChange } from '../src/validation/auth';

test('API errors prefer Laravel validation details and preserve fallback messages', () => {
  assert.equal(firstValidationMessage({ email: ['Email is invalid.'] }), 'Email is invalid.');
  assert.equal(responseErrorMessage(422, 'Validation failed.', { password: ['Password is too short.'] }), 'Password is too short.');
  assert.equal(responseErrorMessage(503, 'Service unavailable.', null), 'Service unavailable.');
  assert.equal(responseErrorMessage(500, null, null), 'Request failed (500).');
});

test('auth validation rejects incomplete, weak, mismatched, and reused passwords', () => {
  assert.match(validatePasswordChange('', '', '') || '', /current password/i);
  assert.match(validatePasswordChange('old-password', 'short', 'short') || '', /8 characters/i);
  assert.match(validatePasswordChange('old-password', 'new-password', 'different') || '', /confirmation/i);
  assert.match(validatePasswordChange('same-password', 'same-password', 'same-password') || '', /different/i);
  assert.equal(validatePasswordChange('old-password', 'new-password', 'new-password'), null);
  assert.match(validateBuyerRegistration('Buyer', 'invalid', 'password123', 'password123') || '', /valid email/i);
  assert.equal(validateBuyerRegistration('Buyer', 'buyer@example.test', 'password123', 'password123'), null);
});

test('session codec round-trips valid users and rejects incomplete or corrupt storage', () => {
  const user = { id: 7, name: 'Buyer' };
  assert.deepEqual(parseStoredSession('token', serializeStoredUser(user)), { token: 'token', user });
  assert.equal(parseStoredSession(null, serializeStoredUser(user)), null);
  assert.equal(parseStoredSession('token', '{broken-json'), null);
  assert.equal(parseStoredSession('token', 'null'), null);
});

test('buyer access allows buyer-capable mixed accounts and blocks seller-only accounts', () => {
  assert.equal(supportsBuyerMobile({ id: 1, name: 'Buyer', is_buyer: true, roles: ['user'] }), true);
  assert.equal(supportsBuyerMobile({ id: 2, name: 'Mixed', is_buyer: false, roles: ['partner', 'user'] }), true);
  assert.equal(supportsBuyerMobile({ id: 3, name: 'Seller', is_buyer: false, roles: ['partner'] }), false);
});
