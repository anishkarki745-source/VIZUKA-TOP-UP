# Vizuka TopUp V3

V3 moves the prototype toward a real shared backend using Supabase.

## Included
- Real email/password admin authentication
- Shared products database
- Admin price editing
- Admin product ON/OFF availability
- Shared order database
- Admin order status management
- Customer order creation
- No staff accounts in V3

## Important
This package does NOT yet connect eSewa/Khalti merchant APIs or an automatic Free Fire top-up provider. Do not treat it as fully production-ready until payment/security testing is complete.

## Setup
1. Create a Supabase project.
2. Open SQL Editor and run `schema.sql`.
3. In Authentication > Users, create the admin email/password account.
4. Copy that user's UUID.
5. In SQL Editor run:
   `insert into public.profiles (id, role) values ('YOUR-USER-UUID','admin');`
6. Open Project Settings/API (or Connect) and copy the Project URL and **publishable key** into `config.js`.
7. Never put a Supabase secret key in `config.js` or GitHub. Supabase documents that publishable keys are intended for browser apps when RLS is configured; secret keys bypass RLS and must stay server-side.
8. Upload the V3 files to the GitHub Pages repository, replacing the V2 frontend files.

## Before real customers
- Test RLS with a separate non-admin account.
- Test order creation and admin status updates.
- Add real payment integration only after the relevant merchant account and provider requirements are satisfied.
- Add server-side payment verification/webhooks before trusting payment status automatically.
- Keep payment/API secrets off GitHub.
