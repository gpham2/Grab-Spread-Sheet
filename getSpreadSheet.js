const axios = require("axios");
const env = require('dotenv').config();

const {
    SPREADSHEET_ACCESS_TOKEN: token,
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

/* TODO: Request access token */
async function getRequestToken() {

    return token;
}


/* Request to get the spread sheet */
async function getSpreadSheet(idOrLink, includeGridData = false, ranges = '') {
    // example: ranges = '&ranges=A1:D5&ranges=Sheet2!A1:C4' (make sure to have the '&')

    const id = getIdFromLink(idOrLink);
    if (id === null) {console.log("invalid Input"); return "Invalid Input"};

    
    try {
        const accessToken = await getRequestToken();
        try {
        
            const googleSheet = await axios.get(
                `https://sheets.googleapis.com/v4/spreadsheets/${id}/?includeGridData=${includeGridData}${ranges}`,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            )
            console.log(googleSheet);
            return googleSheet;

        } catch {
            console.log("Spreadsheet request Failed");
            return "Spreadsheet request Failed";
        }

    } catch {
        console.log("Could not get Request Token");
        return "Could not get Request Token";
    }
}

getSpreadSheet('https://docs.google.com/spreadsheets/d/1iKPzYZ0qNQluas8W_xkro4Q7hAbY7V_Lto1Sizw7ErM/edit#gid=0')