# Optimize Images for Web
Source: https://antigravity.codes/workflows/performance-optimization/optimize-images-nextjs-image-component-webp

## AI Worker Instructions
When the user requests functionality related to Optimize Images for Web, follow these guidelines and utilize this context.

## Scraped Content

# Optimize Images for Web
```
import Image from 'next/image';      <Image     src="/hero.jpg"     alt="Hero"     width={1200}     height={600}     priority // for above-the-fold images     placeholder="blur" // optional: shows blur while loading   />
```
```
import Image from 'next/image';      <Image     src="/hero.jpg"     alt="Hero"     width={1200}     height={600}     priority // for above-the-fold images     placeholder="blur" // optional: shows blur while loading   />
```
```
domains
```
```
remotePatterns
```
```
module.exports = {     images: {       remotePatterns: [         {           protocol: 'https',           hostname: 'cdn.example.com',           pathname: '/images/**',         },       ],       formats: ['image/webp', 'image/avif'],     },   };
```
```
module.exports = {     images: {       remotePatterns: [         {           protocol: 'https',           hostname: 'cdn.example.com',           pathname: '/images/**',         },       ],       formats: ['image/webp', 'image/avif'],     },   };
```
```
fill
```
```
object-fit
```
```
sizes
```
```
sizes="(max-width: 768px) 100vw, 50vw"
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as optimize-images-nextjs-image-component-webp.md
```
optimize-images-nextjs-image-component-webp.md
```
- In Antigravity, type /optimize_images_nextjs_image_component_webp or just describe what you want to do
```
/optimize_images_nextjs_image_component_webp
```
Learn more about workflows →

# Related Workflows

# Implement Request Deduplication

# Setup Incremental Static Regeneration

# Reduce Bundle Size

