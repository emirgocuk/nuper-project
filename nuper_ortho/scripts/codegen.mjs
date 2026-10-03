import { compileFromFile } from 'json-schema-to-typescript';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const schemasDir = path.join(rootDir, 'schemas');
const tsOutputDir = path.join(rootDir, 'ui', 'src', 'types', 'generated');
const pyOutputDir = path.join(rootDir, 'tools', 'models');

if (!fs.existsSync(tsOutputDir)) {
  fs.mkdirSync(tsOutputDir, { recursive: true });
}
if (!fs.existsSync(pyOutputDir)) {
  fs.mkdirSync(pyOutputDir, { recursive: true });
}

// Create __init__.py in pyOutputDir
const initPy = path.join(pyOutputDir, '__init__.py');
if (!fs.existsSync(initPy)) {
  fs.writeFileSync(initPy, '# Generated Pydantic Models for Nuper Ortho\n');
}

const schemas = [
  { file: 'drawing_data.schema.json', tsOut: 'drawing_data.d.ts', pyOut: 'generated_drawing_data.py' },
  { file: 'cad_metadata.schema.json', tsOut: 'cad_metadata.d.ts', pyOut: 'generated_cad_metadata.py' },
  { file: 'inspection_plan.schema.json', tsOut: 'inspection_plan.d.ts', pyOut: 'generated_inspection_plan.py' }
];

async function runCodegen() {
  console.log('🔄 Nuper Ortho Codegen başlatılıyor...');

  for (const item of schemas) {
    const schemaPath = path.join(schemasDir, item.file);
    if (!fs.existsSync(schemaPath)) {
      console.warn(`⚠️ Şema bulunamadı: ${schemaPath}`);
      continue;
    }

    // 1. Generate TypeScript definition
    const tsContent = await compileFromFile(schemaPath, {
      bannerComment: `/* eslint-disable */\n/**\n * Bu dosya schemas/${item.file} üzerinden otomatik üretilmiştir.\n * ELLE DEĞİŞTİRMEYİN. 'npm run codegen' ile güncelleyin.\n */\n`
    });
    const tsFilePath = path.join(tsOutputDir, item.tsOut);
    fs.writeFileSync(tsFilePath, tsContent, 'utf8');
    console.log(`  ✓ TypeScript üretildi: ${path.relative(rootDir, tsFilePath)}`);

    // 2. Generate Python Pydantic models
    const pyFilePath = path.join(pyOutputDir, item.pyOut);
    try {
      execSync(`datamodel-codegen --input "${schemaPath}" --output "${pyFilePath}" --output-model-type pydantic_v2.BaseModel`, {
        cwd: rootDir,
        stdio: 'pipe'
      });
      console.log(`  ✓ Python Pydantic üretildi: ${path.relative(rootDir, pyFilePath)}`);
    } catch (e) {
      console.warn(`  ⚠️ Python datamodel-codegen uyarısı (${item.file}):`, e.message);
    }
  }

  // Create an index.d.ts re-exporting all generated types
  const indexDts = schemas.map(s => `export * from './${s.tsOut.replace('.d.ts', '')}';`).join('\n') + '\n';
  fs.writeFileSync(path.join(tsOutputDir, 'index.d.ts'), indexDts, 'utf8');
  console.log(`  ✓ TypeScript indeks üretildi: ${path.relative(rootDir, path.join(tsOutputDir, 'index.d.ts'))}`);

  console.log('✅ Tüm tip sözleşmeleri (TypeScript & Python Pydantic) başarıyla senkronize edildi.');
}

runCodegen().catch(err => {
  console.error('❌ Codegen başarısız:', err);
  process.exit(1);
});
