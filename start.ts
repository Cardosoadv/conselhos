import { fileURLToPath } from 'url';
import path from 'path';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bePath = path.join(__dirname, './backend');
const fePath = path.join(__dirname, './frontend');

export const start = () => {
  try {
    startBackend();
    startFrontend();
  } catch (error) {
    console.error('❌ Error starting:', error);
  }
};

function startBackend() {
    const backend = spawn('npm', ['run', 'dev'], {
        cwd: bePath,
        stdio: 'inherit',
        shell: true,
    });

    backend.on('error', (error: Error) => {
        console.error(`❌ Failed to start backend: ${error.message}`);
    });

    backend.on('exit', (code: number | null) => {
        if (code !== 0) {
            console.error(`❌ Backend exited with code ${code}`);
        }
    });
}

function startFrontend() {
    const frontend = spawn('npm', ['run', 'dev'], {
        cwd: fePath,
        stdio: 'inherit',
        shell: true,
    });

    frontend.on('error', (error: Error) => {
        console.error(`❌ Failed to start frontend: ${error.message}`);
    });

    frontend.on('exit', (code: number | null) => {
        if (code !== 0) {
            console.error(`❌ Frontend exited with code ${code}`);
        }
    });
}

// Run standalone if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  start();
}
