// ==UserScript==
// @name         Export Results
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       Probably Stackoverflow
// @description  Adds live example button, with styling.
// @match        *://beta.simracing.gp/events/*
// @grant        GM_addStyle
// ==/UserScript==

/*--- Create a button in a container div.  It will be styled and
    positioned with CSS.
*/
var zNode       = document.createElement ('div');
zNode.innerHTML = '<button id="myButton" type="button">'
                + 'Download Result File</button>'
                ;
zNode.setAttribute ('id', 'myContainer');
document.body.appendChild (zNode);

//--- Activate the newly added button.
document.getElementById ("myButton").addEventListener (
    "click", ButtonClickAction, false
);

function ButtonClickAction (zEvent) {
    /*--- For our dummy action, we'll just add a line of text to the top
        of the screen.
    var zNode       = document.createElement ('p');
    zNode.innerHTML = 'The button was clicked.';
    document.getElementById ("myContainer").appendChild (zNode);*/
  function parseTable(tableSelector = 'div.v-window-item--active table') {
    const tableElement = document.querySelector(tableSelector);
    const rows = tableElement.querySelectorAll(`tr`);
    const table = Array.from(rows).map((row) => {
      const cols = row.querySelectorAll('td');
      var playerMap = Array.from(cols).map((col) =>col.innerText);
      if(typeof row.querySelector('img') !== 'undefined' && row.querySelector('img') !== null){
        let flag = row.querySelector('img').src.toString();
        playerMap.push(flag.split('/')[5].split('.')[0]);
      }else{
        playerMap.push("-");
      }
      return playerMap;
    });
    return table;
  }

  function createCSVDataUrl(content) {
    return `data:text/csv;charset=utf-8,${encodeURIComponent(content)}`;
  }

  function downloadDataUrl(data, filename) {
    const link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('target', '_blank');
    link.setAttribute('download', filename);
    link.click();
  }

  function serializeTableAsCSV(table, separator = ',') {
    return table.map((row) => row.join(separator)).join('\n');
  }

  function convertCellToTableDurationFormat(text) {
    return text.replace(/:(?=\d\d\d)/, '.').replace(/\n\x2a/g,'');
  }

  const table = parseTable().map((row) =>
    row.map(convertCellToTableDurationFormat)
  );
  const csvDataUrl = createCSVDataUrl(serializeTableAsCSV(table));

  downloadDataUrl(csvDataUrl, document.querySelector(".sgp-race-name").innerText+'.csv');

}

//--- Style our newly added elements using CSS.
GM_addStyle ( `
    #myContainer {
        position:               absolute;
        top:                    0;
        left:                   0;
        font-size:              20px;
        background:             orange;
        border:                 3px outset black;
        margin:                 5px;
        opacity:                0.9;
        z-index:                1100;
        padding:                5px 20px;
        margin-left:            50px;
    }
    #myButton {
        cursor:                 pointer;
    }
    #myContainer p {
        color:                  red;
        background:             white;
    }
` );

