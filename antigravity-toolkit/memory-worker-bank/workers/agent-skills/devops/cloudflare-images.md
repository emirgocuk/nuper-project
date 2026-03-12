# cloudflare-images
Source: https://antigravity.codes/agent-skills/devops/cloudflare-images

## AI Worker Instructions
When the user requests functionality related to cloudflare-images, follow these guidelines and utilize this context.

## Scraped Content

# cloudflare-images
```
gravity=face
```
```
zoom
```
```
<img loading="lazy">
```
```
curl -X POST https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/images/v1 \  -H 'Authorization: Bearer <API_TOKEN>' \  -H 'Content-Type: multipart/form-data' \  -F 'file=@./image.jpg'
```
```
curl -X POST https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/images/v1 \  -H 'Authorization: Bearer <API_TOKEN>' \  -H 'Content-Type: multipart/form-data' \  -F 'file=@./image.jpg'
```
```
https://imagedelivery.net/<ACCOUNT_HASH>/<IMAGE_ID>/public
```
```
<img src="/cdn-cgi/image/width=800,quality=85/uploads/photo.jpg" />
```
```
<img src="/cdn-cgi/image/width=800,quality=85/uploads/photo.jpg" />
```
```
/images/v1
```
```
file
```
```
id
```
```
requireSignedURLs
```
```
metadata
```
```
url=https://example.com/image.jpg
```
```
/images/v2/direct_upload
```
```
uploadURL
```
```
uploadURL
```
```
multipart/form-data
```
```
file
```
```
image
```
```
/direct_upload
```
```
Content-Type: application/json
```
```
/direct_upload
```
```
/cdn-cgi/image/<OPTIONS>/<SOURCE>
```
```
width=800,height=600,fit=cover
```
```
quality=85
```
```
format=auto
```
```
gravity=auto
```
```
gravity=face
```
```
gravity=center
```
```
zoom=0.5
```
```
blur=10,sharpen=3,brightness=1.2
```
```
scale-down
```
```
contain
```
```
cover
```
```
crop
```
```
pad
```
```
cf.image
```
```
fetch(imageURL, {  cf: {    image: { width: 800, quality: 85, format: 'auto', gravity: 'face', zoom: 0.8 }  }});
```
```
fetch(imageURL, {  cf: {    image: { width: 800, quality: 85, format: 'auto', gravity: 'face', zoom: 0.8 }  }});
```
```
avatar
```
```
thumbnail
```
```
/images/v1/variants
```
```
id
```
```
options
```
```
imagedelivery.net/<HASH>/<ID>/avatar
```
```
w=400,sharpen=3
```
```
/images/v1/config
```
```
{"flexible_variants": true}
```
```
?exp=<TIMESTAMP>&sig=<HMAC>
```
```
HMAC-SHA256(signingKey, imageId + variant + expiry)
```
```
templates/signed-urls-generation.ts
```
```
multipart/form-data
```
```
file
```
```
image
```
```
/direct_upload
```
```
/cdn-cgi/image/
```
```
Cf-Resized
```
```
format=auto
```
```
fit=scale-down
```
```
application/json
```
```
/direct_upload
```
```
requireSignedURLs=true
```
```
/cdn-cgi/image/
```
```
cf.image
```
```
Access to XMLHttpRequest blocked by CORS policy: Request header field content-type is not allowed
```
```
multipart/form-data
```
```
// ✅ CORRECTconst formData = new FormData();formData.append('file', fileInput.files[0]);await fetch(uploadURL, {  method: 'POST',  body: formData // Browser sets multipart/form-data automatically});// ❌ WRONGawait fetch(uploadURL, {  method: 'POST',  headers: { 'Content-Type': 'application/json' }, // CORS error  body: JSON.stringify({ file: base64Image })});
```
```
// ✅ CORRECTconst formData = new FormData();formData.append('file', fileInput.files[0]);await fetch(uploadURL, {  method: 'POST',  body: formData // Browser sets multipart/form-data automatically});// ❌ WRONGawait fetch(uploadURL, {  method: 'POST',  headers: { 'Content-Type': 'application/json' }, // CORS error  body: JSON.stringify({ file: base64Image })});
```
```
Error 5408
```
```
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MBif (file.size > MAX_FILE_SIZE) {  alert('File too large. Please select an image under 10MB.');  return;}
```
```
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MBif (file.size > MAX_FILE_SIZE) {  alert('File too large. Please select an image under 10MB.');  return;}
```
```
400 Bad Request
```
```
file
```
```
image
```
```
photo
```
```
// ✅ CORRECTformData.append('file', imageFile);// ❌ WRONGformData.append('image', imageFile); // 400 errorformData.append('photo', imageFile); // 400 error
```
```
// ✅ CORRECTformData.append('file', imageFile);// ❌ WRONGformData.append('image', imageFile); // 400 errorformData.append('photo', imageFile); // 400 error
```
```
/direct_upload
```
```
ARCHITECTURE:Browser → Backend API → POST /direct_upload → Returns uploadURL → Browser uploads to uploadURL
```
```
ARCHITECTURE:Browser → Backend API → POST /direct_upload → Returns uploadURL → Browser uploads to uploadURL
```
```
Cf-Resized: err=9401
```
```
// ✅ CORRECTfetch(imageURL, {  cf: {    image: {      width: 800,      quality: 85,      format: 'auto'    }  }});// ❌ WRONGfetch(imageURL, {  cf: {    image: {      width: 'large', // Must be number      quality: 150 // Max 100    }  }});
```
```
// ✅ CORRECTfetch(imageURL, {  cf: {    image: {      width: 800,      quality: 85,      format: 'auto'    }  }});// ❌ WRONGfetch(imageURL, {  cf: {    image: {      width: 'large', // Must be number      quality: 150 // Max 100    }  }});
```
```
Cf-Resized: err=9402
```
```
Cf-Resized: err=9403
```
```
// ✅ CORRECTif (url.pathname.startsWith('/images/')) {  const originalPath = url.pathname.replace('/images/', '');  const originURL = https://storage.example.com/${originalPath};  return fetch(originURL, { cf: { image: { width: 800 } } });}// ❌ WRONGif (url.pathname.startsWith('/images/')) {  // Fetches worker's own URL, causes loop  return fetch(request, { cf: { image: { width: 800 } } });}
```
```
// ✅ CORRECTif (url.pathname.startsWith('/images/')) {  const originalPath = url.pathname.replace('/images/', '');  const originURL = https://storage.example.com/${originalPath};  return fetch(originURL, { cf: { image: { width: 800 } } });}// ❌ WRONGif (url.pathname.startsWith('/images/')) {  // Fetches worker's own URL, causes loop  return fetch(request, { cf: { image: { width: 800 } } });}
```
```
https://storage.example.com/${originalPath}
```
```
Cf-Resized: err=9406
```
```
err=9419
```
```
// ✅ CORRECTconst imageURL = "https://example.com/images/photo%20name.jpg";// ❌ WRONGconst imageURL = "http://example.com/images/photo.jpg"; // HTTP not allowedconst imageURL = "https://example.com/images/photo name.jpg"; // Space not encoded
```
```
// ✅ CORRECTconst imageURL = "https://example.com/images/photo%20name.jpg";// ❌ WRONGconst imageURL = "http://example.com/images/photo.jpg"; // HTTP not allowedconst imageURL = "https://example.com/images/photo name.jpg"; // Space not encoded
```
```
encodeURIComponent()
```
```
const filename = "photo name.jpg";const imageURL = https://example.com/images/${encodeURIComponent(filename)};
```
```
const filename = "photo name.jpg";const imageURL = https://example.com/images/${encodeURIComponent(filename)};
```
```
https://example.com/images/${encodeURIComponent(filename)}
```
```
Cf-Resized: err=9412
```
```
// Verify URL before transformingconst originResponse = await fetch(imageURL, { method: 'HEAD' });const contentType = originResponse.headers.get('content-type');if (!contentType?.startsWith('image/')) {  return new Response('Not an image', { status: 400 });}return fetch(imageURL, { cf: { image: { width: 800 } } });
```
```
// Verify URL before transformingconst originResponse = await fetch(imageURL, { method: 'HEAD' });const contentType = originResponse.headers.get('content-type');if (!contentType?.startsWith('image/')) {  return new Response('Not an image', { status: 400 });}return fetch(imageURL, { cf: { image: { width: 800 } } });
```
```
Cf-Resized: err=9413
```
```
const MAX_MEGAPIXELS = 100;if (width * height > MAX_MEGAPIXELS * 1_000_000) {  return new Response('Image too large', { status: 413 });}
```
```
const MAX_MEGAPIXELS = 100;if (width * height > MAX_MEGAPIXELS * 1_000_000) {  return new Response('Image too large', { status: 413 });}
```
```
requireSignedURLs=true
```
```
// ✅ CORRECT - Use named variants for private imagesawait uploadImage({  file: imageFile,  requireSignedURLs: true // Use named variants: /public, /avatar, etc.});// ❌ WRONG - Flexible variants don't support signed URLs// Cannot use: /w=400,sharpen=3 with requireSignedURLs=true
```
```
// ✅ CORRECT - Use named variants for private imagesawait uploadImage({  file: imageFile,  requireSignedURLs: true // Use named variants: /public, /avatar, etc.});// ❌ WRONG - Flexible variants don't support signed URLs// Cannot use: /w=400,sharpen=3 with requireSignedURLs=true
```
```
// SVGs can be served but not resized// Use any variant name as placeholder// https://imagedelivery.net/<HASH>/<SVG_ID>/public// SVG will be served at original size regardless of variant settings
```
```
// SVGs can be served but not resized// Use any variant name as placeholder// https://imagedelivery.net/<HASH>/<SVG_ID>/public// SVG will be served at original size regardless of variant settings
```
```
// ✅ CORRECT - JPEG preserves metadatafetch(imageURL, {  cf: {    image: {      width: 800,      format: 'jpeg', // or 'auto' (may become jpeg)      metadata: 'keep' // Preserves most EXIF including GPS    }  }});// ❌ WRONG - WebP/PNG ignore metadata settingfetch(imageURL, {  cf: {    image: {      format: 'webp',      metadata: 'keep' // NO EFFECT - always stripped for WebP/PNG    }  }});
```
```
// ✅ CORRECT - JPEG preserves metadatafetch(imageURL, {  cf: {    image: {      width: 800,      format: 'jpeg', // or 'auto' (may become jpeg)      metadata: 'keep' // Preserves most EXIF including GPS    }  }});// ❌ WRONG - WebP/PNG ignore metadata settingfetch(imageURL, {  cf: {    image: {      format: 'webp',      metadata: 'keep' // NO EFFECT - always stripped for WebP/PNG    }  }});
```
```
none
```
```
copyright
```
```
keep
```
```
none
```
```
none
```
```
format=avif
```
```
// ✅ RECOMMENDED - Use format=auto instead of explicit aviffetch(imageURL, {  cf: {    image: {      width: 2000,      format: 'auto' // Cloudflare chooses best format    }  }});// ⚠️ MAY FAIL - Explicit AVIF with large dimensionsfetch(imageURL, {  cf: {    image: {      width: 2000,      format: 'avif' // May fail if >1200px    }  }});// ✅ WORKAROUND - Use WebP for larger imagesif (width > 1200) {  format = 'webp'; // WebP supports larger dimensions} else {  format = 'avif'; // AVIF for smaller images}
```
```
// ✅ RECOMMENDED - Use format=auto instead of explicit aviffetch(imageURL, {  cf: {    image: {      width: 2000,      format: 'auto' // Cloudflare chooses best format    }  }});// ⚠️ MAY FAIL - Explicit AVIF with large dimensionsfetch(imageURL, {  cf: {    image: {      width: 2000,      format: 'avif' // May fail if >1200px    }  }});// ✅ WORKAROUND - Use WebP for larger imagesif (width > 1200) {  format = 'webp'; // WebP supports larger dimensions} else {  format = 'avif'; // AVIF for smaller images}
```
```
.png
```
```
.jpg
```
```
.jpeg
```
```
.gif
```
```
.webp
```
```
.bmp
```
```
.ico
```
```
.svg
```
```
.tif
```
```
.tiff
```
```
URI Path
```
```
ends with
```
```
.png
```
```
cp templates/upload-api-basic.ts src/upload.ts# Edit with your account ID and API token
```
```
cp templates/upload-api-basic.ts src/upload.ts# Edit with your account ID and API token
```
```
/cdn-cgi/imagedelivery/<HASH>/<ID>/<VARIANT>
```
```
batch.imagedelivery.net
```
```
imageId
```
```
status
```
```
metadata
```
```
/cdn-cgi/image/
```
```
export default {  async fetch(request, env) {    const url = new URL(request.url);    const imageKey = url.pathname.replace('/images/', '');    const originURL = https://r2-bucket.example.com/${imageKey};    return fetch(originURL, {      cf: {        image: {          width: 800,          quality: 85,          format: 'auto'        }      }    });  }};
```
```
export default {  async fetch(request, env) {    const url = new URL(request.url);    const imageKey = url.pathname.replace('/images/', '');    const originURL = https://r2-bucket.example.com/${imageKey};    return fetch(originURL, {      cf: {        image: {          width: 800,          quality: 85,          format: 'auto'        }      }    });  }};
```
```
https://r2-bucket.example.com/${imageKey}
```
```
/cdn-cgi/image/...
```
```
Access-Control-Allow-Origin
```
```
multipart/form-data
```
```
/direct_upload
```
```
file
```
```
image
```
```
Cf-Resized: err=9403
```
```
requireSignedURLs=true
```
```
draft: true
```
```
/images/v1/{id}
```
```
const imageId = \
```
```
;
```
```
URI Path
```
```
ends with
```
```
.png
```
```
.png
```
```
.jpg
```
```
.jpeg
```
```
.gif
```
```
.webp
```
```
.bmp
```
```
.ico
```
```
.svg
```
```
.tif
```
```
.tiff
```
```
/* ❌ Calling from browser */fetch('https://api.cloudflare.com/client/v4/accounts/.../images/v2/direct_upload', {  headers: { 'Authorization': Bearer ${apiToken} } // Exposed!})/* ✅ Call from backend, send URL to frontend */// Backend:const response = await fetch(  https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v2/direct_upload,  { method: 'POST', headers: { 'Authorization': Bearer ${apiToken} } })const { result } = await response.json()return Response.json({ uploadURL: result.uploadURL })// Frontend uses the uploadURL
```
```
/* ❌ Calling from browser */fetch('https://api.cloudflare.com/client/v4/accounts/.../images/v2/direct_upload', {  headers: { 'Authorization': Bearer ${apiToken} } // Exposed!})/* ✅ Call from backend, send URL to frontend */// Backend:const response = await fetch(  https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v2/direct_upload,  { method: 'POST', headers: { 'Authorization': Bearer ${apiToken} } })const { result } = await response.json()return Response.json({ uploadURL: result.uploadURL })// Frontend uses the uploadURL
```
```
Bearer ${apiToken}
```
```
https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v2/direct_upload
```
```
Bearer ${apiToken}
```
```
/* ❌ Wrong content type or field name */const formData = new FormData()formData.append('image', file) // Wrong field name!/* ✅ Field MUST be named "file" */const formData = new FormData()formData.append('file', file) // Correct!// Let browser set Content-Type (includes boundary)await fetch(uploadURL, { method: 'POST', body: formData })
```
```
/* ❌ Wrong content type or field name */const formData = new FormData()formData.append('image', file) // Wrong field name!/* ✅ Field MUST be named "file" */const formData = new FormData()formData.append('file', file) // Correct!// Let browser set Content-Type (includes boundary)await fetch(uploadURL, { method: 'POST', body: formData })
```
```
/* ❌ Cannot use together */// Flexible variants with requireSignedURLs=true/* ✅ Use named variants for private images */// Create named variant in dashboard// Use: /cdn-cgi/imagedelivery/{hash}/{imageId}/myVariant
```
```
/* ❌ Cannot use together */// Flexible variants with requireSignedURLs=true/* ✅ Use named variants for private images */// Create named variant in dashboard// Use: /cdn-cgi/imagedelivery/{hash}/{imageId}/myVariant
```
```
/* ✅ New gravity=face parameter */const url = https://imagedelivery.net/${hash}/${imageId}/w=300,h=300,gravity=face,zoom=1.2// GPU-based RetinaFace detection// zoom: 0.5 (zoomed out) to 2.0 (zoomed in)
```
```
/* ✅ New gravity=face parameter */const url = https://imagedelivery.net/${hash}/${imageId}/w=300,h=300,gravity=face,zoom=1.2// GPU-based RetinaFace detection// zoom: 0.5 (zoomed out) to 2.0 (zoomed in)
```
```
https://imagedelivery.net/${hash}/${imageId}/w=300,h=300,gravity=face,zoom=1.2
```
```
/* ❌ Error 9403: request loop */// Worker fetching its own URL/* ✅ Use binding directly or external URL */const image = await env.IMAGES.get(imageId)// OR fetch from external source
```
```
/* ❌ Error 9403: request loop */// Worker fetching its own URL/* ✅ Use binding directly or external URL */const image = await env.IMAGES.get(imageId)// OR fetch from external source
```
```
/* ❌ Trusting client validation */if (file.type.startsWith('image/')) { /* upload */ }/* ✅ Validate on server */const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']const contentType = request.headers.get('content-type')// Also check file magic bytes if needed
```
```
/* ❌ Trusting client validation */if (file.type.startsWith('image/')) { /* upload */ }/* ✅ Validate on server */const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']const contentType = request.headers.get('content-type')// Also check file magic bytes if needed
```
This skill integrates Cloudflare's powerful image management capabilities directly into your AI coding assistant workflow. Developers can effortlessly interact with the Cloudflare Images API to upload, store, and apply dynamic transformations to images, enhancing website performance and user experience. It's designed to streamline tasks related to media asset handling, from basic resizing to advanced AI-powered cropping, making it an invaluable tool for modern web development.

# When to Use This Skill
- •Dynamically resizing and optimizing images for different devices and viewports via URL transformations.
- •Automating the upload and storage of user-generated content images to Cloudflare Images.
- •Implementing AI-powered face cropping for avatars or product images directly within a development workflow.
- •Migrating existing image assets from deprecated services to Cloudflare Images.

# Pro Tips
- 💡Leverage Cloudflare Workers to programmatically control image uploads and transformations, adding custom logic or authentication layers.
- 💡Utilize `gravity=face` with `zoom` control for smart cropping of user-uploaded profile pictures to ensure optimal presentation.
- 💡Combine image transformations with Cloudflare's edge caching for ultra-fast content delivery globally.

