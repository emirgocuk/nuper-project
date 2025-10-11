# Active Context

**Current Phase: Phase 1 - Scaffolding and UI Migration**

Our immediate focus is to set up the foundational structure of the `nuper-next-postgresql` application and migrate all visual elements from the legacy project to ensure a "pixel-perfect" match before implementing any backend logic.

**Next Immediate Steps:**

1.  **Populate Memory Bank:** Complete the initial documentation for the new project (This task).
2.  **Migrate UI Assets:**
    -   Copy the `tailwind.config.js` file.
    -   Copy the global styles from `index.css` to `globals.css`.
    -   Copy the entire `src/components` directory.
    -   Copy all static assets from the `public` folder.
3.  **Create the Main Layout:** Build the root layout (`src/app/layout.js`) that includes the shared `Navbar` and footer components.
4.  **Recreate the Home Page:** Build the home page (`src/app/page.js`) by composing the migrated components (`SpaceHero`, `Projects`, etc.) to exactly match the legacy application's home page.