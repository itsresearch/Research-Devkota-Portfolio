/**
 * One-time script to insert the GitHub Pages hosting blog post into Supabase.
 * Run with:  bun scripts/insert-blog-github-pages.mjs
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL      = process.env.VITE_SUPABASE_URL      || 'https://dyzswpehmsrolqjrgxyy.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_hJgEugg0Szn4piEVPToWcQ_jFkBd_B2';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const post = {
  title:           'Host Your Portfolio for Free: GitHub Pages + Cloudflare + Custom Domain (Step-by-Step)',
  slug:            'host-portfolio-free-github-pages-cloudflare-custom-domain',
  excerpt:         'Learn how to host your portfolio or project website completely free using GitHub Pages, secure it with Cloudflare, and connect a custom domain (including a free .com.np domain) in this detailed step-by-step guide.',
  cover_image_url: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1200&h=630&fit=crop',
  category:        'DevOps',
  tags:            ['GitHub Pages', 'Cloudflare', 'Hosting', 'Custom Domain', 'Portfolio', 'Free Hosting', 'Nepal'],
  status:          'published',
  featured:        true,
  published_at:    '2026-09-21',
  reading_time:    12,
  external_url:    '',
  meta_title:      'Host Portfolio Free: GitHub Pages + Cloudflare + Custom Domain (2025)',
  meta_description:'Step-by-step guide to host your portfolio or project for free using GitHub Pages, add Cloudflare CDN & SSL, and connect a custom domain including a free .com.np domain.',
  canonical_url:   '',
  og_image_url:    'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1200&h=630&fit=crop',
  focus_keyword:   'host portfolio free GitHub Pages Cloudflare',
  content: `## Introduction

Building a portfolio or project is just half the battle — the other half is **getting it live on the internet** so the world can see your work. The good news? You can do it **100% free** using a powerful combination of:

- 🐙 **GitHub Pages** — free static site hosting directly from your repository
- ☁️ **Cloudflare** — free CDN, SSL/HTTPS, DDoS protection, and DNS management
- 🌐 **Custom Domain** — your own domain (like \`yourname.com.np\`) instead of the default GitHub URL

By the end of this guide, your site will be live at your own domain, secured with HTTPS, and blazing fast thanks to Cloudflare's global network — all at **zero cost**.

> 💡 Don't have a custom domain yet? Read our guide on **[How to Get a Free .com.np Domain in Nepal](/blog/how-to-get-free-com-np-domain-nepal)** to claim your free Nepali domain before proceeding!

---

## What is GitHub Pages?

**GitHub Pages** is a free static site hosting service provided by GitHub. It serves HTML, CSS, and JavaScript files directly from a GitHub repository. It supports:

- Plain HTML/CSS/JS websites
- React, Vue, Angular builds (after you export the static files)
- Jekyll static site generator (natively)
- Any framework that produces a static \`/dist\` or \`/build\` output

**What you get for free:**
- Unlimited public repositories hosted
- 1 GB storage per site
- 100 GB/month bandwidth
- Automatic HTTPS on \`github.io\` subdomains
- Custom domain support

---

## What is Cloudflare (Free Plan)?

**Cloudflare** acts as a reverse proxy between your visitors and GitHub Pages. Even on the free plan you get:

- 🔒 **Free SSL/TLS certificate** (HTTPS) for your custom domain
- ⚡ **Global CDN** — your site is cached across 300+ data centres worldwide
- 🛡️ **DDoS protection** — Cloudflare absorbs attacks automatically
- 📊 **Analytics** — see traffic, requests, and threats
- 🔧 **DNS management** — fast and reliable nameservers
- 🔄 **Page Rules** — redirects, caching rules, and more

---

## Overview of the Full Setup

Here's the big picture before we dive in:

\`\`\`
Your Code (GitHub Repo)
        ↓
  GitHub Pages
  (hosts the files)
        ↓
   Cloudflare
   (CDN + SSL + DNS)
        ↓
  Your Custom Domain
  (yourname.com.np)
        ↓
   Your Visitors
\`\`\`

---

## Part 1: Prepare Your Project on GitHub

### Step 1.1: Create a GitHub Account

If you don't already have one, go to [github.com](https://github.com) and sign up for a **free account**.

---

### Step 1.2: Create a Repository

1. Click the **"+"** icon in the top-right corner → **New repository**
2. Name your repository:
   - For a **personal/portfolio site**: name it \`<your-username>.github.io\`
     - Example: \`roshandevkota.github.io\`
     - This gives you the URL: \`https://roshandevkota.github.io\`
   - For a **project site**: name it anything (e.g., \`my-portfolio\`)
     - This gives you the URL: \`https://roshandevkota.github.io/my-portfolio\`
3. Set visibility to **Public** (required for free GitHub Pages)
4. Check **"Add a README file"** (optional but good practice)
5. Click **"Create repository"**

---

### Step 1.3: Push Your Project Files

#### Option A — New project (using Git)

\`\`\`bash
# Initialize git in your project folder
git init

# Add your remote repository
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git

# Stage all files
git add .

# Commit
git commit -m "Initial commit"

# Push to GitHub
git push -u origin main
\`\`\`

#### Option B — Upload via GitHub UI

1. Open your repository on GitHub
2. Click **"uploading an existing file"** or drag-and-drop your files
3. Scroll down and click **"Commit changes"**

---

### Step 1.4: Build Your Static Files (React/Vue/Angular)

If you're using a JavaScript framework, you need to **build** it first to generate static files.

**For React (Vite or CRA):**
\`\`\`bash
npm run build
# Output: /dist or /build folder
\`\`\`

**For Vue:**
\`\`\`bash
npm run build
# Output: /dist folder
\`\`\`

**For Next.js (static export):**
\`\`\`bash
npm run build && npm run export
# Output: /out folder
\`\`\`

> The built folder (\`/dist\`, \`/build\`, or \`/out\`) contains your static site — these are the files GitHub Pages will serve.

---

## Part 2: Set Up GitHub Pages

### Step 2.1: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **"Settings"** (top menu)
3. In the left sidebar, click **"Pages"**
4. Under **"Build and deployment"**:
   - **Source**: Select **"Deploy from a branch"**
   - **Branch**: Select \`main\` (or \`gh-pages\` if you use that)
   - **Folder**: Select \`/ (root)\` if your HTML is at the root, or \`/docs\` if inside a docs folder
5. Click **"Save"**

GitHub will show you your site URL:
\`https://YOUR-USERNAME.github.io/\` or \`https://YOUR-USERNAME.github.io/REPO-NAME/\`

> ⏳ It may take **1–3 minutes** for your site to go live after enabling Pages.

---

### Step 2.2: Automate Deployment with GitHub Actions (Recommended)

For React/Vue projects, manually uploading the build output is tedious. Use GitHub Actions to **auto-build and deploy** on every push.

Create the file \`.github/workflows/deploy.yml\` in your project:

\`\`\`yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main  # Trigger on push to main branch

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build project
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'   # Change to 'build' or 'out' based on your framework

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
\`\`\`

After adding this file and pushing to \`main\`:
1. Go to your repo → **Actions** tab
2. You'll see the workflow running
3. Once complete, your site is live!

> ⚙️ In **Settings → Pages**, change the Source to **"GitHub Actions"** to use this workflow.

---

### Step 2.3: Fix Routing for Single-Page Applications (SPA)

If you have a React Router or Vue Router, refreshing on any non-root page (e.g., \`/about\`) will show a **404 error** because GitHub Pages doesn't know about client-side routing.

**Fix:** Add a \`404.html\` file that redirects to your \`index.html\`:

Create \`public/404.html\` with this content:

\`\`\`html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Redirecting...</title>
    <script>
      // Redirect all 404s back to index.html for SPA routing
      const path = window.location.pathname;
      window.location.replace('/?redirect=' + encodeURIComponent(path));
    </script>
  </head>
  <body></body>
</html>
\`\`\`

And add this to your \`index.html\` \`<head>\`:

\`\`\`html
<script>
  // Handle redirect from 404.html
  const redirect = new URLSearchParams(window.location.search).get('redirect');
  if (redirect) {
    window.history.replaceState(null, '', redirect);
  }
</script>
\`\`\`

---

## Part 3: Set Up Cloudflare

### Step 3.1: Create a Free Cloudflare Account

1. Go to [cloudflare.com](https://cloudflare.com)
2. Click **"Sign Up"** → Choose **Free plan**
3. Enter your email and create a password
4. Verify your email address

---

### Step 3.2: Add Your Domain to Cloudflare

1. After logging in, click **"Add a Site"**
2. Enter your domain name (e.g., \`yourname.com.np\`) and click **"Add Site"**
3. Select the **Free plan** → click **"Continue"**
4. Cloudflare will scan your existing DNS records — review them (keep any existing ones)
5. Click **"Continue"**

---

### Step 3.3: Update Your Nameservers

Cloudflare will give you **two nameservers** that look like:

\`\`\`
ns1.cloudflare.com
ns2.cloudflare.com
\`\`\`

(Your actual nameservers will have different subdomain prefixes, e.g., \`ada.ns.cloudflare.com\`)

**For .com.np domains (register.com.np):**
1. Log in to [register.com.np](https://register.com.np)
2. Click on your domain → **"Edit DNS"** or **"Nameservers"**
3. Replace the existing nameservers with the **Cloudflare nameservers** provided
4. Save the changes

> ⏳ Nameserver propagation takes **24–48 hours** worldwide, but often completes within a few hours.

---

### Step 3.4: Add DNS Records in Cloudflare

Once your domain is on Cloudflare, you need to add DNS records pointing to GitHub Pages.

1. In Cloudflare, go to your domain → **DNS → Records**
2. Click **"Add record"** and add the following **CNAME record**:

| Type | Name | Content | Proxy |
|---|---|---|---|
| CNAME | \`@\` (root) | \`YOUR-USERNAME.github.io\` | 🟠 Proxied |
| CNAME | \`www\` | \`YOUR-USERNAME.github.io\` | 🟠 Proxied |

> **Proxied (orange cloud)** = Traffic goes through Cloudflare (CDN + SSL + protection). This is what you want.

**For the root domain (\`@\`), some registrars don't allow CNAME.** In that case, use **CNAME Flattening** — Cloudflare handles this automatically when you set \`@\` as the name.

---

### Step 3.5: Configure SSL/TLS in Cloudflare

1. In Cloudflare dashboard → click **SSL/TLS** (left sidebar)
2. Under **"Overview"**, set the encryption mode to **"Full"**

| Mode | When to Use |
|---|---|
| Off | Never — insecure |
| Flexible | Not recommended — only encrypts browser→Cloudflare |
| **Full** | ✅ Recommended for GitHub Pages |
| Full (Strict) | When you have your own SSL on the server |

> GitHub Pages provides its own SSL certificate for the \`github.io\` domain. Setting Cloudflare to **"Full"** means both connections (browser↔Cloudflare and Cloudflare↔GitHub) are encrypted.

---

### Step 3.6: Enable "Always Use HTTPS"

1. Go to **SSL/TLS → Edge Certificates**
2. Turn on **"Always Use HTTPS"** toggle
3. Turn on **"Automatic HTTPS Rewrites"**

This ensures visitors who type \`http://yourname.com.np\` are automatically redirected to \`https://yourname.com.np\`.

---

### Step 3.7 (Optional): Add Performance & Security Settings

While in Cloudflare, take a minute to enable these free features:

**Speed → Optimization:**
- Enable **"Auto Minify"** — minifies HTML, CSS, JS
- Enable **"Brotli compression"**

**Caching → Configuration:**
- Set **"Browser Cache TTL"** to **4 hours** (or longer for static sites)
- Click **"Purge Cache"** whenever you deploy new changes

**Security → Settings:**
- Set **"Security Level"** to **Medium**
- Enable **"Bot Fight Mode"**

---

## Part 4: Connect Your Custom Domain to GitHub Pages

### Step 4.1: Add Custom Domain in GitHub

1. Go to your GitHub repository → **Settings → Pages**
2. Under **"Custom domain"**, type your domain: \`yourname.com.np\`
3. Click **"Save"**
4. GitHub will create a \`CNAME\` file in your repository root with your domain name

> If you use GitHub Actions for deployment, add a step to preserve the CNAME file in the build output (see below).

---

### Step 4.2: Preserve CNAME in GitHub Actions Build

If you use automated deployment with GitHub Actions, the CNAME file may get overwritten. Add this to your deploy workflow:

\`\`\`yaml
      - name: Build project
        run: npm run build

      # Add this step to preserve your custom domain
      - name: Add CNAME file
        run: echo "yourname.com.np" > ./dist/CNAME

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
\`\`\`

---

### Step 4.3: Enforce HTTPS on GitHub

1. Go to repository **Settings → Pages**
2. After adding your custom domain, wait a few minutes
3. Check the **"Enforce HTTPS"** checkbox — this becomes available once GitHub verifies your domain's SSL certificate

---

## Part 5: Verify Everything Works

### Verification Checklist

✅ Visit \`https://yourname.com.np\` — your site should load  
✅ Visit \`http://yourname.com.np\` — should redirect to HTTPS  
✅ Visit \`https://www.yourname.com.np\` — should also work  
✅ Check the padlock 🔒 icon in the browser — SSL is working  
✅ In Cloudflare → **Analytics** — you should see traffic  

### Test DNS Propagation

Use these free tools to check if your DNS has propagated:
- [dnschecker.org](https://dnschecker.org) — check global DNS propagation
- [whatsmydns.net](https://whatsmydns.net) — check CNAME records worldwide

---

## Troubleshooting Common Issues

### ❌ Site shows "404 - There isn't a GitHub Pages site here"
**Fix:** Make sure GitHub Pages is enabled in Settings → Pages, and the correct branch/folder is selected. Wait 5 minutes after enabling.

### ❌ "Your site is not secure" (SSL error)
**Fix:** Set Cloudflare SSL mode to **"Full"** (not Flexible). If the issue persists, disable Cloudflare proxy temporarily (grey cloud) and wait for GitHub to issue a certificate, then re-enable.

### ❌ Custom domain not working
**Fix:** Check that:
1. The CNAME file exists in your repo root with your domain
2. DNS records in Cloudflare point to \`YOUR-USERNAME.github.io\`
3. Nameservers at register.com.np are updated to Cloudflare's nameservers
4. 48 hours have passed for DNS propagation

### ❌ React Router shows 404 on refresh
**Fix:** Add the \`404.html\` redirect trick described in Step 2.3.

### ❌ Changes not showing (cached old version)
**Fix:** In Cloudflare → **Caching → Purge Cache → Purge Everything** after each deployment.

---

## Bonus: Set Up a Redirect from www to non-www (or vice versa)

In Cloudflare → **Rules → Redirect Rules**:

1. Click **"Create Rule"**
2. Set condition: **Hostname equals** \`www.yourname.com.np\`
3. Set action: **Static Redirect** → \`https://yourname.com.np\`
4. Status: **301 Permanent**
5. Save

This ensures all \`www\` traffic cleanly redirects to your apex domain.

---

## Complete Setup Summary

Here's a quick-reference table of everything you've configured:

| Service | What You Did | Cost |
|---|---|---|
| **GitHub** | Created repo, pushed code, enabled Pages | Free |
| **GitHub Actions** | Auto-build & deploy on every push | Free |
| **Cloudflare** | DNS management, SSL, CDN, DDoS protection | Free |
| **Custom Domain** | .com.np domain from register.com.np | Free |
| **SSL/HTTPS** | Cloudflare Full mode + GitHub certificate | Free |
| **Total Cost** | — | **$0 / month** |

---

## Pro Tips

1. **Use a \`gh-pages\` branch** for clean separation: keep your source code on \`main\` and only push built files to \`gh-pages\`
2. **Cloudflare Analytics** gives you real visitor data without installing any tracking script — privacy-friendly!
3. **Cloudflare Workers** (free tier: 100K requests/day) can add serverless backend functionality to your otherwise static site
4. **Cache-Control headers** — Cloudflare caches assets aggressively. After deploying, always purge Cloudflare cache for instant updates
5. **Check your site on mobile** — GitHub Pages + Cloudflare works great on all devices; make sure your portfolio is responsive!

---

## Getting Your Free Domain

Don't have a custom domain yet? You can get a **.com.np domain completely free** if you're in Nepal. Read the full guide here:

👉 **[How to Get a Free .com.np Domain in Nepal: Documents & Step-by-Step Process](/blog/how-to-get-free-com-np-domain-nepal)**

Once you have your domain, come back to this guide and connect it to GitHub Pages + Cloudflare in under 15 minutes!

---

## Conclusion

You've just learned how to set up a **professional, fast, and secure** website hosting stack — entirely for free:

1. ✅ **GitHub** stores and serves your code via GitHub Pages
2. ✅ **GitHub Actions** automates your build and deployment pipeline
3. ✅ **Cloudflare** adds a global CDN, HTTPS, and DDoS protection
4. ✅ **Your custom domain** makes your site look professional and memorable

This same stack is used by thousands of developers worldwide to host portfolios, project demos, and documentation sites. There's no reason to pay for hosting when this powerful combination is available for free.

Now go live and share your work with the world! 🚀`,
};

const { data, error } = await supabase
  .from('blog_posts')
  .insert(post)
  .select()
  .single();

if (error) {
  console.error('❌ Error inserting post:', error.message);
  process.exit(1);
} else {
  console.log('✅ Blog post inserted successfully!');
  console.log('   ID:   ', data.id);
  console.log('   Slug: ', data.slug);
  console.log('   URL:  /blog/' + data.slug);
}
