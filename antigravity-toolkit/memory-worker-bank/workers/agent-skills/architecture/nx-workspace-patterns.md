# nx-workspace-patterns
Source: https://antigravity.codes/agent-skills/architecture/nx-workspace-patterns

## AI Worker Instructions
When the user requests functionality related to nx-workspace-patterns, follow these guidelines and utilize this context.

## Scraped Content

# nx-workspace-patterns
```
workspace/├── apps/              # Deployable applications│   ├── web/│   └── api/├── libs/              # Shared libraries│   ├── shared/│   │   ├── ui/│   │   └── utils/│   └── feature/│       ├── auth/│       └── dashboard/├── tools/             # Custom executors/generators├── nx.json            # Nx configuration└── workspace.json     # Project configuration
```
```
workspace/├── apps/              # Deployable applications│   ├── web/│   └── api/├── libs/              # Shared libraries│   ├── shared/│   │   ├── ui/│   │   └── utils/│   └── feature/│       ├── auth/│       └── dashboard/├── tools/             # Custom executors/generators├── nx.json            # Nx configuration└── workspace.json     # Project configuration
```
```
feature-auth
```
```
ui-buttons
```
```
data-access-users
```
```
util-formatting
```
```
shell-web
```
```
{  "$schema": "./node_modules/nx/schemas/nx-schema.json",  "npmScope": "myorg",  "affected": {    "defaultBase": "main"  },  "tasksRunnerOptions": {    "default": {      "runner": "nx/tasks-runners/default",      "options": {        "cacheableOperations": [          "build",          "lint",          "test",          "e2e",          "build-storybook"        ],        "parallel": 3      }    }  },  "targetDefaults": {    "build": {      "dependsOn": ["^build"],      "inputs": ["production", "^production"],      "cache": true    },    "test": {      "inputs": ["default", "^production", "{workspaceRoot}/jest.preset.js"],      "cache": true    },    "lint": {      "inputs": ["default", "{workspaceRoot}/.eslintrc.json"],      "cache": true    },    "e2e": {      "inputs": ["default", "^production"],      "cache": true    }  },  "namedInputs": {    "default": ["{projectRoot}/**/*", "sharedGlobals"],    "production": [      "default",      "!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)",      "!{projectRoot}/tsconfig.spec.json",      "!{projectRoot}/jest.config.[jt]s",      "!{projectRoot}/.eslintrc.json"    ],    "sharedGlobals": [      "{workspaceRoot}/babel.config.json",      "{workspaceRoot}/tsconfig.base.json"    ]  },  "generators": {    "@nx/react": {      "application": {        "style": "css",        "linter": "eslint",        "bundler": "webpack"      },      "library": {        "style": "css",        "linter": "eslint"      },      "component": {        "style": "css"      }    }  }}
```
```
{  "$schema": "./node_modules/nx/schemas/nx-schema.json",  "npmScope": "myorg",  "affected": {    "defaultBase": "main"  },  "tasksRunnerOptions": {    "default": {      "runner": "nx/tasks-runners/default",      "options": {        "cacheableOperations": [          "build",          "lint",          "test",          "e2e",          "build-storybook"        ],        "parallel": 3      }    }  },  "targetDefaults": {    "build": {      "dependsOn": ["^build"],      "inputs": ["production", "^production"],      "cache": true    },    "test": {      "inputs": ["default", "^production", "{workspaceRoot}/jest.preset.js"],      "cache": true    },    "lint": {      "inputs": ["default", "{workspaceRoot}/.eslintrc.json"],      "cache": true    },    "e2e": {      "inputs": ["default", "^production"],      "cache": true    }  },  "namedInputs": {    "default": ["{projectRoot}/**/*", "sharedGlobals"],    "production": [      "default",      "!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)",      "!{projectRoot}/tsconfig.spec.json",      "!{projectRoot}/jest.config.[jt]s",      "!{projectRoot}/.eslintrc.json"    ],    "sharedGlobals": [      "{workspaceRoot}/babel.config.json",      "{workspaceRoot}/tsconfig.base.json"    ]  },  "generators": {    "@nx/react": {      "application": {        "style": "css",        "linter": "eslint",        "bundler": "webpack"      },      "library": {        "style": "css",        "linter": "eslint"      },      "component": {        "style": "css"      }    }  }}
```
```
// apps/web/project.json{  "name": "web",  "$schema": "../../node_modules/nx/schemas/project-schema.json",  "sourceRoot": "apps/web/src",  "projectType": "application",  "tags": ["type:app", "scope:web"],  "targets": {    "build": {      "executor": "@nx/webpack:webpack",      "outputs": ["{options.outputPath}"],      "defaultConfiguration": "production",      "options": {        "compiler": "babel",        "outputPath": "dist/apps/web",        "index": "apps/web/src/index.html",        "main": "apps/web/src/main.tsx",        "tsConfig": "apps/web/tsconfig.app.json",        "assets": ["apps/web/src/assets"],        "styles": ["apps/web/src/styles.css"]      },      "configurations": {        "development": {          "extractLicenses": false,          "optimization": false,          "sourceMap": true        },        "production": {          "optimization": true,          "outputHashing": "all",          "sourceMap": false,          "extractLicenses": true        }      }    },    "serve": {      "executor": "@nx/webpack:dev-server",      "defaultConfiguration": "development",      "options": {        "buildTarget": "web:build"      },      "configurations": {        "development": {          "buildTarget": "web:build:development"        },        "production": {          "buildTarget": "web:build:production"        }      }    },    "test": {      "executor": "@nx/jest:jest",      "outputs": ["{workspaceRoot}/coverage/{projectRoot}"],      "options": {        "jestConfig": "apps/web/jest.config.ts",        "passWithNoTests": true      }    },    "lint": {      "executor": "@nx/eslint:lint",      "outputs": ["{options.outputFile}"],      "options": {        "lintFilePatterns": ["apps/web/**/*.{ts,tsx,js,jsx}"]      }    }  }}
```
```
// apps/web/project.json{  "name": "web",  "$schema": "../../node_modules/nx/schemas/project-schema.json",  "sourceRoot": "apps/web/src",  "projectType": "application",  "tags": ["type:app", "scope:web"],  "targets": {    "build": {      "executor": "@nx/webpack:webpack",      "outputs": ["{options.outputPath}"],      "defaultConfiguration": "production",      "options": {        "compiler": "babel",        "outputPath": "dist/apps/web",        "index": "apps/web/src/index.html",        "main": "apps/web/src/main.tsx",        "tsConfig": "apps/web/tsconfig.app.json",        "assets": ["apps/web/src/assets"],        "styles": ["apps/web/src/styles.css"]      },      "configurations": {        "development": {          "extractLicenses": false,          "optimization": false,          "sourceMap": true        },        "production": {          "optimization": true,          "outputHashing": "all",          "sourceMap": false,          "extractLicenses": true        }      }    },    "serve": {      "executor": "@nx/webpack:dev-server",      "defaultConfiguration": "development",      "options": {        "buildTarget": "web:build"      },      "configurations": {        "development": {          "buildTarget": "web:build:development"        },        "production": {          "buildTarget": "web:build:production"        }      }    },    "test": {      "executor": "@nx/jest:jest",      "outputs": ["{workspaceRoot}/coverage/{projectRoot}"],      "options": {        "jestConfig": "apps/web/jest.config.ts",        "passWithNoTests": true      }    },    "lint": {      "executor": "@nx/eslint:lint",      "outputs": ["{options.outputFile}"],      "options": {        "lintFilePatterns": ["apps/web/**/*.{ts,tsx,js,jsx}"]      }    }  }}
```
```
// .eslintrc.json{  "root": true,  "ignorePatterns": ["**/*"],  "plugins": ["@nx"],  "overrides": [    {      "files": ["*.ts", "*.tsx", "*.js", "*.jsx"],      "rules": {        "@nx/enforce-module-boundaries": [          "error",          {            "enforceBuildableLibDependency": true,            "allow": [],            "depConstraints": [              {                "sourceTag": "type:app",                "onlyDependOnLibsWithTags": [                  "type:feature",                  "type:ui",                  "type:data-access",                  "type:util"                ]              },              {                "sourceTag": "type:feature",                "onlyDependOnLibsWithTags": [                  "type:ui",                  "type:data-access",                  "type:util"                ]              },              {                "sourceTag": "type:ui",                "onlyDependOnLibsWithTags": ["type:ui", "type:util"]              },              {                "sourceTag": "type:data-access",                "onlyDependOnLibsWithTags": ["type:data-access", "type:util"]              },              {                "sourceTag": "type:util",                "onlyDependOnLibsWithTags": ["type:util"]              },              {                "sourceTag": "scope:web",                "onlyDependOnLibsWithTags": ["scope:web", "scope:shared"]              },              {                "sourceTag": "scope:api",                "onlyDependOnLibsWithTags": ["scope:api", "scope:shared"]              },              {                "sourceTag": "scope:shared",                "onlyDependOnLibsWithTags": ["scope:shared"]              }            ]          }        ]      }    }  ]}
```
```
// .eslintrc.json{  "root": true,  "ignorePatterns": ["**/*"],  "plugins": ["@nx"],  "overrides": [    {      "files": ["*.ts", "*.tsx", "*.js", "*.jsx"],      "rules": {        "@nx/enforce-module-boundaries": [          "error",          {            "enforceBuildableLibDependency": true,            "allow": [],            "depConstraints": [              {                "sourceTag": "type:app",                "onlyDependOnLibsWithTags": [                  "type:feature",                  "type:ui",                  "type:data-access",                  "type:util"                ]              },              {                "sourceTag": "type:feature",                "onlyDependOnLibsWithTags": [                  "type:ui",                  "type:data-access",                  "type:util"                ]              },              {                "sourceTag": "type:ui",                "onlyDependOnLibsWithTags": ["type:ui", "type:util"]              },              {                "sourceTag": "type:data-access",                "onlyDependOnLibsWithTags": ["type:data-access", "type:util"]              },              {                "sourceTag": "type:util",                "onlyDependOnLibsWithTags": ["type:util"]              },              {                "sourceTag": "scope:web",                "onlyDependOnLibsWithTags": ["scope:web", "scope:shared"]              },              {                "sourceTag": "scope:api",                "onlyDependOnLibsWithTags": ["scope:api", "scope:shared"]              },              {                "sourceTag": "scope:shared",                "onlyDependOnLibsWithTags": ["scope:shared"]              }            ]          }        ]      }    }  ]}
```
```
// tools/generators/feature-lib/index.tsimport {  Tree,  formatFiles,  generateFiles,  joinPathFragments,  names,  readProjectConfiguration,} from "@nx/devkit";import { libraryGenerator } from "@nx/react";interface FeatureLibraryGeneratorSchema {  name: string;  scope: string;  directory?: string;}export default async function featureLibraryGenerator(  tree: Tree,  options: FeatureLibraryGeneratorSchema,) {  const { name, scope, directory } = options;  const projectDirectory = directory    ? ${directory}/${name}    : libs/${scope}/feature-${name};  // Generate base library  await libraryGenerator(tree, {    name: feature-${name},    directory: projectDirectory,    tags: type:feature,scope:${scope},    style: "css",    skipTsConfig: false,    skipFormat: true,    unitTestRunner: "jest",    linter: "eslint",  });  // Add custom files  const projectConfig = readProjectConfiguration(    tree,    ${scope}-feature-${name},  );  const projectNames = names(name);  generateFiles(    tree,    joinPathFragments(__dirname, "files"),    projectConfig.sourceRoot,    {      ...projectNames,      scope,      tmpl: "",    },  );  await formatFiles(tree);}
```
```
// tools/generators/feature-lib/index.tsimport {  Tree,  formatFiles,  generateFiles,  joinPathFragments,  names,  readProjectConfiguration,} from "@nx/devkit";import { libraryGenerator } from "@nx/react";interface FeatureLibraryGeneratorSchema {  name: string;  scope: string;  directory?: string;}export default async function featureLibraryGenerator(  tree: Tree,  options: FeatureLibraryGeneratorSchema,) {  const { name, scope, directory } = options;  const projectDirectory = directory    ? ${directory}/${name}    : libs/${scope}/feature-${name};  // Generate base library  await libraryGenerator(tree, {    name: feature-${name},    directory: projectDirectory,    tags: type:feature,scope:${scope},    style: "css",    skipTsConfig: false,    skipFormat: true,    unitTestRunner: "jest",    linter: "eslint",  });  // Add custom files  const projectConfig = readProjectConfiguration(    tree,    ${scope}-feature-${name},  );  const projectNames = names(name);  generateFiles(    tree,    joinPathFragments(__dirname, "files"),    projectConfig.sourceRoot,    {      ...projectNames,      scope,      tmpl: "",    },  );  await formatFiles(tree);}
```
```
${directory}/${name}
```
```
libs/${scope}/feature-${name}
```
```
feature-${name}
```
```
type:feature,scope:${scope}
```
```
${scope}-feature-${name}
```
```
# .github/workflows/ci.ymlname: CIon:  push:    branches: [main]  pull_request:    branches: [main]env:  NX_CLOUD_ACCESS_TOKEN: ${{ secrets.NX_CLOUD_ACCESS_TOKEN }}jobs:  main:    runs-on: ubuntu-latest    steps:      - uses: actions/checkout@v4        with:          fetch-depth: 0      - uses: actions/setup-node@v4        with:          node-version: 20          cache: "npm"      - name: Install dependencies        run: npm ci      - name: Derive SHAs for affected commands        uses: nrwl/nx-set-shas@v4      - name: Run affected lint        run: npx nx affected -t lint --parallel=3      - name: Run affected test        run: npx nx affected -t test --parallel=3 --configuration=ci      - name: Run affected build        run: npx nx affected -t build --parallel=3      - name: Run affected e2e        run: npx nx affected -t e2e --parallel=1
```
```
# .github/workflows/ci.ymlname: CIon:  push:    branches: [main]  pull_request:    branches: [main]env:  NX_CLOUD_ACCESS_TOKEN: ${{ secrets.NX_CLOUD_ACCESS_TOKEN }}jobs:  main:    runs-on: ubuntu-latest    steps:      - uses: actions/checkout@v4        with:          fetch-depth: 0      - uses: actions/setup-node@v4        with:          node-version: 20          cache: "npm"      - name: Install dependencies        run: npm ci      - name: Derive SHAs for affected commands        uses: nrwl/nx-set-shas@v4      - name: Run affected lint        run: npx nx affected -t lint --parallel=3      - name: Run affected test        run: npx nx affected -t test --parallel=3 --configuration=ci      - name: Run affected build        run: npx nx affected -t build --parallel=3      - name: Run affected e2e        run: npx nx affected -t e2e --parallel=1
```
```
// nx.json with Nx Cloud{  "tasksRunnerOptions": {    "default": {      "runner": "nx-cloud",      "options": {        "cacheableOperations": ["build", "lint", "test", "e2e"],        "accessToken": "your-nx-cloud-token",        "parallel": 3,        "cacheDirectory": ".nx/cache"      }    }  },  "nxCloudAccessToken": "your-nx-cloud-token"}// Self-hosted cache with S3{  "tasksRunnerOptions": {    "default": {      "runner": "@nx-aws-cache/nx-aws-cache",      "options": {        "cacheableOperations": ["build", "lint", "test"],        "awsRegion": "us-east-1",        "awsBucket": "my-nx-cache-bucket",        "awsProfile": "default"      }    }  }}
```
```
// nx.json with Nx Cloud{  "tasksRunnerOptions": {    "default": {      "runner": "nx-cloud",      "options": {        "cacheableOperations": ["build", "lint", "test", "e2e"],        "accessToken": "your-nx-cloud-token",        "parallel": 3,        "cacheDirectory": ".nx/cache"      }    }  },  "nxCloudAccessToken": "your-nx-cloud-token"}// Self-hosted cache with S3{  "tasksRunnerOptions": {    "default": {      "runner": "@nx-aws-cache/nx-aws-cache",      "options": {        "cacheableOperations": ["build", "lint", "test"],        "awsRegion": "us-east-1",        "awsBucket": "my-nx-cache-bucket",        "awsProfile": "default"      }    }  }}
```
```
# Generate new librarynx g @nx/react:lib feature-auth --directory=libs/web --tags=type:feature,scope:web# Run affected testsnx affected -t test --base=main# View dependency graphnx graph# Run specific projectnx build web --configuration=production# Reset cachenx reset# Run migrationsnx migrate latestnx migrate --run-migrations
```
```
# Generate new librarynx g @nx/react:lib feature-auth --directory=libs/web --tags=type:feature,scope:web# Run affected testsnx affected -t test --base=main# View dependency graphnx graph# Run specific projectnx build web --configuration=production# Reset cachenx reset# Run migrationsnx migrate latestnx migrate --run-migrations
```
Unlock the full potential of your monorepo with this specialized Nx Workspace Patterns Agent Skill. Designed for developers and teams managing complex multi-project environments, this skill provides expert guidance on structuring, configuring, and optimizing Nx workspaces. From establishing robust project boundaries to leveraging advanced caching strategies and efficient affected commands, it empowers you to build scalable, high-performance applications. Streamline your development workflow, enhance collaboration, and ensure consistent code quality across your entire codebase, making monorepo management a breeze.

# When to Use This Skill
- •Setting up a new Nx monorepo, defining project types and dependencies for optimal structure.
- •Optimizing CI/CD pipelines by configuring Nx affected commands and remote caching for faster, more efficient builds.
- •Restructuring an existing monorepo to improve modularity and enforce architectural boundaries between libraries.
- •Managing shared utility libraries and feature modules efficiently across multiple applications within a single workspace.

# Pro Tips
- 💡**Enforce Strict Project Boundaries**: Utilize Nx's `enforce-module-boundaries` lint rule (via `nx.json` or `.eslintrc.json`) to prevent unwanted dependency coupling between projects and maintain a clean architecture.
- 💡**Leverage Task Graph Visualization**: Regularly use `nx graph` to visualize your project dependencies and task execution flow. This helps identify bottlenecks and potential areas for parallelization or optimization within your monorepo.
- 💡**Strategic Library Grouping**: Group related libraries (e.g., `feature`, `ui`, `data-access`, `util`) under distinct folders within `libs/` and use consistent naming conventions. This improves discoverability and maintainability, especially in large workspaces.

