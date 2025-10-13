import { defineConfig } from 'open-next/config';
import cloudflare from '@opennextjs/cloudflare';

export default defineConfig({
  default: {
    adapter: cloudflare(),
  },
});
