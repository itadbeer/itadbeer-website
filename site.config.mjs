const configuredUrl = new URL(process.env.SITE_URL || 'https://itadbeer.com');
if (!['http:', 'https:'].includes(configuredUrl.protocol) || configuredUrl.username || configuredUrl.password || configuredUrl.pathname !== '/' || configuredUrl.search || configuredUrl.hash) {
  throw new Error('SITE_URL must be an HTTP(S) origin without credentials, path, query or fragment.');
}
export const siteUrl = configuredUrl.origin;
