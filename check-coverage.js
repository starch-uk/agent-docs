#!/usr/bin/env node

/**
 * Script to calculate and display coverage from vitest coverage JSON files.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const coverageDir = path.join(__dirname, 'coverage', '.tmp');
const files = fs.readdirSync(coverageDir).filter(f => f.endsWith('.json'));

if (files.length === 0) {
	console.error('No coverage files found');
	process.exit(1);
}

// Read the first coverage file
const coverageFile = path.join(coverageDir, files[0]);
const data = JSON.parse(fs.readFileSync(coverageFile, 'utf8'));

if (!data.result) {
	console.error('No result in coverage data');
	process.exit(1);
}

const results = data.result;
const srcFiles = Object.keys(results).filter(k => k.includes('src/') && !k.includes('types.ts'));

let totalStatements = 0;
let coveredStatements = 0;
let totalBranches = 0;
let coveredBranches = 0;
let totalFunctions = 0;
let coveredFunctions = 0;
let totalLines = 0;
let coveredLines = 0;

for (const file of srcFiles) {
	const fileData = results[file];
	if (!fileData) continue;
	
	// Statements (s)
	if (fileData.s) {
		const statements = Object.values(fileData.s);
		totalStatements += statements.length;
		coveredStatements += statements.filter(s => s > 0).length;
	}
	
	// Branches (b)
	if (fileData.b) {
		const branches = Object.values(fileData.b);
		totalBranches += branches.length;
		coveredBranches += branches.filter(b => b[0] > 0 || b[1] > 0).length;
	}
	
	// Functions (f)
	if (fileData.f) {
		const functions = Object.values(fileData.f);
		totalFunctions += functions.length;
		coveredFunctions += functions.filter(f => f > 0).length;
	}
	
	// Lines (l)
	if (fileData.l) {
		const lines = Object.values(fileData.l);
		totalLines += lines.length;
		coveredLines += lines.filter(l => l > 0).length;
	}
}

const statementsPct = totalStatements > 0 ? (coveredStatements / totalStatements * 100).toFixed(2) : '100.00';
const branchesPct = totalBranches > 0 ? (coveredBranches / totalBranches * 100).toFixed(2) : '100.00';
const functionsPct = totalFunctions > 0 ? (coveredFunctions / totalFunctions * 100).toFixed(2) : '100.00';
const linesPct = totalLines > 0 ? (coveredLines / totalLines * 100).toFixed(2) : '100.00';

console.log('\nCoverage Summary:');
console.log('================');
console.log(`Statements : ${statementsPct}% (${coveredStatements}/${totalStatements})`);
console.log(`Branches   : ${branchesPct}% (${coveredBranches}/${totalBranches})`);
console.log(`Functions  : ${functionsPct}% (${coveredFunctions}/${totalFunctions})`);
console.log(`Lines      : ${linesPct}% (${coveredLines}/${totalLines})`);
console.log(`\nFiles analyzed: ${srcFiles.length}`);

// Check if we're at 100%
const is100 = parseFloat(statementsPct) === 100 && 
              parseFloat(branchesPct) === 100 && 
              parseFloat(functionsPct) === 100 && 
              parseFloat(linesPct) === 100;

if (is100) {
	console.log('\n✓ 100% Coverage Achieved!');
	process.exit(0);
} else {
	console.log('\n✗ Coverage is below 100%');
	process.exit(1);
}

