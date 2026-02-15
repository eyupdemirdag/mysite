# Upload Guide - Coming Soon Page

## Files to Upload

Upload ALL of these files to your hosting's public_html or www directory:

```
✅ index.html       (Main page)
✅ styles.css       (Styling)
✅ script.js        (JavaScript)
✅ logo.png         (Your logo)
✅ .htaccess        (Server configuration - optional but recommended)
```

## Upload Steps

### Method 1: Using FTP/SFTP Client (FileZilla, Cyberduck, etc.)

1. Connect to your hosting server using FTP credentials
2. Navigate to your website's root directory (usually `public_html`, `www`, or `htdocs`)
3. Upload all the files listed above
4. Make sure `index.html` is in the root directory
5. Visit your domain to see the site

### Method 2: Using cPanel File Manager

1. Log into your cPanel
2. Open "File Manager"
3. Navigate to `public_html` (or your website root)
4. Upload all files
5. Make sure file permissions are correct (644 for files, 755 for directories)

### Method 3: Using Command Line (SSH)

```bash
# Navigate to your site directory
cd /path/to/your/website

# Upload files using SCP
scp index.html styles.css script.js logo.png .htaccess user@yourhost.com:/path/to/public_html/
```

## File Structure on Server

Your hosting directory should look like this:

```
public_html/
├── index.html
├── styles.css
├── script.js
├── logo.png
└── .htaccess
```

## Important Notes

- ✅ All file paths are relative, so they work on any hosting
- ✅ No database required
- ✅ No server-side code needed
- ✅ Works on any standard web hosting

## Testing After Upload

1. Visit your domain (e.g., `https://yourdomain.com`)
2. Check that the logo displays correctly
3. Verify the page looks good on mobile devices
4. Test in different browsers

## Troubleshooting

**Logo not showing?**
- Check that `logo.png` is uploaded
- Verify the filename matches exactly (case-sensitive on some servers)
- Check file permissions (should be 644)

**Page not loading?**
- Make sure `index.html` is in the root directory
- Check that your hosting supports static HTML files
- Verify `.htaccess` is uploaded (if using Apache)

**Styles not working?**
- Check that `styles.css` is uploaded
- Verify file permissions
- Clear browser cache

## Need Help?

If you encounter any issues, check:
1. File permissions
2. File paths (all should be in the same directory)
3. Browser console for errors (F12)
4. Server error logs in cPanel

