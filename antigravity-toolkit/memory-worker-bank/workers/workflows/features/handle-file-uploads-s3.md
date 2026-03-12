# Handle File Uploads (S3)
Source: https://antigravity.codes/workflows/features/handle-file-uploads-aws-s3-presigned-urls

## AI Worker Instructions
When the user requests functionality related to Handle File Uploads (S3), follow these guidelines and utilize this context.

## Scraped Content

# Handle File Uploads (S3)
```
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```
```
'use server'   import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';   import { getSignedUrl } from '@aws-sdk/s3-request-presigner';      const s3Client = new S3Client({     region: process.env.AWS_REGION!,     credentials: {       accessKeyId: process.env.AWS_ACCESS_KEY_ID!,       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,     },   });      export async function getUploadUrl(filename: string, contentType: string) {     const command = new PutObjectCommand({       Bucket: process.env.AWS_BUCKET_NAME!,       Key: uploads/${Date.now()}-${filename},       ContentType: contentType,     });          const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });     return url;   }
```
```
'use server'   import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';   import { getSignedUrl } from '@aws-sdk/s3-request-presigner';      const s3Client = new S3Client({     region: process.env.AWS_REGION!,     credentials: {       accessKeyId: process.env.AWS_ACCESS_KEY_ID!,       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,     },   });      export async function getUploadUrl(filename: string, contentType: string) {     const command = new PutObjectCommand({       Bucket: process.env.AWS_BUCKET_NAME!,       Key: uploads/${Date.now()}-${filename},       ContentType: contentType,     });          const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });     return url;   }
```
```
uploads/${Date.now()}-${filename}
```
```
async function handleUpload(file: File) {     const uploadUrl = await getUploadUrl(file.name, file.type);     await fetch(uploadUrl, {       method: 'PUT',       body: file,       headers: { 'Content-Type': file.type },     });   }
```
```
async function handleUpload(file: File) {     const uploadUrl = await getUploadUrl(file.name, file.type);     await fetch(uploadUrl, {       method: 'PUT',       body: file,       headers: { 'Content-Type': file.type },     });   }
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as handle-file-uploads-aws-s3-presigned-urls.md
```
handle-file-uploads-aws-s3-presigned-urls.md
```
- In Antigravity, type /handle_file_uploads_aws_s3_presigned_urls or just describe what you want to do
```
/handle_file_uploads_aws_s3_presigned_urls
```
Learn more about workflows →

# Related Workflows

# Scaffold New Component

# Implement Dark Mode

# Setup Internationalization (i18n)

