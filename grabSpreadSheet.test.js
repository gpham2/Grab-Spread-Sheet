const {getIdFromLink, convertToMaxColumns, parseSpreadSheet, getSpreadSheet, getRequestToken} = require('./getSpreadSheet.js');



/* getIDFromLink Test */

const idLinkTest = [
    ['https://docs.google.com/spreadsheets/d/1oW-jfbZHd1FSP-5bpKl2lTrAUUT7tuLDMq8KPlB-vB0/edit#gid=0',
    '1oW-jfbZHd1FSP-5bpKl2lTrAUUT7tuLDMq8KPlB-vB0'
    ],

    ['docs.google.com/spreadsheets/d/1oW-jfbZHd1FSP-5bpKl2lTrAUUT7tuLDMq8KPlB-vB0/edit#gid=0',
    '1oW-jfbZHd1FSP-5bpKl2lTrAUUT7tuLDMq8KPlB-vB0'
    ],

    ['https://docs.google.com/spreadsheets/d/abcdefg/',
    'abcdefg'
    ],

    ['not a valid link',
    null
    ],

    ['thisShouldWork',
    'thisShouldWork'
    ],

    [null,
    null
    ],

    ['',
    null
    ],

    [123,
    null
    ],
]

for (let i = 0; i < idLinkTest.length; i++) {
    test(`case: ${i} result: ${getIdFromLink(idLinkTest[i][0])}`, () => {
        expect(getIdFromLink(idLinkTest[i][0])).toBe(idLinkTest[i][1]);
    });
}


/* convertToMaxColumns Test */

const columnsTest = [
    ['&ranges=Sheet1!A1:D5',
    [4],
    ],

    ['&ranges=blahblah!A1:E5',
    [5],
    ],

    ['&ranges=soemthign!!!!!E1:E5',
    [1],
    ],

    ['&ranges=a!E1:E5&ranges=b!A1:E5',
    [1, 5],
    ],

    ['&ranges=a!E1:E5&ranges=b!A1:E5&ranges=c!B1:C5&ranges=d!C1:E5',
    [1, 5, 2, 3],
    ],

    ['&ranges=a!E1:E5&ranges=b!A111:E32&ranges=c!B122:C542&ranges=d!C1:E5',
    [1, 5, 2, 3],
    ],

    [123,
    null,
    ],

    [null,
    null,
    ],

    [undefined,
    null,
    ],

    ['abc',
    null,
    ],
]

for (let i = 0; i < idLinkTest.length; i++) {
    test(`case: ${i} result: ${convertToMaxColumns(columnsTest[i][0])}`, () => {
        expect(convertToMaxColumns(columnsTest[i][0])).toEqual(columnsTest[i][1] === null ? null : columnsTest[i][1]);
    });
}