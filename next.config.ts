if (process.env.NODE_ENV === "development") {
  import("@opennextjs/cloudflare/next-dev")
    .then(({ setupDevPlatform }) => setupDevPlatform())
    .catch((error) => {
      console.warn(
        "Failed to initialize the OpenNext Cloudflare dev platform bindings.",
        error,
      );
    });
}

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
