# Ultimate Next.js SEO Setup
Source: https://antigravity.codes/workflows/production/setup-nextjs-seo-sitemap-robots-jsonld

## AI Worker Instructions
When the user requests functionality related to Ultimate Next.js SEO Setup, follow these guidelines and utilize this context.

## Scraped Content

# Ultimate Next.js SEO Setup
```
src/app/layout.tsx
```
```
metadataBase
```
```
export const metadata: Metadata = {     metadataBase: new URL('https://acme.com'),     title: 'Acme Corp',     // ...   };
```
```
export const metadata: Metadata = {     metadataBase: new URL('https://acme.com'),     title: 'Acme Corp',     // ...   };
```
```
sitemap.ts
```
```
src/app/sitemap.ts
```
```
import { MetadataRoute } from 'next';   export default function sitemap(): MetadataRoute.Sitemap {     return [       {         url: 'https://acme.com',         lastModified: new Date(),         changeFrequency: 'yearly',         priority: 1,       },       // Add dynamic routes here     ];   }
```
```
import { MetadataRoute } from 'next';   export default function sitemap(): MetadataRoute.Sitemap {     return [       {         url: 'https://acme.com',         lastModified: new Date(),         changeFrequency: 'yearly',         priority: 1,       },       // Add dynamic routes here     ];   }
```
```
robots.ts
```
```
src/app/robots.ts
```
```
import { MetadataRoute } from 'next';   export default function robots(): MetadataRoute.Robots {     return {       rules: {         userAgent: '*',         allow: '/',         disallow: '/private/',       },       sitemap: 'https://acme.com/sitemap.xml',     };   }
```
```
import { MetadataRoute } from 'next';   export default function robots(): MetadataRoute.Robots {     return {       rules: {         userAgent: '*',         allow: '/',         disallow: '/private/',       },       sitemap: 'https://acme.com/sitemap.xml',     };   }
```
```
layout.tsx
```
```
<script     type="application/ld+json"     dangerouslySetInnerHTML={{       __html: JSON.stringify({         '@context': 'https://schema.org',         '@type': 'Organization',         name: 'Acme Corp',         url: 'https://acme.com',         logo: 'https://acme.com/logo.png',       }),     }}   />
```
```
<script     type="application/ld+json"     dangerouslySetInnerHTML={{       __html: JSON.stringify({         '@context': 'https://schema.org',         '@type': 'Organization',         name: 'Acme Corp',         url: 'https://acme.com',         logo: 'https://acme.com/logo.png',       }),     }}   />
```
```
opengraph-image.tsx
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as setup-nextjs-seo-sitemap-robots-jsonld.md
```
setup-nextjs-seo-sitemap-robots-jsonld.md
```
- In Antigravity, type /setup_nextjs_seo_sitemap_robots_jsonld or just describe what you want to do
```
/setup_nextjs_seo_sitemap_robots_jsonld
```
Learn more about workflows →

# Related Workflows

# Core Web Vitals Optimizer

# Security Hardening Checklist

# Implement Rate Limiting

