import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..', '..');

console.log('🔍 Nuper Ortho Pre-Commit Kalkanı Denetleniyor...');

try {
  // 1. Get list of staged files
  const stagedOutput = execSync('git diff --cached --name-only', { cwd: rootDir, encoding: 'utf8' }).trim();
  const stagedFiles = stagedOutput ? stagedOutput.split(/\r?\n/) : [];

  // 2. Monolitik index.html koruması
  const indexHtmlStaged = stagedFiles.find(f => f.replace(/\\/g, '/').endsWith('ui/index.html'));
  if (indexHtmlStaged) {
    const diff = execSync(`git diff --cached -- "${indexHtmlStaged}"`, { cwd: rootDir, encoding: 'utf8' });
    const addedLines = (diff.match(/^\+[^+]/gm) || []).length;
    if (addedLines > 10) {
      console.error(`\n❌ [KURAL 1 İHLALİ] ui/index.html dosyasına doğrudan ${addedLines} satır eklendi!`);
      console.error('  Monolitik index.html dosyasına yeni kod eklemek kesinlikle yasaktır.');
      console.error('  Tüm yeni geliştirmeler modüler ui/src/ yapısında yapılmalıdır.\n');
      process.exit(1);
    }
  }

  // 3. scratch/ klasörü koruması (Sadece yeni ekleme veya düzenlemeleri engelle, silmeye/tasfiyeye izin ver)
  const stagedAddedModified = execSync('git diff --cached --diff-filter=ACM --name-only', { cwd: rootDir, encoding: 'utf8' }).trim();
  const addedModifiedFiles = stagedAddedModified ? stagedAddedModified.split(/\r?\n/) : [];
  const scratchStaged = addedModifiedFiles.filter(f => f.replace(/\\/g, '/').includes('/scratch/') || f.replace(/\\/g, '/').startsWith('scratch/'));
  if (scratchStaged.length > 0) {
    console.error(`\n❌ [KURAL 2 İHLALİ] scratch/ klasöründeki geçici dosyalar commitlenemez!`);
    console.error('  Stage edilmiş scratch dosyaları:');
    scratchStaged.forEach(f => console.error(`   - ${f}`));
    console.error('  Lütfen scratch dosyalarını unstage edin veya kalıcı testlere dönüştürün.\n');
    process.exit(1);
  }

  // 4. Typecheck kontrolü
  console.log('  -> TypeScript tipleri denetleniyor...');
  execSync('npm run typecheck', { cwd: rootDir, stdio: 'inherit' });

  console.log('✅ Pre-Commit Kalkanı: Tüm denetimler başarıyla geçti!\n');
} catch (err) {
  console.error('\n❌ Pre-Commit denetimi başarısız oldu:', err.message);
  process.exit(1);
}
