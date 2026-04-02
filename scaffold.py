import os
import shutil

# Move files from src to root
if os.path.exists('src/index.html'):
    shutil.move('src/index.html', 'index.html')
if os.path.exists('src/tailwind.config.ts'):
    shutil.move('src/tailwind.config.ts', 'tailwind.config.ts')

# Delete old jsx files
if os.path.exists('src/App.jsx'):
    os.remove('src/App.jsx')
if os.path.exists('src/main.jsx'):
    os.remove('src/main.jsx')

# Create necessary config files
with open('postcss.config.js', 'w', encoding='utf-8') as f:
    f.write('export default { plugins: { tailwindcss: {}, autoprefixer: {}, }, }\n')

with open('tsconfig.json', 'w', encoding='utf-8') as f:
    f.write('''{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}\n''')

with open('tsconfig.node.json', 'w', encoding='utf-8') as f:
    f.write('''{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}\n''')

with open('vite.config.ts', 'w', encoding='utf-8') as f:
    f.write('''import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});\n''')

if os.path.exists('vite.config.js'):
    os.remove('vite.config.js')

# Create empty UI components
os.makedirs('src/components/ui', exist_ok=True)
with open('src/components/ui/button.tsx', 'w', encoding='utf-8') as f:
    f.write('''import React from 'react';
export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string, size?: string }>(
  ({ className, variant, size, ...props }, ref) => {
    return <button ref={ref} className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 ${className || ''}`} {...props} />;
  }
);
Button.displayName = "Button";\n''')

with open('src/components/ui/sonner.tsx', 'w', encoding='utf-8') as f:
    f.write('''export const Toaster = () => null;\n''')

with open('src/components/ui/toaster.tsx', 'w', encoding='utf-8') as f:
    f.write('''export const Toaster = () => null;\n''')

with open('src/components/ui/tooltip.tsx', 'w', encoding='utf-8') as f:
    f.write('''export const TooltipProvider = ({ children }: any) => <>{children}</>;\n''')

print("Scaffold complete.", flush=True)
