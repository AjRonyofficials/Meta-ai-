import { GeneratedProfile } from '../types';

export const BD_FIRST_NAMES_MALE = [
  'Siam', 'Rakibul', 'Tanvir', 'Ariful', 'Mehedi', 'Nahid', 'Sakib', 'Shohan', 'Fahim',
  'Shakil', 'Imran', 'Hasan', 'Alamin', 'Rony', 'Sabbir', 'Nayeem', 'Rashed', 'Jubayer',
  'Ashiq', 'Tareq', 'Joy', 'Mahfuz', 'Sohel', 'Kamrul', 'Sumon'
];

export const BD_FIRST_NAMES_FEMALE = [
  'Nusrat', 'Sumaiya', 'Sadia', 'Fatema', 'Mim', 'Jannat', 'Ayesha', 'Tania', 'Sharmin',
  'Ritu', 'Farhana', 'Rima', 'Tasnim', 'Samia', 'Marufa', 'Israt', 'Bristy', 'Nadia'
];

export const BD_LAST_NAMES = [
  'Khan', 'Islam', 'Hossain', 'Ahmed', 'Haque', 'Rahman', 'Chowdhury', 'Miah', 'Sheikh',
  'Sikder', 'Sarker', 'Molla', 'Talukder', 'Bhuiyan', 'Akter', 'Khatun', 'Begum'
];

export const GLOBAL_FIRST_NAMES = [
  'Alex', 'David', 'Michael', 'James', 'Daniel', 'Liam', 'Noah', 'Ethan', 'Lucas',
  'Emma', 'Sophia', 'Olivia', 'Ava', 'Mia', 'Isabella', 'Harper', 'Ella'
];

export const GLOBAL_LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Wilson', 'Anderson', 'Taylor'
];

export const USER_AGENTS = [
  {
    name: 'SAMSUNG GT-S3802 Opera Mini (From ASM.py)',
    ua: 'SAMSUNG-GT-S3802 Opera/9.80 (J2ME/MIDP; Opera Mini/12.16.0000/123.123; en) Presto/2.12.423 Version/12.16',
  },
  {
    name: 'Dalvik / Android 14 (Google Pixel 8)',
    ua: 'Dalvik/2.1.0 (Linux; U; Android 14; Pixel 8 Build/UD1A.230803.041)',
  },
  {
    name: 'Chrome Mobile / Android 13 (Samsung S23)',
    ua: 'Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.144 Mobile Safari/537.36',
  },
  {
    name: 'Facebook Lite App (Android Termux client)',
    ua: 'Mozilla/5.0 (Linux; Android 11; SM-A125F Build/RP1A.200720.012; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/92.0.4515.131 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/329.0.0.29.120;]',
  },
  {
    name: 'Opera Mobile Android 12',
    ua: 'Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36 OPR/79.2.4195.76840',
  },
  {
    name: 'Mobile Safari / iOS 17 (iPhone 15 Pro)',
    ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
  },
];

const BD_OPERATOR_PREFIXES = ['017', '018', '019', '013', '014', '016', '015'];

export function generatePhoneNumber(country: 'BD' | 'US'): string {
  if (country === 'BD') {
    const prefix = BD_OPERATOR_PREFIXES[Math.floor(Math.random() * BD_OPERATOR_PREFIXES.length)];
    const rest = Math.floor(10000000 + Math.random() * 90000000).toString().substring(0, 8);
    return `+880${prefix.substring(1)}${rest}`;
  } else {
    const area = Math.floor(200 + Math.random() * 800);
    const mid = Math.floor(200 + Math.random() * 800);
    const end = Math.floor(1000 + Math.random() * 9000);
    return `+1 (${area}) ${mid}-${end}`;
  }
}

export function generateStrongPassword(name: string): string {
  const cleanName = name.replace(/[^a-zA-Z]/g, '').toLowerCase();
  const base = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
  const symbols = ['@#$', '#!$', '@99', '#77', '$$21', '@143'];
  const sym = symbols[Math.floor(Math.random() * symbols.length)];
  const randNum = Math.floor(100 + Math.random() * 900);
  return `${base}${sym}${randNum}`;
}

export function generateRandomBirthDate(): string {
  const year = Math.floor(1994 + Math.random() * 11); // 1994 - 2004 (20-30 years old)
  const month = String(Math.floor(1 + Math.random() * 12)).padStart(2, '0');
  const day = String(Math.floor(1 + Math.random() * 28)).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function generateSingleProfile(gender: 'Male' | 'Female' = 'Male', region: 'BD' | 'Global' = 'BD'): GeneratedProfile {
  let first: string;
  let last: string;

  if (region === 'BD') {
    const firstList = gender === 'Male' ? BD_FIRST_NAMES_MALE : BD_FIRST_NAMES_FEMALE;
    first = firstList[Math.floor(Math.random() * firstList.length)];
    last = BD_LAST_NAMES[Math.floor(Math.random() * BD_LAST_NAMES.length)];
  } else {
    first = GLOBAL_FIRST_NAMES[Math.floor(Math.random() * GLOBAL_FIRST_NAMES.length)];
    last = GLOBAL_LAST_NAMES[Math.floor(Math.random() * GLOBAL_LAST_NAMES.length)];
  }

  const fullName = `${first} ${last}`;
  const cleanFirst = first.toLowerCase().replace(/[^a-z]/g, '');
  const cleanLast = last.toLowerCase().replace(/[^a-z]/g, '');
  const randDigits = Math.floor(100 + Math.random() * 900);
  const emailDomains = ['gmail.com', 'outlook.com', 'temp-mail.io', 'dongvanfb.net'];
  const domain = emailDomains[Math.floor(Math.random() * emailDomains.length)];
  const email = `${cleanFirst}.${cleanLast}${randDigits}@${domain}`;

  const uaObj = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

  return {
    id: 'prof_' + Math.random().toString(36).substring(2, 9),
    firstName: first,
    lastName: last,
    fullName,
    email,
    password: generateStrongPassword(first),
    dob: generateRandomBirthDate(),
    gender,
    phone: generatePhoneNumber(region === 'BD' ? 'BD' : 'US'),
    userAgent: uaObj.ua,
    country: region === 'BD' ? 'Bangladesh' : 'United States',
  };
}

export function generateBatchProfiles(count: number, region: 'BD' | 'Global' = 'BD'): GeneratedProfile[] {
  const list: GeneratedProfile[] = [];
  for (let i = 0; i < count; i++) {
    const gender: 'Male' | 'Female' = Math.random() > 0.4 ? 'Male' : 'Female';
    list.push(generateSingleProfile(gender, region));
  }
  return list;
}
