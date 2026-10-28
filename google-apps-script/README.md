# Consultation bookings → Google Sheet

The booking page (`/en/apply`, `/fr/apply`, `/ar/apply`) sends every booking to
one Google Sheet: one row per candidate, and an email for each new booking. No
payment is taken on the site: the team contacts each candidate on WhatsApp
within 24–48 hours with the payment details, then sends a booking link once the
payment is confirmed. The "Payment method" and "Receipt" columns are kept for
older bookings and stay empty for new ones.

## Setup (once, about 5 minutes)

1. Create a new Google Sheet (for example "Go4Visa — Bookings") with the Google
   account that should own the bookings and receipts.
2. In the Sheet: **Extensions → Apps Script**. Delete the sample code and paste
   the whole content of `booking.gs`.
3. At the top of the script, set:
   - `SECRET`: a long random string (keep it private).
   - `NOTIFY_EMAIL`: the address that receives a notice for each booking.
4. Click 💾 **Save**, choose the `setup` function in the toolbar and click
   **Run**. Accept the permissions (Google shows "unverified app" because the
   script is yours: **Advanced → Go to … (unsafe)** → **Allow**). This creates
   the "Bookings" tab and the "Go4Visa — Payment receipts" Drive folder.
5. **Deploy → New deployment** → type **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
   → **Deploy**, then copy the **Web app URL** (`https://script.google.com/macros/s/…/exec`).
6. On the website host (Netlify: *Site configuration → Environment variables*),
   add:
   - `GOOGLE_SHEET_WEBHOOK_URL` = the Web app URL
   - `GOOGLE_SHEET_SECRET` = the same `SECRET` as in the script

   then redeploy the site. For local testing, put the same two lines in
   `.env.local`.

> After editing the script later, use **Deploy → Manage deployments → Edit →
> Version: New version**, otherwise the old code keeps running.

## In the Sheet

| Column | Content |
| --- | --- |
| Date … Payment completed? | The candidate's answers |
| Payment method, Receipt | Older bookings only (the form no longer asks for payment) |
| Status | Dropdown: New · Payment verified · Consultation scheduled · Done · Cancelled |

Without these variables (local development), bookings are written to
`data/bookings.jsonl`.
