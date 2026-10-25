# Consultation bookings → Google Sheet

The booking page (`/en/apply`, `/fr/apply`) sends every booking to one Google
Sheet: one row per candidate, with a link to the payment receipt saved in
Google Drive, and an email for each new booking.

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
| Receipt | "View receipt" link to the file in Drive |
| Status | Dropdown: New · Payment verified · Consultation scheduled · Done · Cancelled |

Without these variables (local development), bookings are written to
`data/bookings.jsonl` and receipts to `data/receipts/`.
