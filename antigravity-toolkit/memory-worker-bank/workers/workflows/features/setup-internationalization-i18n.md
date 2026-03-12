# Setup Internationalization (i18n)
Source: https://antigravity.codes/workflows/features/setup-internationalization-i18n-next-intl

## AI Worker Instructions
When the user requests functionality related to Setup Internationalization (i18n), follow these guidelines and utilize this context.

## Scraped Content

# Setup Internationalization (i18n)
```
npm install next-intl
```
```
messages/en.json
```
```
messages/es.json
```
```
{     "Index": {       "title": "Hello world!"     }   }
```
```
{     "Index": {       "title": "Hello world!"     }   }
```
```
src/middleware.ts
```
```
import createMiddleware from 'next-intl/middleware';      export default createMiddleware({     locales: ['en', 'es', 'fr'],     defaultLocale: 'en'   });      export const config = {     matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']   };
```
```
import createMiddleware from 'next-intl/middleware';      export default createMiddleware({     locales: ['en', 'es', 'fr'],     defaultLocale: 'en'   });      export const config = {     matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']   };
```
```
src/i18n.ts
```
```
import { getRequestConfig } from 'next-intl/server';      export default getRequestConfig(async ({ locale }) => ({     messages: (await import(../messages/${locale}.json)).default   }));
```
```
import { getRequestConfig } from 'next-intl/server';      export default getRequestConfig(async ({ locale }) => ({     messages: (await import(../messages/${locale}.json)).default   }));
```
```
../messages/${locale}.json
```
```
useTranslations
```
```
getTranslations
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as setup-internationalization-i18n-next-intl.md
```
setup-internationalization-i18n-next-intl.md
```
- In Antigravity, type /setup_internationalization_i18n_next_intl or just describe what you want to do
```
/setup_internationalization_i18n_next_intl
```
Learn more about workflows →

# Related Workflows

# Custom 404/500 Pages

# Scaffold New Component

# Implement Dark Mode

