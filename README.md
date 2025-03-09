# SNNB HACKATHON - A Cyberpunk Experience

A Next.js and React Three Fiber (R3F) application that showcases a cyberpunk-themed 3D experience.

## Project Structure

This project follows best practices for organizing Next.js and React Three Fiber code:

```
/
├── app/                     # Next.js App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   ├── globals.css          # Global styles
│   ├── favicon.ico          # Favicon
├── components/              # All components
│   ├── layout/              # Layout components
│   ├── ui/                  # UI components
│   ├── scenes/              # 3D scene components
│   ├── models/              # 3D model components
│   ├── effects/             # Post-processing effects
│   └── environment/         # Environment components
├── hooks/                   # Custom React hooks
├── lib/                     # Utility functions
├── constants/               # Project constants
└── public/                  # Static assets
    ├── environment/         # Environment maps
    ├── music/               # Audio files
    ├── textures/            # Texture files
    └── fonts/               # Font files
```

## Best Practices

This project adheres to the following best practices:

1. **Component Organization**: Components are organized by functionality rather than by technology (DOM vs Canvas).

2. **Code Separation**: Logic is separated into appropriate directories (hooks, utils, constants) for better maintainability.

3. **Type Safety**: TypeScript is used throughout the project for better type safety and developer experience.

4. **Performance Optimization**: 
   - Server Components are used where possible
   - Client Components are clearly marked with "use client"
   - Assets are properly optimized
   - Three.js objects are properly disposed

5. **Documentation**: Code is well-documented with comments explaining the purpose and functionality.

## Development

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npm run build

# Start the production server
npm start
```

## Technologies

- Next.js
- React Three Fiber (R3F)
- React Three Drei
- Three.js
- TypeScript
- TailwindCSS

## License

MIT