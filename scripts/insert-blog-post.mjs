/**
 * One-time script to insert the .com.np domain blog post into Supabase.
 * Run with:  node scripts/insert-blog-post.mjs
 * or:        bun scripts/insert-blog-post.mjs
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL     = process.env.VITE_SUPABASE_URL     || 'https://dyzswpehmsrolqjrgxyy.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_hJgEugg0Szn4piEVPToWcQ_jFkBd_B2';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const post = {
  title:           'How to Get a Free .com.np Domain in Nepal: Documents & Step-by-Step Process',
  slug:            'how-to-get-free-com-np-domain-nepal',
  excerpt:         'Want a free .com.np domain name for your website in Nepal? Learn exactly what documents you need and follow our complete step-by-step guide to register through register.com.np — Nepal\'s official domain registry.',
  cover_image_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=630&fit=crop',
  category:        'General',
  tags:            ['Nepal', 'Domain', 'com.np', 'Web Hosting', 'Tutorial', 'Free Domain'],
  status:          'published',
  featured:        false,
  published_at:    '2026-09-21',
  reading_time:    8,
  external_url:    '',
  meta_title:      'How to Get a Free .com.np Domain in Nepal (2025 Guide)',
  meta_description:'Complete step-by-step guide to register a free .com.np domain in Nepal. Learn the required documents, eligibility, DNS setup, and approval process at register.com.np.',
  canonical_url:   '',
  og_image_url:    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=630&fit=crop',
  focus_keyword:   'free com.np domain Nepal',
  content: `## Introduction

Having a professional domain name is one of the first steps to establishing a credible online presence. If you're in Nepal, there's great news — you can register a **.com.np** domain name **completely free of charge** through Nepal's official domain registry managed by **Mercantile Communications Pvt. Ltd.** at [register.com.np](https://register.com.np).

In this guide, I'll walk you through everything — the eligibility criteria, required documents, and a complete step-by-step registration process — so you can get your own Nepali domain without any hassle.

---

## What is a .com.np Domain?

**.com.np** is Nepal's country-code top-level domain (ccTLD) for commercial entities and individuals. It signals that your website is based in Nepal, adding local credibility. Other available subdomains under the .np TLD include:

- **edu.np** — for educational institutions
- **gov.np** — for government bodies
- **org.np** — for non-profit organizations
- **net.np** — for network service providers
- **com.np** — for commercial use and individuals

For most freelancers, businesses, and personal brands, **.com.np** is the go-to choice.

---

## Is It Really Free?

Yes — **completely free!** Unlike international domains (.com, .net, .io) that cost $10–$20/year, .com.np domains are provided at no cost by Mercantile Communications. The only "cost" is your time to gather the documents and wait for manual approval.

---

## Eligibility Criteria

Before you start, check if you qualify:

### For Individuals
- Must be a **Nepali citizen** (or hold a valid Nepali resident visa for foreign nationals)
- The domain name should **logically match your name** or personal brand
- Example: If your name is "Roshan Devkota", you could register \`roshandevkota.com.np\`

### For Organizations / Companies
- Must have a **valid company or organization registration** in Nepal
- Domain name must match or relate to the **registered business name**
- PAN/VAT registration is recommended

### For Foreign Entities
- Must have a **registered presence in Nepal** (branch office, liaison office, joint venture, or trademark registered in Nepal)

> **Pro Tip:** The registry manually reviews every application. If your domain name has no logical connection to your name, brand, or organization, your application will likely be **rejected**. Choose wisely!

---

## Documents Required

Make sure your documents are **clear, legible scanned copies** (PDF or JPG). Blurry or low-quality uploads are a common reason for rejection.

### For Individuals — Required Documents

| Document | Details |
|---|---|
| **Citizenship Certificate** | The most commonly accepted ID |
| **Passport** | Accepted if citizenship is unavailable |
| **Driving License** | Valid Nepali driving license |
| **Voter's Card** | Government-issued voter ID |
| **NRN ID** | For Non-Resident Nepalis |

> Only **one** of the above IDs is needed.

### For Organizations — Required Documents

| Document | Details |
|---|---|
| **Company/Organization Registration Certificate** | Issued by the relevant authority |
| **PAN or VAT Certificate** | Tax registration document |
| **Authorization Letter** | On official letterhead, signed and stamped by an authorized representative |

### For Trademark-Based Domains
- **Trademark Registration Certificate** or official filing receipt from the Department of Industry

---

## Step-by-Step Registration Process

### Step 1: Check Domain Availability

1. Open your browser and go to **[https://register.com.np](https://register.com.np)**
2. On the homepage, you'll find a domain search bar
3. Type your desired domain name (e.g., \`yourname\`) and click **Search**
4. If it shows **Available**, proceed to the next step
5. If it's **Taken**, try a variation or a different name

> Domains are registered on a **first-come, first-served** basis. Once it's taken, it's gone.

---

### Step 2: Create an Account

1. Click **"Register Now"** or **"Sign Up"** on the website
2. Fill in your **email address** and create a **strong password**
3. Click **Submit** to create your account
4. Check your inbox for a **verification email** from register.com.np
5. Click the verification link to **activate your account**
6. Log in with your credentials

---

### Step 3: Start the Domain Registration Form

1. Once logged in, go to your **Dashboard**
2. Click on **"Register Domain"** or search for your domain again
3. Select the **.com.np** extension
4. Click **"Register"** to begin filling the application

---

### Step 4: Fill in Contact Information

You'll need to provide two types of contacts:

**Administrative Contact (Admin Contact):**
- Full name of the domain owner
- Email address
- Phone number
- Full mailing address in Nepal

**Technical Contact:**
- Can be the same as the admin contact
- Or your web developer / hosting provider's details

> Make sure all information is **accurate and matches your documents**. Mismatches can cause rejection.

---

### Step 5: Configure DNS / Name Servers

This is a crucial step. You need to provide your **Name Servers (NS)** — these point your domain to your web hosting.

**Important Rules for Name Servers:**
- Must be **Fully Qualified Domain Names (FQDN)** — e.g., \`ns1.hostingprovider.com\`
- **Raw IP addresses are NOT accepted**
- You need at least **2 name servers** (Primary and Secondary)

**Where to get name servers:**
- From your **hosting provider** (e.g., Namecheap, SiteGround, Cloudflare, or local Nepali hosts like InfoDevelopers, WebSurfer Nepal)
- If using **Cloudflare**: \`ns1.cloudflare.com\` and \`ns2.cloudflare.com\`
- If you don't have hosting yet, you can use a **parking service** temporarily

**Example Name Servers (Cloudflare):**
\`\`\`
Primary NS:   ns1.cloudflare.com
Secondary NS: ns2.cloudflare.com
\`\`\`

---

### Step 6: Upload Your Documents

1. In the application form, find the **"Document Upload"** section
2. Upload your scanned identity document (Citizenship/Passport/Driving License)
3. For organizations, upload the Registration Certificate, PAN/VAT, and Authorization Letter
4. Accepted formats: **PDF or JPG**
5. Ensure files are **under the size limit** (usually 2MB per file)

**Tips for document upload:**
- Scan at **300 DPI** for clarity
- Ensure all text is **readable**
- Make sure the document is **not expired**
- Color scans are preferred over black and white

---

### Step 7: Review and Submit

1. Review all the information you've filled in
2. Double-check the domain name spelling — **typos cannot be fixed after approval**
3. Verify your name servers are correct
4. Click **"Submit Application"**
5. You'll receive a **confirmation email** that your application is under review

---

### Step 8: Wait for Approval

Unlike automatic domain registrations, .com.np domains go through **manual review** by the Mercantile team.

| Stage | Typical Duration |
|---|---|
| Application Submitted | Immediately |
| Under Review | 2–4 business days |
| Approved / Rejected | Email notification |
| DNS Propagation | 24–48 hours after approval |

> If your application is rejected, you'll receive an email with the reason. Common reasons include: mismatched documents, unclear scans, domain name not related to your name/brand, or invalid name servers.

---

### Step 9: DNS Propagation

Once approved:
1. Log in to your domain registrar (the hosting provider for your name servers)
2. Create the necessary **DNS records** (A record pointing to your server's IP)
3. Wait **24–48 hours** for global DNS propagation
4. Your website will then be accessible via your new .com.np domain worldwide!

---

## Common Reasons for Rejection (And How to Avoid Them)

| Reason | How to Avoid |
|---|---|
| Domain name unrelated to applicant name/brand | Choose a name closely matching your real name or org name |
| Blurry or unclear document scan | Scan at 300 DPI, good lighting |
| Invalid or missing name servers | Use FQDN name servers from your host |
| Expired ID document | Use a valid, unexpired document |
| Wrong document type uploaded | Match documents to the correct requirement category |

---

## Renewing Your .com.np Domain

Currently, .com.np domains are **free and do not expire** in the traditional sense, but you must:

- Keep your **contact information updated** in your account
- Respond to any **re-verification requests** (as of December 2024, Mercantile has begun sending re-verification notices)
- Log in periodically to ensure your domain is **Active** and not flagged

> If you receive a re-verification email, act on it promptly — failure to respond can result in your domain being **parked or suspended**.

---

## Pro Tips for Nepali Domain Owners

1. **Use Cloudflare** for your DNS management — it's free, fast, and offers DDoS protection
2. **Set up SSL/HTTPS** using Let's Encrypt (free) once your hosting is configured
3. **Keep a backup** of all uploaded documents in case you need to re-verify
4. **Monitor your email** — all communication from the registry comes via email
5. **Pair with local hosting** providers like InfoDevelopers, WebSurfer Nepal, or use international hosts like Namecheap or Cloudflare Pages for static sites

---

## Frequently Asked Questions

**Q: Can a non-Nepali citizen get a .com.np domain?**
A: Yes, if you have a valid Nepali resident visa or if your foreign organization has a registered presence in Nepal.

**Q: How long does approval take?**
A: Typically 2–4 business days, but it can take longer during high-volume periods.

**Q: Can I transfer my .com.np domain to another registrar?**
A: No. Mercantile Communications is the sole registry for .np domains. There's no transfer process.

**Q: What if my desired domain is already taken?**
A: Try a variation — add hyphens, your profession, or a location. Example: \`roshanktm.com.np\` or \`roshan-dev.com.np\`.

**Q: Can I host my .com.np domain anywhere?**
A: Yes! You can use any web hosting provider worldwide. Simply point your name servers or DNS records to your host.

**Q: Is there a renewal fee?**
A: Currently no fee, but you must maintain your account and respond to re-verification notices.

---

## Conclusion

Getting a free **.com.np domain** in Nepal is straightforward once you know the process. The key is to:

1. ✅ Choose a domain name that matches your name or brand
2. ✅ Prepare clear, valid document scans
3. ✅ Have valid name servers ready before applying
4. ✅ Be patient during the manual review process

A .com.np domain not only saves you money but also gives your website a **local identity** that builds trust with Nepali audiences. Whether you're a freelancer, a startup, or an established business, your .com.np domain is a valuable digital asset — and it won't cost you a single rupee!

**Ready to get started?** Head over to [register.com.np](https://register.com.np) and claim your domain today! 🇳🇵`,
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
