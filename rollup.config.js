const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const typescript = require("@rollup/plugin-typescript");
const json = require("@rollup/plugin-json");

module.exports = {
  input: "src/index.ts",
  output: [
    {
      dir: "dist",
      format: "esm",
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: "src",
    },
    {
      file: "dist/index.cjs.js",
      format: "cjs",
    },
  ],
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: false,
      exportConditions: ["browser"],
    }),
    commonjs({
      requireReturnsDefault: "auto",
      path: false,
    }),
    typescript({ tsconfig: "./tsconfig.json" }),
    json(),
  ],
  external: ["react", "path", "fs"], // Add any React peer dependencies
};
