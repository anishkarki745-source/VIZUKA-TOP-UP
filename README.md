# Vizuka TopUp V4
Static customer-only Free Fire top-up store.

Flow: select package → enter UID → pay → enter transaction/reference ID → WhatsApp opens with the order details.

No admin panel, Supabase, database, or customer login.

Before publishing, replace the payment placeholders in `index.html`:
- YOUR_ESEWA_NUMBER
- YOUR_KHALTI_NUMBER
- YOUR_BANK_DETAILS

The supplied payment QR is included as `payment-qr.jpg` and is displayed at checkout.

The WhatsApp number is currently `9779807088460`.

Important: this site does not automatically verify payments or automatically deliver diamonds. Verify payment yourself before fulfilling an order. Never put private API keys, banking passwords, or service-role/secret keys in the website.
