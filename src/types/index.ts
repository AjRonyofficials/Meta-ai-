export type Language = 'en' | 'bn';

export interface RepoFile {
  name: string;
  size: string;
  type: 'code' | 'config' | 'binary' | 'doc';
  description: string;
  descriptionBn: string;
  content?: string;
  path: string;
  isExecutable?: boolean;
}

export interface ApprovalEntry {
  id: string;
  rawKey: string;
  keyNumber: string;
  type: 'admin' | 'paid' | 'trial';
  name?: string;
  duration?: string;
  durationBn?: string;
  price?: string;
  expiryNote?: string;
  sourceFile: 'Approval.txt' | 'apvl.txt' | 'custom';
}

export interface TotpAccount {
  id: string;
  label: string;
  issuer: string;
  secret: string;
  digits: number;
  period: number;
  createdAt: number;
}

export interface GeneratedProfile {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  password: string;
  dob: string;
  gender: 'Male' | 'Female';
  phone: string;
  userAgent: string;
  country: string;
}

export interface TempEmailMessage {
  id: string;
  from: string;
  subject: string;
  date: string;
  snippet: string;
  body: string;
  extractedOtp?: string;
}

export interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'success' | 'system' | 'banner';
  text: string;
}
