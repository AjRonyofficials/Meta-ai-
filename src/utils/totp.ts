import * as OTPAuth from 'otpauth';
import { TotpAccount } from '../types';

export function cleanSecret(secret: string): string {
  return secret.replace(/\s+/g, '').toUpperCase();
}

export function isValidBase32Secret(secret: string): boolean {
  const clean = cleanSecret(secret);
  return clean.length >= 8 && /^[A-Z2-7]+=*$/.test(clean);
}

export function generateTotpCode(secretStr: string, digits: number = 6, period: number = 30): string {
  try {
    const clean = cleanSecret(secretStr);
    const secret = OTPAuth.Secret.fromBase32(clean);
    const totp = new OTPAuth.TOTP({
      issuer: 'AP-SM',
      label: 'User',
      algorithm: 'SHA1',
      digits,
      period,
      secret,
    });
    return totp.generate();
  } catch {
    return '------';
  }
}

export function getTotpRemainingSeconds(period: number = 30): number {
  const epoch = Math.floor(Date.now() / 1000);
  return period - (epoch % period);
}

export function generateRandomSecret(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let result = '';
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const DEFAULT_TOTP_ACCOUNTS: TotpAccount[] = [
  {
    id: 'totp-1',
    label: 'FB Siam Bot 01',
    issuer: 'Meta / Facebook',
    secret: 'JBSWY3DPEHPK3PXP',
    digits: 6,
    period: 30,
    createdAt: Date.now() - 86400000,
  },
  {
    id: 'totp-2',
    label: 'Rakib VIP Account',
    issuer: 'Meta / Facebook',
    secret: 'KZXW6YTBOJWGS3TU',
    digits: 6,
    period: 30,
    createdAt: Date.now() - 43200000,
  },
  {
    id: 'totp-3',
    label: 'AP-SM Admin Gateway',
    issuer: 'SIAM-TEAM',
    secret: 'MFRGGZDFMZTWQ2LK',
    digits: 6,
    period: 30,
    createdAt: Date.now() - 10000000,
  },
];
