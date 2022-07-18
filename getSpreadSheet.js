const axios = require('axios');
const { MAX_ACCESS_BOUNDARY_RULES_COUNT } = require('google-auth-library/build/src/auth/downscopedclient');
const env = require('dotenv').config();
const {google} = require('googleapis');

const {
    SERVICE_ACCOUNT_FILE_PATH: credentialsLoc
} = process.env;


/* checks input and parses out id if link is provided */
function getIdFromLink(idOrLink) {
    if (
        typeof idOrLink !== 'string'    ||  // is not a string   
        idOrLink.match(/\s/)            ||  // contains white space
        idOrLink.length === 0               // empty string

    ) return null;
    
    // uses regex to find ID in link
    const regex = /docs\.google\.com\/spreadsheets\/d\/.*\//;
    const match = idOrLink.match(regex);
    if (match !== null) return match[0].substring(31, match[0].length - 1)
    
    return idOrLink;
}


/* parses the googlesheet by header description */
async function parseSpreadSheet(spreadSheet, maxColumns = [26]) {
    const sheets = spreadSheet.data.sheets;
    const fullData = [];

    // parses each sheet
    sheets.forEach(function(item, index) {

        const maxRow = item.data[0].rowData.length;
        const maxCol = maxColumns[index];
        const headerRows = item.data[0].rowData[0].values
        const sheetData = [];
        const headerArray = [];

        // initiates header array
        if (headerRows === undefined) {
            for (hc = 0; hc < maxCol; hc++) { 
                headerArray[hc] = `UNKNOWN${hc + 1}`;
            }
        } else {
            for (let unknowns = 1, hc = 0; hc < maxCol; hc++) {
                if (hc < headerRows.length && headerRows[hc].formattedValue !== undefined) {
                    headerArray[hc] = headerRows[hc].formattedValue;
                } else {
                    headerArray[hc] = `UNKNOWN${unknowns}`;
                    unknowns++;
                }
            }
        }        

        // goes through each content row and column
        for (let r = 1; r < maxRow; r++) {
            const row = {};
             for (let c = 0; c < maxCol; c++) {
                const values = item.data[0].rowData[r].values;
                const value = (values !== undefined && c < values.length) ? values[c].formattedValue : undefined;
                row[headerArray[c]] = value;
             }
             sheetData.push(row); 
        }

        fullData.push(sheetData);
    });

    return fullData;
}


/* Request access token from service account and get rid of trailing periods */
async function getRequestToken() {

    const auth = new google.auth.GoogleAuth({
        keyFile: `${credentialsLoc}`,
        scopes: 'https://www.googleapis.com/auth/spreadsheets'
    });

    const accessToken = await auth.getAccessToken()
    return accessToken.replace(/\.+$/, '');
}


/* Converts "ranges" parameter from getSpreadSheet to a numeric array of column ranges */
function convertToMaxColumns(ranges) {
    if (typeof ranges !== 'string') return null;
    if (ranges.match(/^((&ranges=.+![a-zA-Z][0-9]+:[a-zA-Z][0-9]+)+)$/) === null) return null;

    const res = [];
    const rangeList = ranges.match(/([a-zA-Z][0-9]+:[a-zA-Z][0-9]+)/g);
    rangeList.forEach(function(item) { 
        res.push(item.charCodeAt(item.indexOf(':') + 1) - item.charCodeAt(0) + 1) 
    });

    return res;
}

/* Request to get the spread sheet */
async function getSpreadSheet(idOrLink, ranges) {

    const maxColumns = convertToMaxColumns(ranges);
    if (maxColumns === null) { return 'Ranges need to be A1 notation String' };

    const id = getIdFromLink(idOrLink);
    if (id === null) { return "Invalid id or link" };

    try {
        const accessToken = await getRequestToken();
        try {
            const googleSheet = await axios.get(
                `https://sheets.googleapis.com/v4/spreadsheets/${id}/?includeGridData=true${ranges}`,
                { headers: { 'Authorization': `Bearer ${accessToken}` } }
            )

            try { return await parseSpreadSheet(googleSheet, maxColumns) }

            catch { return 'Parsing failed'}
        } catch { return 'Spreadsheet request Failed' }
    } catch { return 'Could not get Request Token' }
}


/* For testing */
async function testThis(idOrLink, ranges = '&ranges=Sheet1!A2:F6') {
    console.log(await getSpreadSheet(idOrLink, ranges));
}

// example: ranges = '&ranges=Sheet1!A1:D5&ranges=Sheet2!A1:C4' (make sure to have the '&' and put it in that format)

module.exports = {getIdFromLink, convertToMaxColumns, parseSpreadSheet, getSpreadSheet, getRequestToken};