# My Page — Visitor Email Notification

This portfolio is hosted on GitHub Pages, so the email notification uses a small Google Apps Script web app as the backend.

Google Apps Script web apps support `doGet(e)` requests with query parameters, and Apps Script can send email through MailApp. See the official Google documentation:
- https://developers.google.com/apps-script/guides/web
- https://developers.google.com/apps-script/guides/services

## 1. Create the Google Apps Script

Open https://script.google.com/ and create a new standalone project.

Replace the default code with:

```javascript
const NOTIFY_EMAIL = 'YOUR_EMAIL@example.com';
const COOLDOWN_MINUTES = 30;

function doGet(e) {
  try {
    const p = e && e.parameter ? e.parameter : {};
    const sessionId = String(p.session || '').slice(0, 120);
    const cache = CacheService.getScriptCache();

    // Avoid repeated emails from the same browser session.
    if (sessionId && cache.get('visitor_' + sessionId)) {
      return json_({ ok: true, skipped: true });
    }

    if (sessionId) {
      cache.put('visitor_' + sessionId, '1', COOLDOWN_MINUTES * 60);
    }

    const page = safe_(p.page || 'Unknown page', 500);
    const path = safe_(p.path || '/', 200);
    const referrer = safe_(p.referrer || 'Direct', 500);
    const screen = safe_(p.screen || 'Unknown', 50);
    const viewport = safe_(p.viewport || 'Unknown', 50);
    const profile = safe_(p.profile || 'Unknown', 50);
    const timestamp = safe_(p.timestamp || new Date().toISOString(), 100);

    const subject = '👀 Someone viewed your portfolio';

    const body =
      'A visitor just opened your portfolio.\n\n' +
      'Time: ' + timestamp + '\n' +
      'Page: ' + page + '\n' +
      'Path: ' + path + '\n' +
      'Profile: ' + profile + '\n' +
      'Screen: ' + screen + '\n' +
      'Viewport: ' + viewport + '\n' +
      'Referrer: ' + referrer + '\n\n' +
      'Note: the visitor\'s email address is not available from a normal page view.';

    MailApp.sendEmail(NOTIFY_EMAIL, subject, body);

    return json_({ ok: true, sent: true });
  } catch (err) {
    console.error(err);
    return json_({ ok: false });
  }
}

function safe_(value, max) {
  return String(value).replace(/[<>]/g, '').slice(0, max);
}

function json_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
```

Replace `YOUR_EMAIL@example.com` with the email address where you want notifications.

## 2. Authorize it

In Apps Script, select any normal function you want to run, or temporarily add this test function:

```javascript
function testEmail() {
  MailApp.sendEmail(
    NOTIFY_EMAIL,
    'Portfolio notification test',
    'Your visitor notification backend is authorized and working.'
  );
}
```

Run `testEmail` once and approve Google's permission request.

You can then remove `testEmail` if you want.

## 3. Deploy as a web app

Use:

**Deploy → New deployment → Web app**

Configure it so the web app executes as you and is accessible to the visitors who need to call it.

Copy the resulting URL ending in `/exec`.

Google documents this deployment flow and the `doGet(e)` request parameters here:
https://developers.google.com/apps-script/guides/web

## 4. Connect it to the portfolio

Open `script.js` in this repository and put your copied `/exec` URL into:

```javascript
const endpoint='YOUR_APPS_SCRIPT_EXEC_URL';
```

The frontend already contains the visitor-notification code and will send the page URL, referrer, screen size, viewport, selected profile, timestamp, and a temporary browser session ID.

## Privacy note

A normal anonymous page view does **not** reveal the visitor's email address. This system emails you that someone viewed the portfolio; it does not claim to identify the visitor.

If you want a visitor's name/email, add an explicit contact or inquiry form where the visitor chooses to provide those details.
