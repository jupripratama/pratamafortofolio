import { test } from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_PROFILE } from './initialData';
import { updateLegacyContacts, WHATSAPP_URL, TELEGRAM_URL, GITHUB_URL } from './contactInfo';

test('old cached contacts upgrade without overriding later owner edits', () => {
  const old = { ...INITIAL_PROFILE, whatsappUrl: 'https://wa.me/6281258661601', telegramUrl: 'https://t.me/jupriekapratama', githubUrl: 'https://github.com/jupriekapratama' };
  const upgraded = updateLegacyContacts(old);
  assert.equal(upgraded.whatsappUrl, WHATSAPP_URL);
  assert.equal(upgraded.telegramUrl, TELEGRAM_URL);
  assert.equal(upgraded.githubUrl, GITHUB_URL);
  const edited = { ...upgraded, telegramUrl: 'https://t.me/new_owner', githubUrl: 'https://github.com/custom_user' };
  assert.equal(updateLegacyContacts(edited).telegramUrl, edited.telegramUrl);
  assert.equal(updateLegacyContacts(edited).githubUrl, edited.githubUrl);
  assert.equal(old.telegramUrl, 'https://t.me/jupriekapratama');
  assert.equal(old.githubUrl, 'https://github.com/jupriekapratama');
});
