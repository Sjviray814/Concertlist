# Local testing setup — fixing the `origin: null` CORS issue

## Why this happens
Opening `concertlist.html` by double-clicking it (or dragging it into a browser tab) loads it as a `file://` URL. Browsers report the origin of `file://` pages as `null`. Most external APIs — including iTunes' and many others you'll add later — only send back CORS approval headers for real origins (`https://your-site.com`, `http://localhost:8000`, etc.), not for `null`. So every outbound API call fails with a CORS error, regardless of whether the API key or code is correct.

This isn't specific to iTunes — it'll affect any external API you wire up while testing this way. The fix below solves it once, permanently, for local testing.

## The fix: serve the file over a real (local) origin

You're on macOS, so Python 3 is already installed. In Terminal:

```bash
cd ~/Downloads          # or wherever you saved concertlist.html
python3 -m http.server 8000
```

Then open this in your browser instead of double-clicking the file:

```
http://localhost:8000/concertlist.html
```

(If the filename has spaces or a suffix like `concertlist (3).html`, just visit `http://localhost:8000/` first and click the file from the directory listing — that avoids URL-encoding headaches.)

That's it. The page now has a real origin (`http://localhost:8000`), so CORS-enabled APIs — iTunes, Ticketmaster, and anything else you add — will work exactly as they will once this is actually deployed to a real domain. Leave the Terminal window running while you test; `Ctrl+C` stops the server when you're done.

## Alternative options
- **VS Code:** install the "Live Server" extension, right-click `concertlist.html` → "Open with Live Server."
- **Node users:** `npx serve` in the folder works the same way as the Python command above.

## Going forward
Once you deploy this for real (Vercel, Netlify, your own domain, etc.), it'll have a proper `https://` origin automatically and this issue disappears entirely — this local-server step is only needed while testing on your own machine.
