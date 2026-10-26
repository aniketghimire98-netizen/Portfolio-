# AIZEN Portfolio — Vercel-ready

A responsive, static personal portfolio inspired by the structure and identity of https://aizen-po.vercel.app/#about. The implementation keeps the existing Aizen information and projects, with a restrained crimson Japanese-inspired visual treatment. No build step or package installation is required.

## Deploy to Vercel
1. Extract this ZIP on your device.
2. In Vercel, choose **Add New → Project** and import the extracted folder from a Git repository, or use Vercel's supported project upload flow if available on your account.
3. Framework preset: **Other**. Build command: leave empty. Output directory: `.` (project root).
4. Deploy.

Vercel's standard workflow is to import a project from Git. If your dashboard doesn't offer direct ZIP upload, upload the extracted files to a new GitHub repository and import that repository into Vercel.

## Edit your details
Open `config.js`. Change `discordName`, `discordId`, and `discordProfileUrl` there. Add real project URLs to `projects` (the keys are `security`, `zyntrix`, `sovereign`, and `zen`) and social URLs to `socials` if you want to publish them. Project cards intentionally point to the contact section until you add verified URLs; no fake project links or live presence are shown.

## Files
- `index.html` — page structure and portfolio content
- `style.css` — responsive styles and animations
- `script.js` — navigation, filters, copy buttons, and reveal animations
- `config.js` — central personal/project configuration
- `vercel.json` — basic security headers
