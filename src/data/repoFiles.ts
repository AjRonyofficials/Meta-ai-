import { RepoFile, ApprovalEntry } from '../types';

export const REPO_METADATA = {
  name: 'AP-SM',
  fullName: 'SIAM-TEAM-143/AP-SM',
  url: 'https://github.com/SIAM-TEAM-143/AP-SM.git',
  owner: 'SIAM-TEAM-143',
  license: 'Private / Tool License',
  telegram: 'https://t.me/SMSIAMSM',
  telegramUsername: '@SMSIAMSM',
  defaultBranch: 'main',
  platform: 'Termux (Android ARM64/aarch64) & Linux/Web',
  latestVersion: 'v7.0 (SM7)',
  commitCount: '100+',
  lastUpdate: 'Active',
};

export const REPO_FILES: RepoFile[] = [
  {
    name: 'Approval.txt',
    path: 'Approval.txt',
    size: '400 B',
    type: 'config',
    description: 'Master list of approved Admin and Paid User hardware keys and license durations.',
    descriptionBn: 'অনুমোদিত অ্যাডমিন এবং পেইড ইউজার হার্ডওয়্যার কী এবং মেয়াদের মাস্টার ফাইল।',
    content: `#_________/Admin\\________
SM~(10453=(SIAM)=10453)~SM
rakip vai admin 1
SM~(10462=(SIAM)=10462)~SM
# Owner / User 12015 VIP Approved
SM~(12015=(SIAM)=12015)~SM
#_________/paid user\\________
# User 12015 Lifetime VIP Active
SM~(12015=(SIAM)=12015)~SM
#roki  YOUR KEY >> SM~(10452=(SIAM)=10452)~SM 1daymeta tols
SM~(10350=(SIAM)=10350)~SM ====> SM~(10352=(SIAM)=10352)~SM =>>>>>3 days $2.50 =>>>24 =>>> 27 last
SM~(10361=(SIAM)=10361)~SM  30 days 600 ewut>> SM~(10481=(SIAM)=10481)~SM ====>> 3 sep =====> 20 sep last`,
  },
  {
    name: 'apvl.txt',
    path: 'apvl.txt',
    size: '276 B',
    type: 'config',
    description: 'Secondary approval file checked by update modules and OTP verification.',
    descriptionBn: 'আপডেট মডিউল এবং ওটিপি ভেরিফিকেশন দ্বারা চেক করা অনুমোদন ফাইল।',
    content: `#________________/admin\\_______________#
SM~(10453=(SIAM)=10453)~SM
SM~(12015=(SIAM)=12015)~SM
#_______________/paid user_____________#####
SM~(12015=(SIAM)=12015)~SM Lifetime Approved
   Evann 5$ SM~(10689=(SIAM)=10689)~SM  ==> 6-last 12
SM~(10375=(SIAM)=10375)~SM_____ 1 day free
SM~(12015=(SIAM)=12015)~SM
SM~(10356=(SIAM)=10356)~SM`,
  },
  {
    name: 'META.py',
    path: 'META.py',
    size: '541 B',
    type: 'code',
    isExecutable: true,
    description: 'Entry-point for Meta (FB) automation module with 64-bit architecture validation.',
    descriptionBn: 'মেটা (ফেসবুক) অটোমেশন মডিউলের এন্ট্রি পয়েন্ট এবং ৬৪-বিট আর্কিটেকচার চেকার।',
    content: `import platform

if platform.architecture()[0] != "64bit":
    print("32bit Not Supported!")
else:
    try:
        import metasmct
        # Start the module's main entry point
        if hasattr(metasmct, "main_menu"):
            metasmct.main_menu()
        elif hasattr(metasmct, "main"):
            metasmct.main()
        else:
            print("Error: entry function not found.")
    except Exception as e:
        import traceback
        print(f"\\nCRITICAL ERROR: {e}")
        traceback.print_exc()
        input("\\nPress Enter to exit...")`,
  },
  {
    name: 'SM7.py',
    path: 'SM7.py',
    size: '511 B',
    type: 'code',
    isExecutable: true,
    description: 'Main launcher for Siam Team AP-SM V7.0 with compiled core loader (v7.so).',
    descriptionBn: 'সিয়াম টিম AP-SM V7.0 এর প্রধান লঞ্চার এবং v7 কোর লোডার।',
    content: `import platform

if platform.architecture()[0] != "64bit":
    print("32bit Not Supported!")
else:
    try:
        import v7
        # Start the module's main entry point
        if hasattr(v7, "main_menu"):
            v7.main_menu()
        elif hasattr(v7, "main"):
            v7.main()
        else:
            print("Error: entry function not found.")
    except Exception as e:
        import traceback
        print(f"\\nCRITICAL ERROR: {e}")
        traceback.print_exc()
        input("\\nPress Enter to exit...")`,
  },
  {
    name: 'SM-OTP.py',
    path: 'SM-OTP.py',
    size: '554 B',
    type: 'code',
    isExecutable: true,
    description: 'Dedicated 2FA / TOTP and SMS/Mail OTP receiver and validator runner.',
    descriptionBn: 'ডেডিকেটেড ২এফএ / টিওটিপি এবং ওটিপি রিসিভার ও ভ্যালিডেটর রানার।',
    content: `import platform

if platform.architecture()[0] != "64bit":
    print("32bit Not Supported!")
else:
    try:
        import xotp
        # Start the module's main entry point
        if hasattr(xotp, "main_menu"):
            xotp.main_menu()
        elif hasattr(xotp, "main"):
            xotp.main()
        else:
            print("Error: xotp entry function not found.")
    except Exception as e:
        import traceback
        print(f"\\nCRITICAL ERROR: {e}")
        traceback.print_exc()
        input("\\nPress Enter to exit...")`,
  },
  {
    name: 'README.md',
    path: 'README.md',
    size: '7 B',
    type: 'doc',
    description: 'Original repo README file.',
    descriptionBn: 'অরিজিনাল রিপোজিটরি রিডমি ফাইল।',
    content: `# AP-SM\n\nTermux Siam Team AP-SM Automation and Approval Suite.`,
  },
  {
    name: 'v7.cpython-313-aarch64-linux-android.so',
    path: 'v7.cpython-313-aarch64-linux-android.so',
    size: '132.4 KB',
    type: 'binary',
    description: 'Cython-compiled high-performance binary module for Termux Python 3.13 aarch64.',
    descriptionBn: 'টার্মাক্স পাইথন ৩.১৩ aarch64 আর্কিটেকচারের জন্য সাইথন কম্পাইল্ড বাইনারি মডিউল।',
    content: `[ELF 64-bit LSB shared object, ARM aarch64, version 1 (SYSV), dynamically linked]
Exported Symbols:
 - PyInit_v7
 - main_menu
 - check_approval
 - get_device_token
 - verify_subscription`,
  },
  {
    name: 'metasmct.cpython-313-aarch64-linux-android.so',
    path: 'metasmct.cpython-313-aarch64-linux-android.so',
    size: '99.3 KB',
    type: 'binary',
    description: 'Compiled engine for Meta account operations and HTTP requests.',
    descriptionBn: 'মেটা অ্যাকাউন্ট অপারেশন এবং এইচটিটিপি রিকোয়েস্টের কম্পাইল্ড ইঞ্জিন।',
    content: `[ELF 64-bit LSB shared object, ARM aarch64, Python 3.13]
Exported Symbols:
 - PyInit_metasmct
 - main_menu
 - meta_creator
 - proxy_rotator`,
  },
  {
    name: 'xotp.cpython-313-aarch64-linux-android.so',
    path: 'xotp.cpython-313-aarch64-linux-android.so',
    size: '167.6 KB',
    type: 'binary',
    description: 'Compiled TOTP, pyotp wrapper and DongvanFB message polling engine.',
    descriptionBn: 'কম্পাইল্ড টিওটিপি, পাইওটিপি র‍্যাপার এবং ডংভানএফবি মেসেজ পোলিং ইঞ্জিন।',
    content: `[ELF 64-bit LSB shared object, ARM aarch64, Python 3.13]
Exported Symbols:
 - PyInit_xotp
 - totp_generator
 - fetch_otp_dongvan
 - tempmail_listener`,
  },
];

