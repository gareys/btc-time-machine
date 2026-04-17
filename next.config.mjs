/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // wagmi/connectors barrel-imports optional peer connectors we don't use.
    // Alias them to `false` so the bundler tree-shakes them away cleanly.
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@base-org/account': false,
      '@metamask/connect-evm': false,
      '@safe-global/safe-apps-provider': false,
      '@safe-global/safe-apps-sdk': false,
      '@walletconnect/ethereum-provider': false,
      porto: false,
      'porto/internal': false,
      accounts: false,
      'cbw-sdk': false,
    };
    config.externals = [...(config.externals || []), 'pino-pretty', 'lokijs', 'encoding'];
    return config;
  },
};

export default nextConfig;
