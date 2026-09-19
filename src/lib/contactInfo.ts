import type { ProfileSettings } from '../types';

export const WHATSAPP_URL = 'https://wa.me/6289504186544';
export const TELEGRAM_URL = 'https://t.me/Pratama_j';

// Upgrade the previous defaults even when a profile is cached or loaded from CMS.
// Preserve any new contact values subsequently saved by the owner.
export function updateLegacyContacts(profile: ProfileSettings): ProfileSettings {
  return {
    ...profile,
    whatsappUrl: !profile.whatsappUrl || profile.whatsappUrl.includes('6281258661601')
      ? WHATSAPP_URL : profile.whatsappUrl,
    telegramUrl: !profile.telegramUrl || /^https?:\/\/t\.me\/jupriekapratama\/?$/i.test(profile.telegramUrl)
      ? TELEGRAM_URL : profile.telegramUrl,
  };
}
