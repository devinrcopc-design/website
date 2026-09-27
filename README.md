# DevinRC Website

A lightweight, responsive single-page website built as a standalone `index.html`.

## Launch checklist

1. Replace `your-domain.com` with the real domain in the canonical, Open Graph, and robots metadata.
2. Create a **public** Cloudflare R2 custom domain or public bucket URL and replace `https://your-public-r2-domain.com/hero.webp`.
3. Upload a compressed WebP/AVIF hero image to R2. Do not put R2 API tokens, Access Keys, or Secret Access Keys in this repository.
4. Add Google Analytics / Google Ads and Meta Pixel IDs only when ready.
5. Add the real contact email and business copy.
6. Create a sitemap using the final domain and submit it in Google Search Console.

## Security

R2 credentials must remain server-side / in a secrets manager. This static page needs only the public URL of an image; it never needs R2 credentials.
