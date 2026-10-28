/**
 * Go4Visa — consultation bookings → Google Sheet + Google Drive
 *
 * Receives each booking sent by the website (/apply), adds one row to the
 * "Bookings" sheet and emails a notice. The website no longer collects payment
 * details or receipts (the team shares payment details on WhatsApp); the
 * "Payment method" and "Receipt" columns stay for older rows and are left empty.
 *
 * SETUP (once, about 5 minutes) — see README.md in this folder.
 */

// ── Settings ────────────────────────────────────────────────────────────────
// Must match GOOGLE_SHEET_SECRET on the website host. Any long random string.
const SECRET = "CHANGE-ME-to-a-long-random-string";
// Who receives an email for each new booking ("" to turn emails off).
const NOTIFY_EMAIL = "go4visa.consultation@gmail.com";
// Name of the Drive folder that will hold the receipts (created if missing).
const RECEIPTS_FOLDER = "Go4Visa — Payment receipts";
const SHEET_NAME = "Bookings";

const HEADERS = [
  "Date",
  "Full name",
  "Email",
  "WhatsApp",
  "Opportunity",
  "Why interested",
  "Needs help with",
  "Biggest question / concern",
  "Payment method",
  "Receipt",
  "Language",
  "Status",
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.secret !== SECRET) return json({ ok: false, error: "unauthorized" });

    lock.waitLock(20000);
    const sheet = getSheet();

    // 1. Save the receipt to Drive (private: only the sheet owner and people
    //    they share the folder with can open it).
    let receiptUrl = "";
    if (data.receipt && data.receipt.base64) {
      const blob = Utilities.newBlob(
        Utilities.base64Decode(data.receipt.base64),
        data.receipt.type || "application/octet-stream",
        data.receipt.name || "receipt",
      );
      const file = getFolder().createFile(blob);
      receiptUrl = file.getUrl();
    }

    // 2. One row per booking.
    sheet.appendRow([
      new Date(data.receivedAt || Date.now()),
      cell(data.name),
      cell(data.email),
      "'" + data.whatsapp, // keep the leading "+" and zeros
      cell(data.opportunity),
      cell(data.reason),
      cell(data.help),
      cell(data.question),
      cell(data.payment),
      receiptUrl ? '=HYPERLINK("' + receiptUrl + '","View receipt")' : "",
      cell(data.lang),
      "New",
    ]);

    // 3. Email notice.
    if (NOTIFY_EMAIL) {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        replyTo: data.email,
        subject: "New consultation booking — " + data.name,
        htmlBody:
          "<p><b>" + esc(data.name) + "</b> booked a consultation.</p>" +
          "<p>Opportunity: " + esc(data.opportunity) + "<br>" +
          "WhatsApp: " + esc(data.whatsapp) + "<br>" +
          "Email: " + esc(data.email) +
          (data.payment ? "<br>Payment: " + esc(data.payment) : "") + "</p>" +
          (receiptUrl ? '<p><a href="' + receiptUrl + '">View the payment receipt</a></p>' : "") +
          '<p><a href="' + SpreadsheetApp.getActiveSpreadsheet().getUrl() + '">Open the bookings sheet</a></p>',
      });
    }

    return json({ ok: true });
  } catch (err) {
    console.error(err);
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** The "Bookings" tab, created with styled headers and a Status dropdown on first use. */
function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight("bold").setBackground("#0B2D5B").setFontColor("#FFFFFF");
    sheet.getRange("A:A").setNumberFormat("dd/mm/yyyy hh:mm");
    const status = SpreadsheetApp.newDataValidation()
      .requireValueInList(["New", "Payment verified", "Consultation scheduled", "Done", "Cancelled"], true)
      .build();
    sheet.getRange(2, HEADERS.length, sheet.getMaxRows() - 1, 1).setDataValidation(status);
  }
  return sheet;
}

function getFolder() {
  const found = DriveApp.getFoldersByName(RECEIPTS_FOLDER);
  return found.hasNext() ? found.next() : DriveApp.createFolder(RECEIPTS_FOLDER);
}

/** Plain text in the sheet — a leading = + - @ would otherwise run as a formula. */
function cell(v) {
  const s = String(v == null ? "" : v);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function esc(s) {
  return String(s || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
}

/** Run once from the editor to authorise Drive, Sheets and Gmail and create the tab. */
function setup() {
  getSheet();
  getFolder();
}
