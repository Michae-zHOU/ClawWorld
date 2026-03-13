import type { NextConfig } from 'next';
import path from 'path';

const config: NextConfig = {
  transpilePackages: ['three'],
  outputFileTracingRoot: path.join(import.meta.dirname, '..'),
};

export default config;
