This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

### Libs 
- [shadcn/ui](https://ui.shadcn.com/docs/cli)

### Develop 
- Create the app
    - `npx create-next-app@latest`

- Set up
    - VSCode Plugin: Tailwind CSS IntelliSense
    - VSCode Plugin: Prisma.prisma
    - `npx shadcn@latest init`
    - `npx shadcn@latest add button`
    - `npx shadcn@latest add skeleton`
    - `npx shadcn@latest add accordion`
    - `npx shadcn@latest add separator`
    - `npx shadcn@latest add sheet`
    - `npm install usehooks-ts`
    - `npm install zustand`
    - `npm install zod`
    - `npm install -D prisma`
    - `npm install @prisma/client`
    - `npx prisma init`
    - `npx prisma studio`
    - `npx prisma generate`
    - `npx prisma db push`

- Third party services
    - [Planetscale](https://planetscale.com/)
    - [Dashboard Clerk](https://dashboard.clerk.com/)
    - `npm install @clerk/nextjs`

### Docker Admin
- docker-compose up mariadb 
- docker-compose up sqlserver 
- sqlserver://sa:pass@l27.0.0.1:1433;database=AppDB;trustServerCertificate=true;encrypt=DANGER_PLAINTEXT
- sqlserver://sa:pass@localhost:1433;database=AppDB;trustServerCertificate=true;encrypt=DANGER_PLAINTEXT

### Key Features:
- Auth 
- Organizations / Workspaces
- Board creation
- Unsplash API for random beautiful cover images
- Activity log for entire organization
- Board rename and delete
- List creation
- List rename, delete, drag & drop reorder and copy
- Card creation
- Card description, rename, delete, drag & drop reorder and copy
- Card activity log
- Board limit for every organization
- Stripe subscription for each organization to unlock unlimited boards
- Landing page
- MySQL DB
- Prisma ORM
- shadcnUI & TailwindCSS

## Clerk & Auth
[![clerk.dashboard.overview](./rsc/clerk.dashboard.overview.jpg)](https://dashboard.clerk.com/)
[![clerk.dashboard.org](./rsc/clerk.dashboard.org.jpg)](https://clerk.com/docs/references/nextjs/custom-signup-signin-pages)


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## References
- [Next.js: Getting started](https://nextjs.org/docs/getting-started/installation)
- [Next.js: Fast Refresh](https://nextjs.org/docs/architecture/fast-refresh)
- [Next.js: Server-side form validation](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#server-side-form-validation)
- [Next.js: Fetching data on the server with the fetch API](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#fetching-data-on-the-server-with-the-fetch-api)
- [Auth & Clerk Middlewares](https://clerk.com/docs/references/nextjs/clerk-middleware)
- [Auth & Clerk + Next.js](https://clerk.com/docs/quickstarts/nextjs)
- [Auth & Clerk & User Management Platform](https://clerk.com/)
- [Auth & Build your own sign-in and sign-up pages for your Next.js app with Clerk](https://clerk.com/docs/references/nextjs/custom-signup-signin-pages)
- [UI: Shadcn & Dark Mode](https://ui.shadcn.com/docs/dark-mode/next)
- [UI: Grid and Dot Backgrounds](https://ui.aceternity.com/components/grid-and-dot-backgrounds)
- [UI: Google fonts](https://fonts.google.com/)
- [UI: SVG Repo](https://www.svgrepo.com/collections/multicolor/13)
- [UseHooks: Getting started](https://usehooks-ts.com/introduction)
- [The Perils of Hydration](https://www.joshwcomeau.com/react/the-perils-of-rehydration/)
- [Fullstack Trello Clone: Next.js 14, Server Actions, React, Prisma, Stripe, Tailwind, MySQL](https://www.youtube.com/watch?v=pRybm9lXW2c)
- [Download and install Azure Data Studio](https://learn.microsoft.com/en-us/azure-data-studio/download-azure-data-studio?tabs=win-install%2Cwin-user-install%2Credhat-install%2Cwindows-uninstall%2Credhat-uninstall)
- [Build and Deploy an Amazing Developer Portfolio with Next JS and Framer Motion](https://www.youtube.com/watch?v=FTH6Dn3AyIQ)
- [Learn React 18 with Redux Toolkit – Full Tutorial for Beginners](https://www.youtube.com/watch?v=2-crBg6wpp0)
- [EASY Authentication with Firebase & Next.JS 18 (Latest)](https://www.youtube.com/watch?v=qb2Ug9Yoatg)
- [Build admin panel template from scratch | Next js And Tailwind CSS Episode 01](https://www.youtube.com/watch?v=8asf9zF-jbg&list=PLUX0GmrifrwenUM6pdfQdzKk1OZnc2_GG)
- [Todo App using Next.js 14 Server Actions](https://www.youtube.com/watch?v=_RshYUBc8oA)
- [Build a Full Stack CRUD Todo App with Next.js 14, MongoDB, and Prisma](https://www.youtube.com/watch?v=9OoKXOq7ENo)


### Error & Fix

1. Error: Invalid src prop  
    ![error.image](./rsc/next.error.image.jpg)
    Update the following config file and restart the server
    ```js
    // ./next.config.mjs
    const nextConfig = {
        images: {
            remotePatterns: [
                {
                    protocol: "https",
                    hostname: "img.clerk.com"
                }
            ]
        }
    };
    ```

