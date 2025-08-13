# Convex + Vercel Deployment Guide

This guide covers deploying the personality quiz app with Convex backend and Next.js frontend on Vercel.

## Prerequisites

1. **Convex Account**: Sign up at [convex.dev](https://convex.dev)
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **GitHub Repository**: Code should be in a GitHub repo

## Step 1: Initialize Convex

```bash
# If not already done
npm install convex
npx convex dev
```

This will:
- Prompt you to log in with GitHub
- Create a new Convex project
- Generate `NEXT_PUBLIC_CONVEX_URL` in `.env.local`

## Step 2: Seed the Database

Run the seed function to populate your Convex database:

```bash
npx convex run seedData:seedDatabase
```

This will create:
- 1 quiz with 4 sections
- 24 questions (6 per section)
- 3 personality types (sample)
- 2 scrum roles

## Step 3: Deploy to Vercel

### Option A: Vercel CLI
```bash
npm install -g vercel
vercel --prod
```

### Option B: Vercel Dashboard
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure build settings (see below)

## Step 4: Configure Build Settings

In Vercel, override the build command:
```bash
npx convex deploy --cmd 'npm run build'
```

This ensures Convex functions are deployed alongside your frontend.

## Step 5: Environment Variables

In Vercel, add these environment variables:

### Required for Production:
- `NEXT_PUBLIC_CONVEX_URL` - Get from Convex dashboard
- `CONVEX_DEPLOY_KEY` - Generate in Convex dashboard → Settings
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - From Clerk dashboard
- `CLERK_SECRET_KEY` - From Clerk dashboard
- `NEXT_PUBLIC_BASE_URL` - Your Vercel domain

### Generate Convex Deploy Key:
1. Go to [Convex Dashboard](https://dashboard.convex.dev)
2. Select your project
3. Go to Settings → Deploy Keys
4. Click "Generate Production Deploy Key"
5. Copy and add to Vercel as `CONVEX_DEPLOY_KEY`

## Step 6: Configure Webhooks (Optional)

For preview deployments with separate Convex backends:

1. In Vercel → Settings → Git
2. Enable "Preview Deployments" 
3. Convex will automatically create preview backends for each branch

## Step 7: Domain Setup

1. In Vercel → Settings → Domains
2. Add your custom domain
3. Update `NEXT_PUBLIC_BASE_URL` environment variable

## Deployment Commands Summary

```bash
# Local development
npx convex dev
npm run dev

# Deploy to production
npx convex deploy --cmd 'npm run build'

# Or deploy separately
npx convex deploy
vercel --prod
```

## Troubleshooting

### Common Issues:

1. **Build fails with Convex error**:
   - Ensure `CONVEX_DEPLOY_KEY` is set in Vercel
   - Check that schema is valid: `npx convex run`

2. **Environment variables not working**:
   - Redeploy after adding new environment variables
   - Check variable names match exactly

3. **Database empty**:
   - Run seed script: `npx convex run seedData:seedDatabase`
   - Check Convex dashboard for data

4. **Authentication issues**:
   - Verify Clerk keys are correct
   - Check domain settings in Clerk dashboard

## Monitoring

- **Convex Dashboard**: Monitor function calls, database usage
- **Vercel Analytics**: Track performance and usage
- **Error Tracking**: Check Vercel function logs

## Auto-Deployment

Once configured, every push to main branch will:
1. Deploy Convex functions
2. Build and deploy Next.js app
3. Update production environment

Preview deployments get their own Convex backend for isolation.

## Performance Tips

1. **Preload queries** for better UX:
   ```typescript
   import { preloadQuery } from "convex/nextjs";
   const preloaded = await preloadQuery(api.quiz.getQuiz);
   ```

2. **Optimize bundle**: Convex client is automatically tree-shaken

3. **Caching**: Convex handles caching automatically

## Security

- Deploy keys have limited scope
- API is automatically secured
- CORS is handled by Convex
- Rate limiting available in Convex Pro

---

For more details, see:
- [Convex + Vercel Guide](https://docs.convex.dev/production/hosting/vercel)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)