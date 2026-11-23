# Smart Shutter mobile repair

Prepared 23 November 2026 from the existing public repository, commit bc7b19f.

## Status
These are replacement website files, not an APK and not a live deployment. Keep the existing GitHub Pages address so browser-saved quotes stay on the same origin. No customer data or custom prices are included in this package.

## Before updating
1. Open the CURRENT app on each device with important quotes.
2. Use Backup > Create backup, and check that the JSON file is in Downloads.
3. Keep a second copy outside the browser. Do not clear browser data, uninstall or change browser as part of this update.

## Deploy to the existing repository
Unzip this package. Upload these five files together to the same published folder as index.html in the existing repository, replacing the existing files where prompted:
- index.html
- manifest.webmanifest
- sw.js
- mobile.js (new)
- mobile.css (new)

There are FIVE changed/new runtime files. The icon PNGs and html2canvas.min.js are also included unchanged so the package is complete. Do not upload this README or the enclosing folder as a new path. Commit the upload, wait for GitHub Pages to finish, then open the existing address online. Close and reopen the app once more so its new service worker takes control. Do NOT clear browser data to force an update.

## Install
Android: open in Chrome, use Install on mobile or the Chrome menu's Install app / Add to Home screen.
iPhone: open in Safari, Share > Add to Home Screen.
If opened in WhatsApp's internal browser, choose Open in browser first. Open once online to cache the app before offline use.

## Changes
- Fixed manifest icon URLs to match the real PNG file locations.
- Added an install action and platform instructions.
- Added a weekly reminder to save an external backup. The reminder is acknowledged only by the user, not by an assumed download success.
- Added one previous saved-state snapshot, refreshed at most daily when existing data is edited. This is LOCAL recovery, not cloud backup. It has a separate download action and never restores automatically.
- Limited cache cleanup to Smart Shutter caches; added new assets to offline cache and allowed online document updates.
- Minor narrow-screen layout safety and bottom-navigation stacking.

## Preserved
The existing storage key, quote data schema, prices, calculation functions, defaults, PDF generation and contract terms were preserved. The original page's save binding was changed from const to let only so the safety wrapper can call its existing function.

## Checks
Tested in desktop Chromium with phone-sized viewports, not on physical Android/iPhone hardware. Checked 320px, 390px and 1280px for the opening view, install instructions, backup download, saved quote after reload, local recovery snapshot, all manifest icon responses and offline reload. No JavaScript errors were seen. Actual home-screen installation still needs a check after deployment over HTTPS.

## Limits
No automatic cloud sync. Clearing browser data or losing the device still loses both primary data and local recovery; external JSON backups are needed. Existing contract wording was not edited and still needs the owner's review. No APK or app-store release was created.
