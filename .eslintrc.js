module.exports = {
  extends: 'google',
  parserOptions : {
    ecmaVersion: 8,
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true
    }
  },
  rules: {
    'max-len': ['error', {
      code: 120,
    }],
  },
};
