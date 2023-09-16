export default {
  build: {
    outDir: "dist",
  },
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
};
