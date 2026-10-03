VIZUKA TOPUP - REFERENCE UI

Upload these files to your GitHub Pages root:
index.html
admin.html
app.js
admin.js
config.js
style.css
payment-qr.jpg

This version changes the customer UI to a compact two-column mobile storefront inspired by the reference screenshot.

IMPORTANT:
- Keep your existing Supabase database.
- Orders use product_id, not package_id/package_name/price.
- The customer does not upload the payment screenshot to Supabase; it is attached manually in WhatsApp.
- Never put a Supabase service-role/secret key in frontend code.

After uploading, wait for GitHub Pages to deploy and hard-refresh the website.
