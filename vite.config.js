import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";

// https://vitejs.dev/config/
export default ({ mode }) => {
  const environmentVariables = {
    ...process.env,
    ...loadEnv(mode, process.cwd()),
  };

  return defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        crypto: "crypto-browserify",
        assert: "assert",
        buffer: "buffer",
        http: "stream-http",
        https: "https-browserify",
        stream: "stream-browserify",
        zlib: "browserify-zlib",
        url: "url/",
        vm: "vm-browserify",
      },
    },
    define: {
      process: {
        env: {
          NODE_DEBUG: false,
          ...environmentVariables,
        },
      },
    },
  });
};
