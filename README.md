# NEXVORA Website (Static)

Premium studio website built with **HTML/CSS/JS**:

- `index.html`: landing page + Netlify form
- `services.html`: portfolio/services page
- `admin.html`: local admin dashboard (browser `localStorage`)
- `shared.css`, `shared.js`: shared styles and scripts

## Run locally

Open `index.html` in your browser (double‑click).

For best results (relative links, fetch, form testing), use a local server:

- VS Code: install **Live Server** → right‑click `index.html` → **Open with Live Server**

## Deploy (GitHub → Netlify)

1. Push this folder to GitHub.
2. In Netlify: **Add new site → Import an existing project → GitHub**
3. Select the repo.
4. Build settings:
   - **Build command**: *(empty)*
   - **Publish directory**: `.`
5. Deploy.

Your pages will be available at:

- `/` (Netlify serves `index.html`)
- `/services.html`
- `/admin.html`

## Forms (Netlify Forms)

The homepage contact form is configured for Netlify Forms:

- Form name: `contact`
- After deployment, submissions appear in **Netlify → Site → Forms**

To test:

1. Open the live site.
2. Submit the contact form.
3. Check Netlify **Forms → contact**.

## Admin dashboard

Open:

- `/admin.html`

### Password

- First time on a device/browser: enter a password on the login screen and it will be saved in that browser’s `localStorage`.
- To change the password: log in → **⚙ Setup → Admin Password**.

### Where leads are stored

This project stores leads in two places:

1. **Netlify Forms** (server-side, in Netlify dashboard)
2. **Browser localStorage** (device/browser-specific)
   - Key: `nexvora_leads_v1`
   - The admin dashboard reads from this key and supports CSV export.

## Notes

- This is a static site (no backend). If you want a “real multi-user admin” that works across devices, the next step is adding a backend/database (Supabase/Firebase/etc.).

