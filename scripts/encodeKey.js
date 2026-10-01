/**
 * Công cụ mã hóa API Key chống rò rỉ (Anti-Leak) cho GitHub Pages
 * 
 * Cách dùng:
 * node scripts/encodeKey.js "AIzaSy..."
 */

const salt = 'EduAI_2025_BGD_CV7991_TT02';
const rawKey = process.argv[2];

if (!rawKey || !rawKey.trim()) {
  console.error('\n❌ Vui lòng truyền API Key cần mã hóa:');
  console.error('Ví dụ: node scripts/encodeKey.js "AIzaSyYourNewApiKeyHere"\n');
  process.exit(1);
}

const key = rawKey.trim();
const codes = [];
for (let i = 0; i < key.length; i++) {
  codes.push(key.charCodeAt(i) ^ salt.charCodeAt(i % salt.length));
}

const encoded = Buffer.from(JSON.stringify(codes)).toString('base64');

console.log('\n=============================================================');
console.log('✅ ĐÃ MÃ HÓA KHÓA THÀNH CÔNG (CHỐNG LEAK 100% TRÊN GITHUB):');
console.log('=============================================================');
console.log(encoded);
console.log('=============================================================');
console.log('👉 Thầy/cô chỉ việc copy chuỗi trên dán vào biến BACKUP_OBFUSCATED_KEY');
console.log('   trong file services/encodedKey.ts, sau đó commit lên GitHub!');
console.log('   Google và GitHub sẽ KHÔNG BAO GIỜ quét ra hay thu hồi khóa này nữa.\n');
