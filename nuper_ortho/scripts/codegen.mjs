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

const initPy = path.join(pyOutputDir, '__init__.py');
if (!fs.existsSync(initPy)) {
  fs.writeFileSync(initPy, '');
}

const schemas = [
  { file: 'drawing_data.schema.json', tsOut: 'drawing_data.d.ts', pyOut: 'generated_drawing_data.py' },
  { file: 'cad_metadata.schema.json', tsOut: 'cad_metadata.d.ts', pyOut: 'generated_cad_metadata.py' },
  { file: 'inspection_plan.schema.json', tsOut: 'inspection_plan.d.ts', pyOut: 'generated_inspection_plan.py' }
];

async function runCodegen() {
  for (const item of schemas) {
    const schemaPath = path.join(schemasDir, item.file);
    if (!fs.existsSync(schemaPath)) {
      continue;
    }

    let tsContent = await compileFromFile(schemaPath, {
      bannerComment: ''
    });
    tsContent = tsContent.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
    const tsFilePath = path.join(tsOutputDir, item.tsOut);
    fs.writeFileSync(tsFilePath, tsContent, 'utf8');

    const pyFilePath = path.join(pyOutputDir, item.pyOut);
    try {
      execSync(`python -m datamodel_code_generator --input "${schemaPath}" --output "${pyFilePath}" --output-model-type pydantic_v2.BaseModel`, {
        cwd: rootDir,
        stdio: 'pipe'
      });
      let pyContent = fs.readFileSync(pyFilePath, 'utf8');
      pyContent = pyContent.replace(/^#.*\r?\n/gm, '');
      fs.writeFileSync(pyFilePath, pyContent, 'utf8');
    } catch (e) {
      console.warn(e.message);
    }
  }

  const indexDts = schemas.map(s => `export * from './${s.tsOut.replace('.d.ts', '')}';`).join('\n') + '\n';
  fs.writeFileSync(path.join(tsOutputDir, 'index.d.ts'), indexDts, 'utf8');
}

runCodegen().catch(err => {
  console.error(err);
  process.exit(1);
});
