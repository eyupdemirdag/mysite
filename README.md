# My Travel Blog - Coming Soon Page

A professional and modern "Coming Soon" page for your travel blog and photo gallery website.

## Features

- ✨ Modern, responsive design
- 🎨 Beautiful animations and effects
- 📱 Mobile-friendly layout
- ⏰ Countdown timer
- 📧 Email notification form
- 🔗 Social media links placeholder
- 🎯 Feature preview cards

## Setup

1. **Add your logo**: Place your logo file as `logo.png` in the root directory. The page will automatically use it.

2. **Customize the launch date**: Edit `script.js` and change the `launchDate` variable to your desired launch date:
   ```javascript
   const launchDate = new Date('2024-12-31T23:59:59').getTime();
   ```

3. **Update social media links**: Edit the social links in `index.html`:
   ```html
   <a href="YOUR_INSTAGRAM_URL" class="social-link">Instagram</a>
   ```

4. **Customize colors**: Edit the CSS variables in `styles.css` to match your brand:
   ```css
   :root {
       --primary-color: #2563eb;
       --secondary-color: #1e40af;
       --accent-color: #3b82f6;
   }
   ```

## File Structure

```
mysite/
├── index.html      # Main HTML file
├── styles.css      # Styling
├── script.js       # JavaScript functionality
├── logo.png        # Your logo (add this)
└── README.md       # This file
```

## How to View

Simply open `index.html` in your web browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server
```

Then visit `http://localhost:8000` in your browser.

## Next Steps

Once you're ready to build your full website:
- Create blog post pages
- Set up photo gallery
- Add navigation
- Implement backend for email notifications
- Connect to a CMS or database

