import { setupDevPlatform } from '@opennextjs/cloudflare/next-dev';

// Here we use the OpenNext Cloudflare adapter next-dev module to allow us to
// use bindings during local development (when running the application with
// `next dev`). This function is only necessary during development and
// has no impact outside of that. For more information see:
// https://opennext.js.org/cloudflare/get-started#local-development
setupDevPlatform().catch(console.error);

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
