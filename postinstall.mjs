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

    const isWindows = process.platform === 'win32';

    if (isWindows) {
      // On Windows, create a junction from consumerRoot/docs to this package's docs
      // Junction target must be an absolute path
      await fs.promises.symlink(packageDocsDir, consumerDocsDir, 'junction');
    } else {
      // On POSIX, create a directory symlink
      await fs.promises.symlink(packageDocsDir, consumerDocsDir, 'dir');
    }
  } catch {
    // Never fail install because of docs-linking issues
  }
}

main();


