module.exports = {
    // ... other configurations ...
    resolve: {
      fallback: {
        'fs': require.resolve('browserify-fs'),
        'https': require.resolve('https-browserify')
      }
    }
  };