// If I ever need to do change to config and add something new, just add it on top, like I added exerimental
/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: "15mb"
        }
    },
    webpack: (config) => {
        // Grab the existing rule that handles SVG imports
        const fileLoaderRule = config.module.rules.find((rule) =>
            rule.test?.test?.('.svg'),
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
                issuer: fileLoaderRule.issuer,
                resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
                use: ['@svgr/webpack'],
            },
        );

        // Modify the file loader rule to ignore *.svg, since we have it handled now.
        fileLoaderRule.exclude = /\.svg$/i;

        return config;
    }
    
}
const withNextIntl = require("next-intl/plugin")(
    './src/i18n.ts'
);



module.exports = withNextIntl(nextConfig)
