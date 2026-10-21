import { fileURLToPath } from 'node:url';

// Vinext forces process.exit(0) immediately after prerender fetches. Node 24 on
// Windows can abort while closing those handles (nodejs/node#56645). Allow a
// successful build to drain naturally; nonzero exits and exceptions still fail.
if (process.platform === 'win32') {
  const exit = process.exit.bind(process);
  process.exit = (code = 0) => {
    if (Number(code) !== 0) return exit(code);
    process.exitCode = 0;
  };
}
const cliUrl = new URL('./cli.js', import.meta.resolve('vinext'));
const cli = fileURLToPath(cliUrl);
process.argv = [process.execPath, cli, 'build'];
await import(cliUrl.href);