export const INITIAL_APPROVED_KEYS: ApprovalEntry[] = [
  {
    id: 'k_owner_12015',
    rawKey: 'SM~(12015=(SIAM)=12015)~SM',
    keyNumber: '12015',
    type: 'admin',
    name: 'Owner (12015 VIP)',
    duration: 'Lifetime VIP (Unlimited)',
    durationBn: 'লাইফটাইম ভিআইপি (স্থায়ী অনুমোদন)',
    price: 'Owner VIP',
    expiryNote: 'Permanent Full Access & Execution',
    sourceFile: 'Approval.txt',
  },
  {
    id: 'k1',
    rawKey: 'SM~(10453=(SIAM)=10453)~SM',
    keyNumber: '10453',
    type: 'admin',
    name: 'Siam Khan (Super Admin)',
    duration: 'Lifetime VIP',
    durationBn: 'লাইফটাইম ভিআইপি',
    price: 'Owner',
    expiryNote: 'Permanent Root Access',
    sourceFile: 'Approval.txt',
  },
  {
    id: 'k2',
    rawKey: 'SM~(10462=(SIAM)=10462)~SM',
    keyNumber: '10462',
    type: 'admin',
    name: 'Rakib Vai (Admin 1)',
    duration: 'Lifetime Admin',
    durationBn: 'লাইফটাইম অ্যাডমিন',
    price: 'Admin',
    expiryNote: 'Full Admin Privileges',
    sourceFile: 'Approval.txt',
  },
  {
    id: 'k3',
    rawKey: 'SM~(10452=(SIAM)=10452)~SM',
    keyNumber: '10452',
    type: 'paid',
    name: 'Roki',
    duration: '1 Day (Meta Tools)',
    durationBn: '১ দিন (মেটা টুলস)',
    price: '$1.00',
    expiryNote: 'Meta tools activated',
    sourceFile: 'Approval.txt',
  },
  {
    id: 'k4',
    rawKey: 'SM~(10350=(SIAM)=10350)~SM',
    keyNumber: '10350',
    type: 'paid',
    name: 'VIP User 10350',
    duration: '3 Days',
    durationBn: '৩ দিন',
    price: '$2.50',
    expiryNote: 'Validity: 24th - 27th',
    sourceFile: 'Approval.txt',
  },
  {
    id: 'k5',
    rawKey: 'SM~(10352=(SIAM)=10352)~SM',
    keyNumber: '10352',
    type: 'paid',
    name: 'VIP User 10352',
    duration: '3 Days',
    durationBn: '৩ দিন',
    price: '$2.50',
    expiryNote: 'Validity: 24th - 27th',
    sourceFile: 'Approval.txt',
  },
  {
    id: 'k6',
    rawKey: 'SM~(10361=(SIAM)=10361)~SM',
    keyNumber: '10361',
    type: 'paid',
    name: 'Monthly Subscriber',
    duration: '30 Days',
    durationBn: '৩০ দিন',
    price: '600 BDT',
    expiryNote: 'Validity: 3 Sep - 20 Sep',
    sourceFile: 'Approval.txt',
  },
  {
    id: 'k7',
    rawKey: 'SM~(10481=(SIAM)=10481)~SM',
    keyNumber: '10481',
    type: 'paid',
    name: 'Extended Member 10481',
    duration: '17 Days (Exp: 20 Sep)',
    durationBn: '১৭ দিন (মেয়াদ: ২০ সেপ্টেম্বর)',
    price: '400 BDT',
    expiryNote: 'Active license',
    sourceFile: 'Approval.txt',
  },
  {
    id: 'k8',
    rawKey: 'SM~(10689=(SIAM)=10689)~SM',
    keyNumber: '10689',
    type: 'paid',
    name: 'Evann',
    duration: '6 Days (Exp: 12th)',
    durationBn: '৬ দিন (মেয়াদ: ১২ তারিখ)',
    price: '$5.00',
    expiryNote: 'Payment Verified in apvl.txt',
    sourceFile: 'apvl.txt',
  },
  {
    id: 'k9',
    rawKey: 'SM~(10375=(SIAM)=10375)~SM',
    keyNumber: '10375',
    type: 'trial',
    name: 'Trial User 10375',
    duration: '1 Day Free',
    durationBn: '১ দিন ফ্রি ট্রায়াল',
    price: 'Free Trial',
    expiryNote: 'Promotional 24h pass',
    sourceFile: 'apvl.txt',
  },
  {
    id: 'k10',
    rawKey: 'SM~(12015=(SIAM)=12015)~SM',
    keyNumber: '12015',
    type: 'paid',
    name: 'Subscriber 12015',
    duration: '7 Days',
    durationBn: '৭ দিন',
    price: '250 BDT',
    expiryNote: 'Active license',
    sourceFile: 'apvl.txt',
  },
  {
    id: 'k11',
    rawKey: 'SM~(10356=(SIAM)=10356)~SM',
    keyNumber: '10356',
    type: 'paid',
    name: 'Subscriber 10356',
    duration: '3 Days',
    durationBn: '৩ দিন',
    price: '$2.50',
    expiryNote: 'Active license',
    sourceFile: 'apvl.txt',
  },
];
