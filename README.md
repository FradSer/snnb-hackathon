# SNNB Hackathon Project

A modern web application built with Next.js for the SNNB Hackathon.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org) 14 (App Router)
- **Styling:** Tailwind CSS
- **Font:** [Geist](https://vercel.com/font)
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- npm, yarn, or pnpm

### Development

1. Clone the repository
```bash
git clone [your-repo-url]
cd snnb-hackathon
```

2. Install dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
snnb-hackathon/
├── app/                # Next.js app directory
├── components/         # React components
├── public/            # Static assets
├── styles/           # Global styles
└── ...
```

## Development Guidelines

- The application uses the Next.js App Router
- Components are organized in the `components` directory
- Pages are defined in the `app` directory following Next.js 14 conventions

## Deployment

The project is configured for deployment on [Vercel](https://vercel.com). For deployment:

1. Push your changes to the main branch
2. Vercel will automatically deploy your updates

For other deployment options, refer to the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

[MIT](LICENSE)