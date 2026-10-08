import { ApprovalEntry } from '../types';

export const KEY_REGEX = /SM~\((\d+)=\(SIAM\)=\1\)~SM/;

export function formatKey(num: string | number): string {
  const clean = String(num).trim();
  return `SM~(${clean}=(SIAM)=${clean})~SM`;
}

export function extractKeyNumber(raw: string): string | null {
  const match = raw.trim().match(KEY_REGEX);
  if (match) return match[1];
  
  // also check if user just entered the digits
  if (/^\d{4,8}$/.test(raw.trim())) {
    return raw.trim();
  }
  return null;
}

export function isValidKeyFormat(raw: string): boolean {
  return KEY_REGEX.test(raw.trim()) || /^\d{4,8}$/.test(raw.trim());
}

export function generateRandomKeyNumber(): string {
  return String(Math.floor(10000 + Math.random() * 90000));
}

export function generateFullKey(): { keyNumber: string; rawKey: string } {
  const keyNumber = generateRandomKeyNumber();
  return {
    keyNumber,
    rawKey: formatKey(keyNumber),
  };
}

export function getTelegramApprovalUrl(key: string): string {
  const formatted = extractKeyNumber(key) ? formatKey(extractKeyNumber(key)!) : key;
  const message = `Hello Sir ! Please Approve My Token The Token Is : ${formatted}`;
  return `https://t.me/SMSIAMSM?text=${encodeURIComponent(message)}`;
}

export function checkKeyApproval(input: string, approvedList: ApprovalEntry[]): {
  approved: boolean;
  entry?: ApprovalEntry;
  formattedKey: string;
} {
  const num = extractKeyNumber(input);
  if (!num) {
    return {
      approved: false,
      formattedKey: input,
    };
  }

  const formattedKey = formatKey(num);
  const found = approvedList.find(
    (item) => item.keyNumber === num || item.rawKey === formattedKey
  );

  return {
    approved: !!found,
    entry: found,
    formattedKey,
  };
}
