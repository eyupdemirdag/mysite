# Logo Not Showing - Troubleshooting Guide

If your logo is not showing on the live website, follow these steps:

## ✅ Quick Checks

### 1. Verify Logo File is Uploaded
- [ ] Check that `logo.png` is in the same directory as `index.html`
- [ ] File should be in your hosting's root directory (public_html/www)
- [ ] File size should be around 1.4 MB

### 2. Check File Name (Case-Sensitive!)
- [ ] Filename must be exactly: `logo.png` (lowercase)
- [ ] NOT `Logo.png`, `LOGO.PNG`, or `logo.PNG`
- [ ] Some servers are case-sensitive

### 3. Verify File Location
Your hosting directory should look like this:
```
public_html/
├── index.html
├── styles.css
├── script.js
├── logo.png    ← Must be here!
└── .htaccess
```

### 4. Test Direct Access
Try accessing your logo directly in browser:
```
https://yourdomain.com/logo.png
```
- If it loads → path issue in HTML
- If it doesn't load → file not uploaded or wrong location

### 5. Check File Permissions
Set file permissions to **644**:
- Via FTP: Right-click → File Permissions → 644
- Via cPanel: File Manager → Change Permissions → 644
- Via SSH: `chmod 644 logo.png`

## 🔧 Common Solutions

### Solution 1: Re-upload logo.png
1. Delete the old logo.png from hosting
2. Upload a fresh copy from your computer
3. Make sure it's in the root directory
4. Clear browser cache (Ctrl+F5 or Cmd+Shift+R)

### Solution 2: Check Browser Console
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Look for error messages about logo.png
4. Check Network tab to see if logo.png request failed

### Solution 3: Verify File Path
If your files are in a subdirectory, update the path in index.html:
```html
<!-- If logo is in root -->
<img src="/logo.png" alt="Logo">

<!-- If logo is in same folder -->
<img src="./logo.png" alt="Logo">

<!-- If logo is in images folder -->
<img src="images/logo.png" alt="Logo">
```

### Solution 4: Try Different Path Formats
Update index.html line 16 to try:
```html
<!-- Option 1: Current (relative) -->
<img src="./logo.png" alt="Logo">

<!-- Option 2: Absolute from root -->
<img src="/logo.png" alt="Logo">

<!-- Option 3: Full URL (replace with your domain) -->
<img src="https://yourdomain.com/logo.png" alt="Logo">
```

## 🧪 Testing Steps

1. **Test Direct URL**: Visit `https://yourdomain.com/logo.png`
   - ✅ Works = File is uploaded correctly
   - ❌ 404 Error = File not found or wrong location

2. **Check File Manager**: Log into cPanel/hosting panel
   - Verify logo.png exists
   - Check file size matches (should be ~1.4 MB)
   - Verify it's in the same folder as index.html

3. **Browser Console**: Open F12 → Console
   - Look for any error messages
   - Check if logo.png request shows 404

4. **Network Tab**: Open F12 → Network
   - Refresh page
   - Look for logo.png request
   - Check status code (should be 200, not 404)

## 📝 Still Not Working?

If none of the above works:

1. **Rename the file**: Try renaming to `mylogo.png` and update HTML:
   ```html
   <img src="mylogo.png" alt="Logo">
   ```

2. **Check hosting restrictions**: Some hosts block certain file types
   - Contact hosting support
   - Ask if PNG files are allowed

3. **File corruption**: Re-export logo from original source
   - Make sure it's a valid PNG file
   - Try converting to JPG if PNG doesn't work

4. **CDN/Caching**: Clear all caches
   - Browser cache
   - CDN cache (if using Cloudflare, etc.)
   - Hosting cache

## 💡 Quick Fix Command (if you have SSH access)

```bash
cd /path/to/your/website
ls -la logo.png          # Check if file exists
chmod 644 logo.png       # Set correct permissions
file logo.png            # Verify it's a valid PNG
```

## Need More Help?

Check these in order:
1. Browser console errors (F12)
2. Direct URL test (yourdomain.com/logo.png)
3. File manager in hosting panel
4. File permissions
5. Contact hosting support

