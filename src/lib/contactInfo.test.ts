import { test } from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_PROFILE } from './initialData';
import { updateLegacyContacts, WHATSAPP_URL, TELEGRAM_URL } from './contactInfo';

test('old cached contacts upgrade without overriding later owner edits', () => {
  const old = { ...INITIAL_PROFILE, whatsappUrl: 'https://wa.me/6281258661601', telegramUrl: 'https://t.me/jupriekapratama' };
  const upgraded = updateLegacyContacts(old);
  assert.equal(upgraded.whatsappUrl, WHATSAPP_URL);
  assert.equal(upgraded.telegramUrl, TELEGRAM_URL);
  const edited = { ...upgraded, telegramUrl: 'https://t.me/new_owner' };
  assert.equal(updateLegacyContacts(edited).telegramUrl, edited.telegramUrl);
  assert.equal(old.telegramUrl, 'https://t.me/jupriekapratama');
});
