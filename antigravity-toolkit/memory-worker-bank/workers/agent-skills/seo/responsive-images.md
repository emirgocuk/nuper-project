# responsive-images
Source: https://antigravity.codes/agent-skills/seo/responsive-images

## AI Worker Instructions
When the user requests functionality related to responsive-images, follow these guidelines and utilize this context.

## Scraped Content

# responsive-images
```
<img  src="/images/hero-800.jpg"  srcset="    /images/hero-400.jpg 400w,    /images/hero-800.jpg 800w,    /images/hero-1200.jpg 1200w,    /images/hero-1600.jpg 1600w  "  sizes="(max-width: 640px) 100vw,         (max-width: 1024px) 90vw,         1200px"  alt="Hero image description"  width="1200"  height="675"  loading="lazy"/>
```
```
<img  src="/images/hero-800.jpg"  srcset="    /images/hero-400.jpg 400w,    /images/hero-800.jpg 800w,    /images/hero-1200.jpg 1200w,    /images/hero-1600.jpg 1600w  "  sizes="(max-width: 640px) 100vw,         (max-width: 1024px) 90vw,         1200px"  alt="Hero image description"  width="1200"  height="675"  loading="lazy"/>
```
```
<img  src="/images/hero-1200.jpg"  srcset="    /images/hero-800.jpg 800w,    /images/hero-1200.jpg 1200w,    /images/hero-1600.jpg 1600w  "  sizes="100vw"  alt="Hero image"  width="1600"  height="900"  loading="eager"  fetchpriority="high"/>
```
```
<img  src="/images/hero-1200.jpg"  srcset="    /images/hero-800.jpg 800w,    /images/hero-1200.jpg 1200w,    /images/hero-1600.jpg 1600w  "  sizes="100vw"  alt="Hero image"  width="1600"  height="900"  loading="eager"  fetchpriority="high"/>
```
```
100vw
```
```
(max-width: 768px) 100vw, 800px
```
```
(max-width: 768px) 100vw, 33vw
```
```
150px
```
```
eager
```
```
high
```
```
eager
```
```
lazy
```
```
lazy
```
```
<img  src="/images/banner-1200.jpg"  srcset="    /images/banner-600.jpg 600w,    /images/banner-1200.jpg 1200w,    /images/banner-1800.jpg 1800w,    /images/banner-2400.jpg 2400w  "  sizes="100vw"  alt="Full width banner"  width="2400"  height="800"  loading="lazy"  class="w-full h-auto"/>
```
```
<img  src="/images/banner-1200.jpg"  srcset="    /images/banner-600.jpg 600w,    /images/banner-1200.jpg 1200w,    /images/banner-1800.jpg 1800w,    /images/banner-2400.jpg 2400w  "  sizes="100vw"  alt="Full width banner"  width="2400"  height="800"  loading="lazy"  class="w-full h-auto"/>
```
```
<img  src="/images/card-600.jpg"  srcset="    /images/card-300.jpg 300w,    /images/card-600.jpg 600w,    /images/card-900.jpg 900w  "  sizes="(max-width: 768px) 100vw,         (max-width: 1024px) 50vw,         33vw"  alt="Card image"  width="900"  height="600"  loading="lazy"  class="w-full h-auto"/>
```
```
<img  src="/images/card-600.jpg"  srcset="    /images/card-300.jpg 300w,    /images/card-600.jpg 600w,    /images/card-900.jpg 900w  "  sizes="(max-width: 768px) 100vw,         (max-width: 1024px) 50vw,         33vw"  alt="Card image"  width="900"  height="600"  loading="lazy"  class="w-full h-auto"/>
```
```
<div class="aspect-[16/9] overflow-hidden">  <img    src="/images/video-thumbnail-800.jpg"    srcset="      /images/video-thumbnail-400.jpg 400w,      /images/video-thumbnail-800.jpg 800w,      /images/video-thumbnail-1200.jpg 1200w    "    sizes="(max-width: 768px) 100vw, 800px"    alt="Video thumbnail"    width="800"    height="450"    loading="lazy"    class="w-full h-full object-cover"  /></div>
```
```
<div class="aspect-[16/9] overflow-hidden">  <img    src="/images/video-thumbnail-800.jpg"    srcset="      /images/video-thumbnail-400.jpg 400w,      /images/video-thumbnail-800.jpg 800w,      /images/video-thumbnail-1200.jpg 1200w    "    sizes="(max-width: 768px) 100vw, 800px"    alt="Video thumbnail"    width="800"    height="450"    loading="lazy"    class="w-full h-full object-cover"  /></div>
```
```
<picture>  <source    srcset="      /images/hero-800.avif 800w,      /images/hero-1200.avif 1200w,      /images/hero-1600.avif 1600w    "    sizes="100vw"    type="image/avif"  />  <source    srcset="      /images/hero-800.webp 800w,      /images/hero-1200.webp 1200w,      /images/hero-1600.webp 1600w    "    sizes="100vw"    type="image/webp"  />  <img    src="/images/hero-1200.jpg"    srcset="      /images/hero-800.jpg 800w,      /images/hero-1200.jpg 1200w,      /images/hero-1600.jpg 1600w    "    sizes="100vw"    alt="Hero image"    width="1600"    height="900"    loading="eager"    fetchpriority="high"  /></picture>
```
```
<picture>  <source    srcset="      /images/hero-800.avif 800w,      /images/hero-1200.avif 1200w,      /images/hero-1600.avif 1600w    "    sizes="100vw"    type="image/avif"  />  <source    srcset="      /images/hero-800.webp 800w,      /images/hero-1200.webp 1200w,      /images/hero-1600.webp 1600w    "    sizes="100vw"    type="image/webp"  />  <img    src="/images/hero-1200.jpg"    srcset="      /images/hero-800.jpg 800w,      /images/hero-1200.jpg 1200w,      /images/hero-1600.jpg 1600w    "    sizes="100vw"    alt="Hero image"    width="1600"    height="900"    loading="eager"    fetchpriority="high"  /></picture>
```
```
<picture>  <source    media="(max-width: 640px)"    srcset="      /images/product-portrait-400.jpg 400w,      /images/product-portrait-800.jpg 800w    "    sizes="100vw"  />  <source    media="(min-width: 641px)"    srcset="      /images/product-landscape-800.jpg 800w,      /images/product-landscape-1200.jpg 1200w,      /images/product-landscape-1600.jpg 1600w    "    sizes="(max-width: 1024px) 90vw, 1200px"  />  <img    src="/images/product-landscape-1200.jpg"    alt="Product image"    width="1200"    height="675"    loading="lazy"  /></picture>
```
```
<picture>  <source    media="(max-width: 640px)"    srcset="      /images/product-portrait-400.jpg 400w,      /images/product-portrait-800.jpg 800w    "    sizes="100vw"  />  <source    media="(min-width: 641px)"    srcset="      /images/product-landscape-800.jpg 800w,      /images/product-landscape-1200.jpg 1200w,      /images/product-landscape-1600.jpg 1600w    "    sizes="(max-width: 1024px) 90vw, 1200px"  />  <img    src="/images/product-landscape-1200.jpg"    alt="Product image"    width="1200"    height="675"    loading="lazy"  /></picture>
```
```
<!-- ❌ WRONG - causes layout shift --><img src="/image.jpg" alt="Image" loading="lazy" /><!-- ✅ CORRECT - browser reserves space --><img  src="/image.jpg"  alt="Image"  width="800"  height="600"  loading="lazy"/>
```
```
<!-- ❌ WRONG - causes layout shift --><img src="/image.jpg" alt="Image" loading="lazy" /><!-- ✅ CORRECT - browser reserves space --><img  src="/image.jpg"  alt="Image"  width="800"  height="600"  loading="lazy"/>
```
```
<!-- ❌ WRONG - delays LCP --><img  src="/hero.jpg"  alt="Hero"  loading="lazy"/><!-- ✅ CORRECT - prioritizes LCP --><img  src="/hero.jpg"  alt="Hero"  loading="eager"  fetchpriority="high"/>
```
```
<!-- ❌ WRONG - delays LCP --><img  src="/hero.jpg"  alt="Hero"  loading="lazy"/><!-- ✅ CORRECT - prioritizes LCP --><img  src="/hero.jpg"  alt="Hero"  loading="eager"  fetchpriority="high"/>
```
```
<!-- ❌ WRONG - only considers DPR --><img  src="/image.jpg"  srcset="/image.jpg 1x, /image@2x.jpg 2x"  alt="Image"/><!-- ✅ CORRECT - considers viewport + DPR --><img  src="/image-800.jpg"  srcset="    /image-400.jpg 400w,    /image-800.jpg 800w,    /image-1200.jpg 1200w  "  sizes="(max-width: 768px) 100vw, 800px"  alt="Image"  width="800"  height="600"/>
```
```
<!-- ❌ WRONG - only considers DPR --><img  src="/image.jpg"  srcset="/image.jpg 1x, /image@2x.jpg 2x"  alt="Image"/><!-- ✅ CORRECT - considers viewport + DPR --><img  src="/image-800.jpg"  srcset="    /image-400.jpg 400w,    /image-800.jpg 800w,    /image-1200.jpg 1200w  "  sizes="(max-width: 768px) 100vw, 800px"  alt="Image"  width="800"  height="600"/>
```
```
<!-- ❌ WRONG --><img src="/product.jpg" /><!-- ✅ CORRECT - descriptive alt text --><img src="/product.jpg" alt="Red leather messenger bag with brass buckles" /><!-- ✅ CORRECT - decorative images use empty alt --><img src="/decorative-line.svg" alt="" role="presentation" />
```
```
<!-- ❌ WRONG --><img src="/product.jpg" /><!-- ✅ CORRECT - descriptive alt text --><img src="/product.jpg" alt="Red leather messenger bag with brass buckles" /><!-- ✅ CORRECT - decorative images use empty alt --><img src="/decorative-line.svg" alt="" role="presentation" />
```
```
<!-- ❌ WRONG - image distorts --><div class="w-full h-64">  <img src="/image.jpg" alt="Image" class="w-full h-full" /></div><!-- ✅ CORRECT - maintains aspect ratio --><div class="w-full h-64">  <img    src="/image.jpg"    alt="Image"    class="w-full h-full object-cover"  /></div>
```
```
<!-- ❌ WRONG - image distorts --><div class="w-full h-64">  <img src="/image.jpg" alt="Image" class="w-full h-full" /></div><!-- ✅ CORRECT - maintains aspect ratio --><div class="w-full h-64">  <img    src="/image.jpg"    alt="Image"    class="w-full h-full object-cover"  /></div>
```
```
<!-- Full width -->sizes="100vw"<!-- Content width (max 800px) -->sizes="(max-width: 768px) 100vw, 800px"<!-- Sidebar (fixed 300px) -->sizes="300px"<!-- 2-column grid -->sizes="(max-width: 768px) 100vw, 50vw"<!-- 3-column grid -->sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"<!-- Responsive with max-width -->sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
```
```
<!-- Full width -->sizes="100vw"<!-- Content width (max 800px) -->sizes="(max-width: 768px) 100vw, 800px"<!-- Sidebar (fixed 300px) -->sizes="300px"<!-- 2-column grid -->sizes="(max-width: 768px) 100vw, 50vw"<!-- 3-column grid -->sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"<!-- Responsive with max-width -->sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
```
```
aspect-[16/9]
```
```
aspect-[4/3]
```
```
aspect-[3/2]
```
```
aspect-square
```
```
aspect-[21/9]
```
```
cover
```
```
contain
```
```
fill
```
```
scale-down
```
```
contain
```
```
<picture>
```
```
<img src="/image.jpg">
```
```
<img srcset="... 400w, ... 800w, ... 1200w" sizes="...">
```
```
<!-- ❌ WRONG - wastes bandwidth, no retina support --><img src="/image-1200.jpg" alt="Image" /><!-- ✅ CORRECT - responsive sizes --><img  src="/image-800.jpg"  srcset="    /image-400.jpg 400w,    /image-800.jpg 800w,    /image-1200.jpg 1200w  "  sizes="(max-width: 768px) 100vw, 800px"  alt="Image"  width="800"  height="600"  loading="lazy"/>
```
```
<!-- ❌ WRONG - wastes bandwidth, no retina support --><img src="/image-1200.jpg" alt="Image" /><!-- ✅ CORRECT - responsive sizes --><img  src="/image-800.jpg"  srcset="    /image-400.jpg 400w,    /image-800.jpg 800w,    /image-1200.jpg 1200w  "  sizes="(max-width: 768px) 100vw, 800px"  alt="Image"  width="800"  height="600"  loading="lazy"/>
```
```
<img src="...">
```
```
<img src="..." loading="lazy">
```
```
loading="lazy"
```
```
loading="eager" fetchpriority="high"
```
```
<!-- ❌ WRONG - loads all images immediately --><img src="/content-image.jpg" alt="Content" /><!-- ✅ CORRECT - defers below-fold images --><img src="/content-image.jpg" alt="Content" loading="lazy" /><!-- ✅ CORRECT - prioritizes LCP image --><img  src="/hero.jpg"  alt="Hero"  loading="eager"  fetchpriority="high"/>
```
```
<!-- ❌ WRONG - loads all images immediately --><img src="/content-image.jpg" alt="Content" /><!-- ✅ CORRECT - defers below-fold images --><img src="/content-image.jpg" alt="Content" loading="lazy" /><!-- ✅ CORRECT - prioritizes LCP image --><img  src="/hero.jpg"  alt="Hero"  loading="eager"  fetchpriority="high"/>
```
```
<img src="...">
```
```
<img src="..." alt="Descriptive text">
```
```
alt="image"
```
```
alt="" role="presentation"
```
```
<!-- ❌ WRONG --><img src="/product.jpg" /><img src="/product.jpg" alt="image" /><!-- ✅ CORRECT - descriptive alt --><img src="/product.jpg" alt="Red leather messenger bag with brass buckles" /><!-- ✅ CORRECT - decorative images --><img src="/decorative-line.svg" alt="" role="presentation" />
```
```
<!-- ❌ WRONG --><img src="/product.jpg" /><img src="/product.jpg" alt="image" /><!-- ✅ CORRECT - descriptive alt --><img src="/product.jpg" alt="Red leather messenger bag with brass buckles" /><!-- ✅ CORRECT - decorative images --><img src="/decorative-line.svg" alt="" role="presentation" />
```
```
<img src="...">
```
```
<img src="..." width="..." height="...">
```
```
<div class="aspect-[16/9]">
```
```
<!-- ❌ WRONG - causes layout shift --><img src="/image.jpg" alt="Image" loading="lazy" /><!-- ✅ CORRECT - explicit dimensions --><img  src="/image.jpg"  alt="Image"  width="800"  height="600"  loading="lazy"/><!-- ✅ CORRECT - aspect-ratio container --><div class="aspect-[16/9]">  <img    src="/image.jpg"    alt="Image"    width="800"    height="450"    loading="lazy"    class="w-full h-full object-cover"  /></div>
```
```
<!-- ❌ WRONG - causes layout shift --><img src="/image.jpg" alt="Image" loading="lazy" /><!-- ✅ CORRECT - explicit dimensions --><img  src="/image.jpg"  alt="Image"  width="800"  height="600"  loading="lazy"/><!-- ✅ CORRECT - aspect-ratio container --><div class="aspect-[16/9]">  <img    src="/image.jpg"    alt="Image"    width="800"    height="450"    loading="lazy"    class="w-full h-full object-cover"  /></div>
```
```
loading="lazy"
```
```
loading="eager" fetchpriority="high"
```
```
<!-- ❌ WRONG - delays LCP --><img  src="/hero.jpg"  alt="Hero"  loading="lazy"/><!-- ✅ CORRECT - prioritizes LCP --><img  src="/hero.jpg"  alt="Hero"  loading="eager"  fetchpriority="high"/>
```
```
<!-- ❌ WRONG - delays LCP --><img  src="/hero.jpg"  alt="Hero"  loading="lazy"/><!-- ✅ CORRECT - prioritizes LCP --><img  src="/hero.jpg"  alt="Hero"  loading="eager"  fetchpriority="high"/>
```
```
loading="eager"
```
```
fetchpriority="high"
```
```
<!-- ❌ WRONG - no priority boost --><img  src="/hero.jpg"  alt="Hero"  loading="eager"/><!-- ✅ CORRECT - prioritizes download --><img  src="/hero.jpg"  alt="Hero"  loading="eager"  fetchpriority="high"/>
```
```
<!-- ❌ WRONG - no priority boost --><img  src="/hero.jpg"  alt="Hero"  loading="eager"/><!-- ✅ CORRECT - prioritizes download --><img  src="/hero.jpg"  alt="Hero"  loading="eager"  fetchpriority="high"/>
```
```
srcset="... 1x, ... 2x"
```
```
srcset="... 400w, ... 800w" sizes="..."
```
```
<!-- ❌ WRONG - only considers DPR, not viewport --><img  src="/image.jpg"  srcset="/image.jpg 1x, /image@2x.jpg 2x"  alt="Image"/><!-- ✅ CORRECT - considers viewport + DPR --><img  src="/image-800.jpg"  srcset="    /image-400.jpg 400w,    /image-800.jpg 800w,    /image-1200.jpg 1200w  "  sizes="(max-width: 768px) 100vw, 800px"  alt="Image"  width="800"  height="600"/>
```
```
<!-- ❌ WRONG - only considers DPR, not viewport --><img  src="/image.jpg"  srcset="/image.jpg 1x, /image@2x.jpg 2x"  alt="Image"/><!-- ✅ CORRECT - considers viewport + DPR --><img  src="/image-800.jpg"  srcset="    /image-400.jpg 400w,    /image-800.jpg 800w,    /image-1200.jpg 1200w  "  sizes="(max-width: 768px) 100vw, 800px"  alt="Image"  width="800"  height="600"/>
```
```
<!-- ✅ CORRECT - fixed logo size --><img  src="/logo.png"  srcset="/logo.png 1x, /logo@2x.png 2x"  alt="Logo"  width="150"  height="50"/>
```
```
<!-- ✅ CORRECT - fixed logo size --><img  src="/logo.png"  srcset="/logo.png 1x, /logo@2x.png 2x"  alt="Logo"  width="150"  height="50"/>
```
```
100vw
```
```
srcset="... 400w, ... 800w"
```
```
sizes="..."
```
```
<!-- ❌ WRONG - browser assumes 100vw --><img  src="/image-800.jpg"  srcset="/image-400.jpg 400w, /image-800.jpg 800w"  alt="Image"/><!-- ✅ CORRECT - specifies display size --><img  src="/image-800.jpg"  srcset="/image-400.jpg 400w, /image-800.jpg 800w"  sizes="(max-width: 768px) 100vw, 800px"  alt="Image"  width="800"  height="600"/>
```
```
<!-- ❌ WRONG - browser assumes 100vw --><img  src="/image-800.jpg"  srcset="/image-400.jpg 400w, /image-800.jpg 800w"  alt="Image"/><!-- ✅ CORRECT - specifies display size --><img  src="/image-800.jpg"  srcset="/image-400.jpg 400w, /image-800.jpg 800w"  sizes="(max-width: 768px) 100vw, 800px"  alt="Image"  width="800"  height="600"/>
```
```
<img src="/image.jpg">
```
```
<picture>
```
```
<!-- ❌ WRONG - missing modern formats --><img src="/image.jpg" alt="Image" /><!-- ✅ CORRECT - AVIF → WebP → JPEG fallback --><picture>  <source    srcset="      /image-400.avif 400w,      /image-800.avif 800w,      /image-1200.avif 1200w    "    sizes="(max-width: 768px) 100vw, 800px"    type="image/avif"  />  <source    srcset="      /image-400.webp 400w,      /image-800.webp 800w,      /image-1200.webp 1200w    "    sizes="(max-width: 768px) 100vw, 800px"    type="image/webp"  />  <img    src="/image-800.jpg"    srcset="      /image-400.jpg 400w,      /image-800.jpg 800w,      /image-1200.jpg 1200w    "    sizes="(max-width: 768px) 100vw, 800px"    alt="Image"    width="800"    height="600"    loading="lazy"  /></picture>
```
```
<!-- ❌ WRONG - missing modern formats --><img src="/image.jpg" alt="Image" /><!-- ✅ CORRECT - AVIF → WebP → JPEG fallback --><picture>  <source    srcset="      /image-400.avif 400w,      /image-800.avif 800w,      /image-1200.avif 1200w    "    sizes="(max-width: 768px) 100vw, 800px"    type="image/avif"  />  <source    srcset="      /image-400.webp 400w,      /image-800.webp 800w,      /image-1200.webp 1200w    "    sizes="(max-width: 768px) 100vw, 800px"    type="image/webp"  />  <img    src="/image-800.jpg"    srcset="      /image-400.jpg 400w,      /image-800.jpg 800w,      /image-1200.jpg 1200w    "    sizes="(max-width: 768px) 100vw, 800px"    alt="Image"    width="800"    height="600"    loading="lazy"  /></picture>
```
```
object-cover
```
```
object-contain
```
```
<!-- ❌ WRONG - image distorts --><div class="w-full h-64">  <img src="/image.jpg" alt="Image" class="w-full h-full" /></div><!-- ✅ CORRECT - maintains aspect ratio, crops edges --><div class="w-full h-64">  <img    src="/image.jpg"    alt="Image"    class="w-full h-full object-cover"  /></div><!-- ✅ CORRECT - maintains aspect ratio, shows all content --><div class="w-full h-64">  <img    src="/logo.svg"    alt="Logo"    class="w-full h-full object-contain"  /></div>
```
```
<!-- ❌ WRONG - image distorts --><div class="w-full h-64">  <img src="/image.jpg" alt="Image" class="w-full h-full" /></div><!-- ✅ CORRECT - maintains aspect ratio, crops edges --><div class="w-full h-64">  <img    src="/image.jpg"    alt="Image"    class="w-full h-full object-cover"  /></div><!-- ✅ CORRECT - maintains aspect ratio, shows all content --><div class="w-full h-64">  <img    src="/logo.svg"    alt="Logo"    class="w-full h-full object-contain"  /></div>
```
```
type="image/..."
```
```
<!-- ❌ WRONG - JPEG before WebP --><picture>  <source srcset="/image.jpg" type="image/jpeg" />  <source srcset="/image.webp" type="image/webp" />  <img src="/image.jpg" alt="Image" /></picture><!-- ✅ CORRECT - best to worst --><picture>  <source srcset="/image.avif" type="image/avif" />  <source srcset="/image.webp" type="image/webp" />  <img src="/image.jpg" alt="Image" width="800" height="600" /></picture>
```
```
<!-- ❌ WRONG - JPEG before WebP --><picture>  <source srcset="/image.jpg" type="image/jpeg" />  <source srcset="/image.webp" type="image/webp" />  <img src="/image.jpg" alt="Image" /></picture><!-- ✅ CORRECT - best to worst --><picture>  <source srcset="/image.avif" type="image/avif" />  <source srcset="/image.webp" type="image/webp" />  <img src="/image.jpg" alt="Image" width="800" height="600" /></picture>
```
```
<picture>
```
```
<!-- ❌ WRONG - portrait crop stretched wide on desktop --><img  src="/portrait.jpg"  srcset="/portrait-400.jpg 400w, /portrait-800.jpg 800w"  sizes="100vw"  alt="Image"/><!-- ✅ CORRECT - portrait on mobile, landscape on desktop --><picture>  <source    media="(max-width: 640px)"    srcset="/image-portrait-400.jpg 400w, /image-portrait-800.jpg 800w"    sizes="100vw"  />  <img    src="/image-landscape-1200.jpg"    srcset="/image-landscape-800.jpg 800w, /image-landscape-1200.jpg 1200w"    sizes="(max-width: 1024px) 90vw, 1200px"    alt="Image"    width="1200"    height="675"    loading="lazy"  /></picture>
```
```
<!-- ❌ WRONG - portrait crop stretched wide on desktop --><img  src="/portrait.jpg"  srcset="/portrait-400.jpg 400w, /portrait-800.jpg 800w"  sizes="100vw"  alt="Image"/><!-- ✅ CORRECT - portrait on mobile, landscape on desktop --><picture>  <source    media="(max-width: 640px)"    srcset="/image-portrait-400.jpg 400w, /image-portrait-800.jpg 800w"    sizes="100vw"  />  <img    src="/image-landscape-1200.jpg"    srcset="/image-landscape-800.jpg 800w, /image-landscape-1200.jpg 1200w"    sizes="(max-width: 1024px) 90vw, 1200px"    alt="Image"    width="1200"    height="675"    loading="lazy"  /></picture>
```
```
**/*.html
```
```
**/*.tsx
```
```
**/*.jsx
```
```
**/*.vue
```
```
**/*.svelte
```
```
<img>
```
```
<picture>
```
```
# Check for missing width/heightgrep -r '<img' --include="*.html" --include="*.tsx" | grep -v 'width=' | grep -v 'height='# Check for missing altgrep -r '<img' --include="*.html" --include="*.tsx" | grep -v 'alt='# Check for missing loading attributegrep -r '<img' --include="*.html" --include="*.tsx" | grep -v 'loading='# Run Lighthouse auditnpx lighthouse https://example.com --only-categories=performance --view
```
```
# Check for missing width/heightgrep -r '<img' --include="*.html" --include="*.tsx" | grep -v 'width=' | grep -v 'height='# Check for missing altgrep -r '<img' --include="*.html" --include="*.tsx" | grep -v 'alt='# Check for missing loading attributegrep -r '<img' --include="*.html" --include="*.tsx" | grep -v 'loading='# Run Lighthouse auditnpx lighthouse https://example.com --only-categories=performance --view
```
This agent skill provides robust guidance for implementing responsive images, a critical component for modern web performance. By leveraging `srcset` and `sizes` attributes, developers can ensure images are delivered efficiently across all devices, from mobile phones to high-resolution desktops. It goes beyond basic image tags to embrace best practices like lazy loading and priority fetching, directly contributing to faster page loads and improved user experience. Whether you're building a new site or optimizing an existing one, this skill helps streamline the process of making your visuals performant.

# When to Use This Skill
- •Implementing adaptive hero images for optimal Largest Contentful Paint (LCP) performance.
- •Optimizing images within content areas like blog posts, articles, or product descriptions.
- •Creating efficient image galleries or grid layouts that adapt to various screen sizes.
- •Ensuring images load quickly and responsively across diverse screen resolutions and network conditions.

# Pro Tips
- 💡Always specify `width` and `height` attributes on `<img>` tags to prevent layout shifts (CLS) and improve LCP, even when using `srcset` and `sizes`.
- 💡Utilize `loading='lazy'` for images below the fold to defer their loading, but use `loading='eager'` and `fetchpriority='high'` for critical above-the-fold images like hero banners to prioritize their fetch.
- 💡Automate the generation of multiple image sizes (e.g., 400w, 800w, 1200w) during your build process or with dedicated image optimization services to easily populate `srcset`.

