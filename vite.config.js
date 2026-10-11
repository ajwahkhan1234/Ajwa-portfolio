import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const page = (name) => resolve(import.meta.dirname, `${name}.html`);

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: page('index'),
        projects: page('projects'),
        project: page('project'),
        about: page('about'),
        contact: page('contact'),
        seo: page('seo'),
        experience: page('experience'),
      },
    },
  },
});
