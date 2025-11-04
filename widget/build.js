/**
 * Build script for VoiceUX widget
 * Bundles all source files into a single JS file
 */

const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

// Ensure dist directory exists
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// Read CSS file
const cssPath = path.join(__dirname, 'src', 'ui', 'styles.css');
const cssContent = fs.readFileSync(cssPath, 'utf8');

// Plugin to handle CSS imports
const cssPlugin = {
  name: 'css',
  setup(build) {
    build.onResolve({ filter: /\.css$/ }, args => ({
      path: path.resolve(args.resolveDir, args.path),
      namespace: 'css'
    }));

    build.onLoad({ filter: /.*/, namespace: 'css' }, async (args) => {
      const css = await fs.promises.readFile(args.path, 'utf8');
      return {
        contents: `export default ${JSON.stringify(css)}`,
        loader: 'js'
      };
    });
  }
};

// Build configuration
const buildConfig = {
  entryPoints: ['src/index.js'],
  bundle: true,
  outfile: 'dist/voiceUX.js',
  format: 'iife',
  platform: 'browser',
  target: 'es2017',
  plugins: [cssPlugin],
  banner: {
    js: '/* VoiceUX Widget v1.0.0 | MIT License */'
  }
};

// Development build (with source maps)
async function buildDev() {
  try {
    await esbuild.build({
      ...buildConfig,
      sourcemap: true,
      minify: false
    });
    console.log('✅ Development build complete: dist/voiceUX.js');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

// Production build (minified)
async function buildProd() {
  try {
    await esbuild.build({
      ...buildConfig,
      minify: true,
      sourcemap: false
    });

    // Get file size
    const stats = fs.statSync(path.join(distDir, 'voiceUX.js'));
    const fileSizeKB = (stats.size / 1024).toFixed(2);

    console.log('✅ Production build complete: dist/voiceUX.js');
    console.log(`📦 File size: ${fileSizeKB} KB`);
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

// Watch mode
async function watch() {
  try {
    const ctx = await esbuild.context({
      ...buildConfig,
      sourcemap: true,
      minify: false
    });

    await ctx.watch();
    console.log('👀 Watching for changes...');
  } catch (error) {
    console.error('❌ Watch failed:', error);
    process.exit(1);
  }
}

// Run based on command line argument
const mode = process.argv[2] || 'dev';

switch (mode) {
  case 'prod':
  case 'production':
    buildProd();
    break;
  case 'watch':
    watch();
    break;
  default:
    buildDev();
    break;
}
