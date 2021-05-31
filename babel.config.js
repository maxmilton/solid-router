// Config for Jest

/** @type {import('@babel/core').TransformOptions} */
module.exports = {
  presets: ['@babel/preset-typescript', 'babel-preset-solid'],
  plugins: ['@babel/plugin-transform-modules-commonjs'],
};
