const { google } = require('googleapis');
const calendarCredentials = require('./google-calendar-credentials.json');

const { client_id, client_secret, redirect_uris } = calendarCredentials.web;

const oauth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]
);

// generate a url that asks permissions Google Calendar scope
const scopes = [
    'https://www.googleapis.com/auth/calendar'
];

function generateAuthUrl() {
    const url = oauth2Client.generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: 'offline',

        // If you only need one scope you can pass it as a string
        scope: scopes
    });

    return url;
}

async function getTokens(code) {
    // This will provide an object with the access_token and refresh_token.
    // Save these somewhere safe so they can be used at a later time.
    const { tokens } = await oauth2Client.getToken(code);
    // oauth2Client.setCredentials(tokens);
    return tokens;
}


async function listEvents(token, timeMin, timeMax) {
    oauth2Client.setCredentials(token);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    let result = [], status;

    try {
        const res = await calendar.events.list({
            calendarId: 'primary',
            timeMin: timeMin,
            timeMax: timeMax,
            singleEvents: true
            // orderBy: 'startTime',
        });
        result = res.data.items;
        status = 'success';
    } catch (e) {
        result = e;
        status = 'error';
        console.log('The API returned an error: ' + e);
    }
    return { status, result };
}

async function insertEvent(token, event, sendUpdates) {
    oauth2Client.setCredentials(token);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    let status, res;
    const sendNotifications = sendUpdates ? 'all' : 'none';
    try {
        res = await calendar.events.insert({
            auth: oauth2Client,
            calendarId: 'primary',
            resource: event,
            sendUpdates: sendNotifications
        });
        status = 'success';
    } catch (e) {
        console.log('There was an error contacting the Calendar service: ' + e);
        status = 'error';
    }

    return {res, status};
}

module.exports = {
    getTokens,
    generateAuthUrl,
    listEvents,
    insertEvent
};

