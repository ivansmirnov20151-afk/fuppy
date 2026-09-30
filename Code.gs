/*
 * Secure RSVP endpoint for the Irina 50 invitation.
 * Keep the GitHub token in Script Properties only, never in index.html.
 */
const GITHUB_API = 'https://api.github.com/repos/ivansmirnov20151-afk/fuppy/contents/gusses';

function doPost(event) {
  try {
    const payload = JSON.parse(event.postData.contents || '{}');
    const newGuests = Array.isArray(payload.guests) ? payload.guests : [];
    if (!newGuests.length || newGuests.some(guest => !guest.first || typeof guest.first !== 'string')) {
      return response({ ok: false, error: 'Invalid guest data' });
    }

    const token = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
    if (!token) return response({ ok: false, error: 'Missing GitHub token' });

    const current = githubRequest('get', token);
    const text = current.content ? Utilities.newBlob(Utilities.base64Decode(current.content.replace(/\n/g, ''))).getDataAsString('UTF-8') : '[]';
    const guests = text.trim() ? JSON.parse(text) : [];
    const updated = guests.concat(newGuests.map(guest => ({ first: guest.first.trim(), last: (guest.last || '').trim(), addedAt: new Date().toISOString() })));
    const content = Utilities.base64Encode(JSON.stringify(updated, null, 2));

    githubRequest('put', token, { message: 'Add RSVP guests', content: content, sha: current.sha });
    return response({ ok: true });
  } catch (error) {
    console.error(error);
    return response({ ok: false, error: 'Could not save RSVP' });
  }
}

function githubRequest(method, token, body) {
  const options = { method: method, headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' }, muteHttpExceptions: true };
  if (body) options.payload = JSON.stringify(body);
  const result = UrlFetchApp.fetch(GITHUB_API, options);
  if (result.getResponseCode() < 200 || result.getResponseCode() > 299) throw new Error('GitHub API error: ' + result.getResponseCode());
  return JSON.parse(result.getContentText());
}

function response(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
