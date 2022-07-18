# Grab-Spread-Sheet

## Prerequisites

1. Set Up a google API project and Google API Service Account (this set up can be a pain to do but there is no avoiding it)
2. Use this [link](https://console.cloud.google.com/apis/dashboard), create a project and fill out its info
3. Remember to enable Google Spreadsheet API
4. Click on "credentials" on the left side bar, then click "manage service accounts"
5. You should be taken to an IAM page. Under the service accounts section, go to keys, create a new key.
6. Store the file containing your info in enviroment variable called "SERVICE_ACCOUNT_FILE_PATH"
7. To access any spreadsheet, the spreadsheet will have to be shared with the Service Account email


## How to use the function

Note that getSpreadSheet() is an async function, so you would need to do something like const res = await getSpreadSheet(link, range).

### Link or ID
The link part could either be a valid spreadsheet URL or the ID contained within that URL. The ID comes after the '/d/'. 
https://docs.google.com/spreadsheets/d/this-part-right-here-is-the-id/. 

### Ranges
The range is also a required argument and it must be in a special string format. Let's say your spreadsheet has 2 sheets. These sheets
are the tabs you see at the bottom. They have the default names of Sheet1, Sheet2, etc. 

If you want to only access Sheet1 data, you would set argument 'ranges' to something like '&ranges=Sheet1!A1:F7'. The A1 represents the 
top leftmost tile. The F7 represents the bottom right most tile. Note, the code will default the first row to be your header row so 
adjust the range accordingly.

Let's say you have 2 sheets, one is named Bob and another is named Jones. You want both thier data. You could then just set range
to be the following: '&ranges=Bob!A1:K8&ranges=Jones!B2:F3'. As you can see, you just need to simply repeat this for more sheets.

### Output
If successful, the function will output an array of arrays (representing sheets) that each contain headers: item mappings.
Remmember that your header is based on the first row of your range. Any empty headers will be defaulted to 'UNKNOWN' and
any empty items will be undefined. 

