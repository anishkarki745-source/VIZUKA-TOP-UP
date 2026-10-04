VIZUKA TOPUP - ORDER FIXED

Replace the files in your GitHub Pages root with the files in this ZIP.

Fixes:
- Customer order insert now includes the required product_name field.
- Customer order still uses product_id, player_uid, payment_method, and status.
- Player name is collected and sent to WhatsApp, but is not inserted into the database.
- Admin product panel has editable price + Save button.
- Admin product panel has Available ON/OFF toggle.
- Admin orders resolve product name and price through product_id.

Do not run SQL for this fix.
