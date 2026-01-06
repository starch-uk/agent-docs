import fs from 'fs';
import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root of the installed package
const packageRoot = __dirname;

// Root of the consumer project (where npm/pnpm/yarn runs postinstall)
const consumerRoot = process.cwd();

// This package's docs directory
const packageDocsDir = path.join(packageRoot, 'docs');

// The docs directory in the consumer project
const consumerDocsDir = path.join(consumerRoot, 'docs');

async function copyDirRecursive(src, dest) {
  const stats = await fs.promises.stat(src);
  if (stats.isDirectory()) {
    await fs.promises.mkdir(dest, { recursive: true });
    const entries = await fs.promises.readdir(src);
    for (const entry of entries) {
      const srcPath = path.join(src, entry);
      const destPath = path.join(dest, entry);
      await copyDirRecursive(srcPath, destPath);
    }
  } else {
    await fs.promises.copyFile(src, dest);
  }
}

async function main() {
  try {
    // Ensure this package actually has a docs directory
    const pkgDocsStats = await fs.promises.stat(packageDocsDir).catch(() => null);
    if (!pkgDocsStats || !pkgDocsStats.isDirectory()) {
      return;
    }

    // If the consumer already has a docs directory, do nothing
    const consumerDocsStats = await fs.promises.stat(consumerDocsDir).catch(() => null);
    if (consumerDocsStats) {
      return;
    }

    // Copy the docs directory instead of creating symlinks
    // This is more reliable across different environments
    await copyDirRecursive(packageDocsDir, consumerDocsDir);

  } catch (error) {
    // Never fail install because of docs-copying issues
    // In production, this should be silent, but for debugging we'll leave it
    console.warn('Warning: Failed to copy agent-docs to consumer docs directory:', error.message);
  }
}

main();


