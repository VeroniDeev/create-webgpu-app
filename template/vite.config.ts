import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    {
      name: "wgsl-loader",
      transform(code, id) {
        if (id.endsWith(".wgsl")) {
          return `export default ${JSON.stringify(code)}`;
        }
      },
    },
  ],
});
