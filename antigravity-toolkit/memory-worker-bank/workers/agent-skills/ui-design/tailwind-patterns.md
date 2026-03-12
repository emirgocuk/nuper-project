# tailwind-patterns
Source: https://antigravity.codes/agent-skills/ui-design/tailwind-patterns

## AI Worker Instructions
When the user requests functionality related to tailwind-patterns, follow these guidelines and utilize this context.

## Scraped Content

# tailwind-patterns
```
// Section Container<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">  {/* content */}</section>// Card Base<div className="bg-card text-card-foreground rounded-lg border border-border p-6">  {/* content */}</div>// Button Primary<button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">  Click me</button>// Responsive Grid<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">  {/* items */}</div>
```
```
// Section Container<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">  {/* content */}</section>// Card Base<div className="bg-card text-card-foreground rounded-lg border border-border p-6">  {/* content */}</div>// Button Primary<button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">  Click me</button>// Responsive Grid<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">  {/* items */}</div>
```
```
gap-2 p-2 space-y-2
```
```
gap-4 p-4 space-y-4
```
```
gap-6 p-6 space-y-6
```
```
gap-8 p-8 space-y-8
```
```
py-16 sm:py-24
```
```
text-base
```
```
sm:
```
```
sm:text-lg
```
```
md:
```
```
md:grid-cols-2
```
```
lg:
```
```
lg:px-8
```
```
xl:
```
```
xl:max-w-7xl
```
```
2xl:
```
```
2xl:text-6xl
```
```
// Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```
```
// Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```
```
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">  {/* content */}</div>
```
```
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">  {/* content */}</div>
```
```
max-w-4xl
```
```
max-w-5xl
```
```
max-w-6xl
```
```
max-w-7xl
```
```
<section className="py-16 sm:py-24">  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">    {/* content */}  </div></section>
```
```
<section className="py-16 sm:py-24">  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">    {/* content */}  </div></section>
```
```
<div className="bg-card text-card-foreground rounded-lg border border-border p-6">  <h3 className="text-lg font-semibold mb-2">Card Title</h3>  <p className="text-muted-foreground">Card description goes here.</p></div>
```
```
<div className="bg-card text-card-foreground rounded-lg border border-border p-6">  <h3 className="text-lg font-semibold mb-2">Card Title</h3>  <p className="text-muted-foreground">Card description goes here.</p></div>
```
```
<div className="bg-card text-card-foreground rounded-lg border border-border p-6 hover:shadow-lg transition-shadow">  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">    {/* Icon */}  </div>  <h3 className="text-lg font-semibold mb-2">Feature Title</h3>  <p className="text-muted-foreground">Feature description.</p></div>
```
```
<div className="bg-card text-card-foreground rounded-lg border border-border p-6 hover:shadow-lg transition-shadow">  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">    {/* Icon */}  </div>  <h3 className="text-lg font-semibold mb-2">Feature Title</h3>  <p className="text-muted-foreground">Feature description.</p></div>
```
```
<div className="bg-card text-card-foreground rounded-lg border-2 border-border p-8 relative">  <div className="text-sm font-semibold text-primary mb-2">Pro Plan</div>  <div className="text-4xl font-bold mb-1">$29<span className="text-lg text-muted-foreground">/mo</span></div>  <p className="text-muted-foreground mb-6">For growing teams</p>  <button className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90">    Get Started  </button></div>
```
```
<div className="bg-card text-card-foreground rounded-lg border-2 border-border p-8 relative">  <div className="text-sm font-semibold text-primary mb-2">Pro Plan</div>  <div className="text-4xl font-bold mb-1">$29<span className="text-lg text-muted-foreground">/mo</span></div>  <p className="text-muted-foreground mb-6">For growing teams</p>  <button className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90">    Get Started  </button></div>
```
```
references/card-patterns.md
```
```
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">  {items.map(item => <Card key={item.id} {...item} />)}</div>
```
```
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">  {items.map(item => <Card key={item.id} {...item} />)}</div>
```
```
<div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">  {/* Automatically adjusts columns based on available space */}</div>
```
```
<div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">  {/* Automatically adjusts columns based on available space */}</div>
```
```
<div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">  {items.map(item => (    <div key={item.id} className="break-inside-avoid">      <Card {...item} />    </div>  ))}</div>
```
```
<div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">  {items.map(item => (    <div key={item.id} className="break-inside-avoid">      <Card {...item} />    </div>  ))}</div>
```
```
// Primary<button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">  Primary</button>// Secondary<button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80">  Secondary</button>// Outline<button className="border border-border bg-transparent px-4 py-2 rounded-md hover:bg-accent">  Outline</button>// Ghost<button className="bg-transparent px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground">  Ghost</button>// Destructive<button className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md hover:bg-destructive/90">  Delete</button>
```
```
// Primary<button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">  Primary</button>// Secondary<button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80">  Secondary</button>// Outline<button className="border border-border bg-transparent px-4 py-2 rounded-md hover:bg-accent">  Outline</button>// Ghost<button className="bg-transparent px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground">  Ghost</button>// Destructive<button className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md hover:bg-destructive/90">  Delete</button>
```
```
px-3 py-1.5 text-sm
```
```
px-4 py-2
```
```
px-6 py-3 text-lg
```
```
references/button-patterns.md
```
```
<div className="space-y-2">  <label htmlFor="email" className="text-sm font-medium">    Email  </label>  <input    id="email"    type="email"    className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"    placeholder="you@example.com"  /></div>
```
```
<div className="space-y-2">  <label htmlFor="email" className="text-sm font-medium">    Email  </label>  <input    id="email"    type="email"    className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"    placeholder="you@example.com"  /></div>
```
```
<select className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary">  <option>Option 1</option>  <option>Option 2</option></select>
```
```
<select className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary">  <option>Option 1</option>  <option>Option 2</option></select>
```
```
<div className="flex items-center space-x-2">  <input    id="terms"    type="checkbox"    className="h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"  />  <label htmlFor="terms" className="text-sm">    I agree to the terms  </label></div>
```
```
<div className="flex items-center space-x-2">  <input    id="terms"    type="checkbox"    className="h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"  />  <label htmlFor="terms" className="text-sm">    I agree to the terms  </label></div>
```
```
<div className="space-y-2">  <label htmlFor="password" className="text-sm font-medium">    Password  </label>  <input    id="password"    type="password"    className="w-full px-3 py-2 bg-background border border-destructive rounded-md focus:outline-none focus:ring-2 focus:ring-destructive"  />  <p className="text-sm text-destructive">Password must be at least 8 characters</p></div>
```
```
<div className="space-y-2">  <label htmlFor="password" className="text-sm font-medium">    Password  </label>  <input    id="password"    type="password"    className="w-full px-3 py-2 bg-background border border-destructive rounded-md focus:outline-none focus:ring-2 focus:ring-destructive"  />  <p className="text-sm text-destructive">Password must be at least 8 characters</p></div>
```
```
references/form-patterns.md
```
```
<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">  Page Title</h1><h2 className="text-3xl sm:text-4xl font-bold">  Section Title</h2><h3 className="text-2xl sm:text-3xl font-semibold">  Subsection</h3><h4 className="text-xl font-semibold">  Card Title</h4>
```
```
<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">  Page Title</h1><h2 className="text-3xl sm:text-4xl font-bold">  Section Title</h2><h3 className="text-2xl sm:text-3xl font-semibold">  Subsection</h3><h4 className="text-xl font-semibold">  Card Title</h4>
```
```
<p className="text-base text-muted-foreground">  Regular paragraph text.</p><p className="text-lg text-muted-foreground leading-relaxed">  Larger body text with comfortable line height.</p><p className="text-sm text-muted-foreground">  Small supporting text or captions.</p>
```
```
<p className="text-base text-muted-foreground">  Regular paragraph text.</p><p className="text-lg text-muted-foreground leading-relaxed">  Larger body text with comfortable line height.</p><p className="text-sm text-muted-foreground">  Small supporting text or captions.</p>
```
```
<ul className="space-y-2 text-muted-foreground">  <li className="flex items-start">    <CheckIcon className="h-5 w-5 text-primary mr-2 mt-0.5" />    <span>Feature one</span>  </li>  <li className="flex items-start">    <CheckIcon className="h-5 w-5 text-primary mr-2 mt-0.5" />    <span>Feature two</span>  </li></ul>
```
```
<ul className="space-y-2 text-muted-foreground">  <li className="flex items-start">    <CheckIcon className="h-5 w-5 text-primary mr-2 mt-0.5" />    <span>Feature one</span>  </li>  <li className="flex items-start">    <CheckIcon className="h-5 w-5 text-primary mr-2 mt-0.5" />    <span>Feature two</span>  </li></ul>
```
```
references/typography-patterns.md
```
```
<header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">    <div className="flex h-16 items-center justify-between">      <div className="flex items-center gap-8">        {/* Logo */}        <a href="/" className="font-bold text-xl">Brand</a>        {/* Desktop Nav */}        <nav className="hidden md:flex gap-6">          <a href="#" className="text-sm hover:text-primary transition-colors">Features</a>          <a href="#" className="text-sm hover:text-primary transition-colors">Pricing</a>          <a href="#" className="text-sm hover:text-primary transition-colors">About</a>        </nav>      </div>      {/* CTA */}      <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm">        Sign Up      </button>    </div>  </div></header>
```
```
<header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">    <div className="flex h-16 items-center justify-between">      <div className="flex items-center gap-8">        {/* Logo */}        <a href="/" className="font-bold text-xl">Brand</a>        {/* Desktop Nav */}        <nav className="hidden md:flex gap-6">          <a href="#" className="text-sm hover:text-primary transition-colors">Features</a>          <a href="#" className="text-sm hover:text-primary transition-colors">Pricing</a>          <a href="#" className="text-sm hover:text-primary transition-colors">About</a>        </nav>      </div>      {/* CTA */}      <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm">        Sign Up      </button>    </div>  </div></header>
```
```
<footer className="border-t border-border bg-muted/50">  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">      <div>        <h4 className="font-semibold mb-4">Product</h4>        <ul className="space-y-2 text-sm text-muted-foreground">          <li><a href="#" className="hover:text-primary">Features</a></li>          <li><a href="#" className="hover:text-primary">Pricing</a></li>        </ul>      </div>      {/* More columns */}    </div>  </div></footer>
```
```
<footer className="border-t border-border bg-muted/50">  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">      <div>        <h4 className="font-semibold mb-4">Product</h4>        <ul className="space-y-2 text-sm text-muted-foreground">          <li><a href="#" className="hover:text-primary">Features</a></li>          <li><a href="#" className="hover:text-primary">Pricing</a></li>        </ul>      </div>      {/* More columns */}    </div>  </div></footer>
```
```
references/navigation-patterns.md
```
```
bg-background
```
```
text-foreground
```
```
bg-card
```
```
text-muted-foreground
```
```
border-border
```
```
bg-primary
```
```
bg-blue-500
```
```
references/dark-mode-patterns.md
```
```
<section className="py-16 sm:py-24">  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">    <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">      Section Title    </h2>    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">      {/* content */}    </div>  </div></section>
```
```
<section className="py-16 sm:py-24">  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">    <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">      Section Title    </h2>    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">      {/* content */}    </div>  </div></section>
```
```
<div className="flex flex-col items-center justify-center text-center">  <h1 className="text-4xl font-bold mb-4">Centered Title</h1>  <p className="text-muted-foreground max-w-2xl">Centered description</p></div>
```
```
<div className="flex flex-col items-center justify-center text-center">  <h1 className="text-4xl font-bold mb-4">Centered Title</h1>  <p className="text-muted-foreground max-w-2xl">Centered description</p></div>
```
```
// Lift on hover<div className="transition-transform hover:scale-105">// Shadow on hover<div className="transition-shadow hover:shadow-lg">// Color change on hover<button className="transition-colors hover:bg-primary/90">
```
```
// Lift on hover<div className="transition-transform hover:scale-105">// Shadow on hover<div className="transition-shadow hover:shadow-lg">// Color change on hover<button className="transition-colors hover:bg-primary/90">
```
```
bg-card
```
```
text-foreground
```
```
base → sm: → md:
```
```
transition-*
```
```
bg-blue-500
```
```
text-base
```
```
text-[16px]
```
```
templates/components/
```
```
references/
```
```
// DON'T - Breaks dark mode<div className="bg-white text-gray-900 border-gray-200">  <p className="text-gray-600">Content</p>  <button className="bg-blue-500 text-white">Click</button></div>
```
```
// DON'T - Breaks dark mode<div className="bg-white text-gray-900 border-gray-200">  <p className="text-gray-600">Content</p>  <button className="bg-blue-500 text-white">Click</button></div>
```
```
// DO - Works in both light and dark mode<div className="bg-card text-card-foreground border-border">  <p className="text-muted-foreground">Content</p>  <button className="bg-primary text-primary-foreground">Click</button></div>
```
```
// DO - Works in both light and dark mode<div className="bg-card text-card-foreground border-border">  <p className="text-muted-foreground">Content</p>  <button className="bg-primary text-primary-foreground">Click</button></div>
```
```
bg-blue-500
```
```
bg-primary
```
```
text-foreground
```
```
// DON'T - Fixed sizes, no breakpoints<h1 className="text-6xl">Title</h1><div className="grid grid-cols-3 gap-6">  {items.map(item => <Card key={item.id} />)}</div>
```
```
// DON'T - Fixed sizes, no breakpoints<h1 className="text-6xl">Title</h1><div className="grid grid-cols-3 gap-6">  {items.map(item => <Card key={item.id} />)}</div>
```
```
// DO - Scales from mobile to desktop<h1 className="text-4xl sm:text-5xl lg:text-6xl">Title</h1><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">  {items.map(item => <Card key={item.id} />)}</div>
```
```
// DO - Scales from mobile to desktop<h1 className="text-4xl sm:text-5xl lg:text-6xl">Title</h1><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">  {items.map(item => <Card key={item.id} />)}</div>
```
```
// DON'T - Inconsistent spacing<div className="p-5 mb-7 gap-3">  <div className="mt-9 mb-11">Content</div></div>
```
```
// DON'T - Inconsistent spacing<div className="p-5 mb-7 gap-3">  <div className="mt-9 mb-11">Content</div></div>
```
```
// DO - Use scale of 4, 6, 8, 12, 16, 24<div className="p-6 mb-8 gap-4">  <div className="mt-8 mb-12">Content</div></div>
```
```
// DO - Use scale of 4, 6, 8, 12, 16, 24<div className="p-6 mb-8 gap-4">  <div className="mt-8 mb-12">Content</div></div>
```
```
// DON'T - No hover feedback<button className="bg-primary text-primary-foreground px-4 py-2 rounded-md">  Click</button><a href="#" className="text-primary">  Link</a>
```
```
// DON'T - No hover feedback<button className="bg-primary text-primary-foreground px-4 py-2 rounded-md">  Click</button><a href="#" className="text-primary">  Link</a>
```
```
// DO - Hover and focus states<button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors focus:ring-2 focus:ring-primary">  Click</button><a href="#" className="text-primary hover:underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-primary">  Link</a>
```
```
// DO - Hover and focus states<button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors focus:ring-2 focus:ring-primary">  Click</button><a href="#" className="text-primary hover:underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-primary">  Link</a>
```
```
min-w-0
```
```
// DON'T - Text overflows into adjacent cells<div className="grid grid-cols-3">  <div>Very long text that overflows...</div></div>
```
```
// DON'T - Text overflows into adjacent cells<div className="grid grid-cols-3">  <div>Very long text that overflows...</div></div>
```
```
min-w-0
```
```
truncate
```
```
// DO - Truncate with ellipsis<div className="grid grid-cols-3">  <div className="min-w-0">    <span className="truncate" title="Full text here">      Very long text that overflows...    </span>  </div></div>
```
```
// DO - Truncate with ellipsis<div className="grid grid-cols-3">  <div className="min-w-0">    <span className="truncate" title="Full text here">      Very long text that overflows...    </span>  </div></div>
```
```
min-width: auto
```
```
dark:
```
```
// DON'T - Defeats purpose of semantic tokens<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">  <p className="text-gray-600 dark:text-gray-300">Content</p></div>
```
```
// DON'T - Defeats purpose of semantic tokens<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">  <p className="text-gray-600 dark:text-gray-300">Content</p></div>
```
```
// DO - Automatically adapts<div className="bg-card text-card-foreground">  <p className="text-muted-foreground">Content</p></div>
```
```
// DO - Automatically adapts<div className="bg-card text-card-foreground">  <p className="text-muted-foreground">Content</p></div>
```
```
dark:
```
```
// DON'T - Missing responsive padding<div className="max-w-7xl mx-auto">  <h1>Title</h1></div>
```
```
// DON'T - Missing responsive padding<div className="max-w-7xl mx-auto">  <h1>Title</h1></div>
```
```
// DO - Standard container with padding<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">  <h1>Title</h1></div>
```
```
// DO - Standard container with padding<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">  <h1>Title</h1></div>
```
```
// DON'T - Not responsive, not accessible<p className="text-[16px]">Content</p><h1 className="text-[48px]">Title</h1>
```
```
// DON'T - Not responsive, not accessible<p className="text-[16px]">Content</p><h1 className="text-[48px]">Title</h1>
```
```
// DO - Responsive and scalable<p className="text-base">Content</p><h1 className="text-4xl sm:text-5xl lg:text-6xl">Title</h1>
```
```
// DO - Responsive and scalable<p className="text-base">Content</p><h1 className="text-4xl sm:text-5xl lg:text-6xl">Title</h1>
```
```
// DON'T - Too small for mobile<button className="px-2 py-1 text-xs">  Click</button>
```
```
// DON'T - Too small for mobile<button className="px-2 py-1 text-xs">  Click</button>
```
```
// DO - Mobile-friendly sizing<button className="px-4 py-2 text-sm">  Click</button>// Icon-only buttons need explicit sizing<button className="h-10 w-10 flex items-center justify-center">  <svg className="h-5 w-5">Icon</svg></button>
```
```
// DO - Mobile-friendly sizing<button className="px-4 py-2 text-sm">  Click</button>// Icon-only buttons need explicit sizing<button className="h-10 w-10 flex items-center justify-center">  <svg className="h-5 w-5">Icon</svg></button>
```
```
// DON'T - Unmaintainable stacking<div className="z-[999]">Modal</div><div className="z-[100]">Header</div><div className="z-[9999]">Tooltip</div>
```
```
// DON'T - Unmaintainable stacking<div className="z-[999]">Modal</div><div className="z-[100]">Header</div><div className="z-[9999]">Tooltip</div>
```
```
// DO - Organized layers (increments of 10)<div className="z-0">Background</div><div className="z-10">Content</div><div className="z-20">Dropdowns</div><div className="z-40">Fixed header</div><div className="z-50">Modals</div><div className="z-[60]">Tooltips</div>
```
```
// DO - Organized layers (increments of 10)<div className="z-0">Background</div><div className="z-10">Content</div><div className="z-20">Dropdowns</div><div className="z-40">Fixed header</div><div className="z-50">Modals</div><div className="z-[60]">Tooltips</div>
```
```
// DON'T - No indication of error<input  type="email"  className="w-full px-3 py-2 bg-background border border-border rounded-md"/><p className="text-sm">Invalid email</p>
```
```
// DON'T - No indication of error<input  type="email"  className="w-full px-3 py-2 bg-background border border-border rounded-md"/><p className="text-sm">Invalid email</p>
```
```
// DO - Visual error indicators<input  type="email"  className="w-full px-3 py-2 bg-background border border-destructive rounded-md focus:ring-2 focus:ring-destructive"  aria-invalid="true"  aria-describedby="email-error"/><p id="email-error" className="text-sm text-destructive">  Invalid email address</p>
```
```
// DO - Visual error indicators<input  type="email"  className="w-full px-3 py-2 bg-background border border-destructive rounded-md focus:ring-2 focus:ring-destructive"  aria-invalid="true"  aria-describedby="email-error"/><p id="email-error" className="text-sm text-destructive">  Invalid email address</p>
```
```
// DON'T - Images cause layout shift<img src="/image.jpg" alt="" className="w-full" />
```
```
// DON'T - Images cause layout shift<img src="/image.jpg" alt="" className="w-full" />
```
```
// DO - Maintain consistent aspect ratio<div className="aspect-video">  <img src="/image.jpg" alt="" className="w-full h-full object-cover" /></div>// Or for square images<div className="aspect-square">  <img src="/image.jpg" alt="" className="w-full h-full object-cover" /></div>
```
```
// DO - Maintain consistent aspect ratio<div className="aspect-video">  <img src="/image.jpg" alt="" className="w-full h-full object-cover" /></div>// Or for square images<div className="aspect-square">  <img src="/image.jpg" alt="" className="w-full h-full object-cover" /></div>
```
```
// DON'T - Causes reflow (janky)<div className="transition-all hover:w-64 hover:h-64 hover:top-10 hover:left-10">  Content</div>
```
```
// DON'T - Causes reflow (janky)<div className="transition-all hover:w-64 hover:h-64 hover:top-10 hover:left-10">  Content</div>
```
```
// DO - GPU-accelerated (smooth)<div className="transition-transform hover:scale-105">  Content</div><div className="transition-opacity hover:opacity-80">  Content</div>
```
```
// DO - GPU-accelerated (smooth)<div className="transition-transform hover:scale-105">  Content</div><div className="transition-opacity hover:opacity-80">  Content</div>
```
Elevate your frontend development workflow with this powerful AI agent skill, specifically designed to accelerate your use of Tailwind CSS. It provides a curated collection of production-ready component patterns, helping you maintain design consistency and reduce repetitive coding. Whether you're building a new application from scratch or integrating new features into an existing project, this skill offers practical, ready-to-use snippets for common UI elements. Leverage best practices and proven patterns to craft beautiful, responsive interfaces more efficiently, allowing you to focus on core functionality rather than granular styling.

# When to Use This Skill
- •Rapidly prototyping new web applications with consistent UI elements.
- •Building a design system or component library using Tailwind CSS best practices.
- •Ensuring uniform spacing, layout, and visual harmony across different sections of a website.
- •Quickly generating common UI elements like cards, buttons, and responsive grid layouts for various projects.

# Pro Tips
- 💡Combine these patterns with a headless UI library (e.g., Radix UI, Headless UI) for robust accessibility and interactivity, allowing Tailwind to focus purely on styling.
- 💡Customize your base Tailwind configuration to match your brand's specific color, font, and spacing scales, making these patterns even more tailored to your project.
- 💡Utilize the consistent spacing scale guidelines provided within the skill to maintain visual harmony and prevent design drift across your entire application.

