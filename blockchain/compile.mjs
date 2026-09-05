import solc from 'solc';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export function compile(extraSources = {}) {
  const input = {
    language: 'Solidity',
    sources: { 'FractionalProperty.sol': { content: readFileSync(resolve(projectRoot, 'contracts/FractionalProperty.sol'), 'utf8') }, ...extraSources },
    settings: { optimizer: { enabled: true, runs: 200 }, evmVersion: 'shanghai', outputSelection: { '*': { '*': ['abi', 'evm.bytecode.object'] } } },
  };
  const output = JSON.parse(solc.compile(JSON.stringify(input), { import: path => {
    if (!path.startsWith('@openzeppelin/contracts/')) return { error: 'Unsupported import' };
    try { return { contents: readFileSync(resolve(projectRoot, 'node_modules', path), 'utf8') }; }
    catch { return { error: `Missing import: ${path}` }; }
  } }));
  const errors = (output.errors || []).filter(e => e.severity === 'error');
  if (errors.length) throw new Error(errors.map(e => e.formattedMessage).join('\n'));
  return output.contracts;
}

export function buildArtifact() {
  const result = compile()['FractionalProperty.sol'].FractionalProperty;
  const artifact = { abi: result.abi, bytecode: '0x' + result.evm.bytecode.object };
  mkdirSync(resolve(projectRoot, 'blockchain/artifacts'), { recursive: true });
  writeFileSync(resolve(projectRoot, 'blockchain/artifacts/FractionalProperty.json'), JSON.stringify(artifact, null, 2));
  return artifact;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  buildArtifact();
  console.log('Compiled FractionalProperty with Solidity ' + solc.version());
}
