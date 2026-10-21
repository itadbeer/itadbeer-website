import { sites } from '@openai/sites-vite-plugin';
import vinext from 'vinext';
import { defineConfig } from 'vite';

// Static pages need no Worker emulator. Retain the Sites build integration.
export default defineConfig({ plugins: [vinext({ prerender: true }), sites()] });
