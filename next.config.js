/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */

const withNextIntl = require("next-intl/plugin")(
  // This is the default (also the `src` folder is supported out of the box)
  "./src/utils/i18n.ts",
);

const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  env: {
    API_URL: process.env.API_URL,
    AUTH_API_URL: process.env.AUTH_API_URL,
    COMPANY_API_URL: process.env.COMPANY_API_URL,
    UPLOAD_API_URL: process.env.UPLOAD_API_URL,
    TIME_SHEET_API_URL: process.env.TIME_SHEET_API_URL,
    CHAT_API_URL: process.env.CHAT_API_URL,
    SALE_API_URL: process.env.SALE_API_URL,
    BUDGET_API_URL: process.env.BUDGET_API_URL,
    PAY_API_URL: process.env.PAY_API_URL,
    NEXT_APP_WS_URL: process.env.NEXT_APP_WS_URL,
    RESOURCE_API_URL: process.env.RESOURCE_API_URL,
    MEETING_API_URL: process.env.MEETING_API_URL,
    NEXT_APP_MEETING_WS_URL: process.env.NEXT_APP_MEETING_WS_URL,
    FEEDBACK_API_URL: process.env.FEEDBACK_API_URL,
    BLOG_API_URL: process.env.BLOG_API_URL,
    CAREER_API_URL: process.env.CAREER_API_URL,
    DOCS_API_URL: process.env.DOCS_API_URL,
    BILLING_API_URL: process.env.BILLING_API_URL,
    CONTENT_API_URL: process.env.CONTENT_API_URL,
    AI_CHAT_API_URL: process.env.AI_CHAT_API_URL,
    AI_AGENT_API_URL: process.env.AI_AGENT_API_URL,
    INVOICE_API_URL: process.env.INVOICE_API_URL,
    AI_DOCS_API_URL: process.env.AI_DOCS_API_URL,
    TICKET_API_URL: process.env.TICKET_API_URL,
    NEXT_APP_WS_URL_TICKET: process.env.NEXT_APP_WS_URL_TICKET,
    NEXT_PUBLIC_NOTIFY_API_URL: process.env.NEXT_PUBLIC_NOTIFY_API_URL,
    DASHBOARD_API_URL: process.env.DASHBOARD_API_URL,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  images: {
    // dangerouslyAllowSVG: true,
    domains: ['app.taskcover.com'],
    remotePatterns: [
      {
          protocol: 'https',
          hostname: 'app.taskcover.com',
          port: '',
          pathname: '/api/getFile/**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg"),
    );

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: /url/ }, // exclude if *.svg?url
        use: ["@svgr/webpack"],
      },
    );

    fileLoaderRule.exclude = /\.svg$/i;

    config.optimization.minimize = true;
    config.optimization.splitChunks = {
      chunks: (chunk) => {
        return chunk && chunk.name && !chunk.name.includes("icon.svg");
      },
      minSize: 20000,
      maxSize: 50000,
    };

    return config;
  },
  /**
   * if you need proxy, then try this
   */
  // async rewrites() {
  //   return process.env.NODE_ENV === 'development'
  //     ? [
  //         {
  //           source: '/api/:path*',
  //           destination: `${process.env.CHAT_API_URL}/:path*`,
  //         },
  //       ]
  //     : [];
  // },
};

module.exports = withNextIntl(nextConfig);
