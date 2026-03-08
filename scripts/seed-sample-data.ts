import { execSync } from 'node:child_process';

execSync('pnpm db:seed', {
  stdio: 'inherit',
});
