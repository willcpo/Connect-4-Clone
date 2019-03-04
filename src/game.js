// require your module, connectmoji
const c = require('./connectmoji.js');
// require any other modules that you need, like clear and readline-sync
const readlineSync = require('readline-sync');
const clear = require('clear');

let moveString;
let rows;
let cols;
let numConsecutive;
let p1;
let p2;
let board;
let result;
let currPlayer;

if (process.argv[2] !== undefined){
    arguments = process.argv[2].split(',');

    const playerValue = arguments[0];
    moveString = [...arguments[1]];
    
    
    rows = arguments[2];
    cols = arguments[3];
    numConsecutive = arguments[4];

    if(moveString[0]===playerValue){
        p1 = moveString[0];
        p2 = moveString[1];   
    } else {
        
        p1 = moveString[1];
        p2 = moveString[0];   
    
    }
    moveString = arguments[1];

    board = c.generateBoard(rows, cols, null);
    
    result = c.autoplay(board, moveString, numConsecutive, null);
    
    currPlayer = result.lastPieceMoved===p1 ? "Computer" : "Player";
    board = result.board;
    readlineSync.question('press ENTER to continue');
    clear();
    console.log(c.boardToString(result.board, null));

}else{

    let config = readlineSync.question(`Enter the number of rows, columns, and consecutive "pieces" for win
    (all separated by commas... for example: 6,7,4)
    >`);
    config = config.split(',').map((item)=>{
        return item.trim();
    });
    rows = config[0] || 6;
    cols = config[1] || 7;
    numConsecutive = config[2] || 4;
    console.log(`Using row, col and consecutive: ${rows} ${cols} ${numConsecutive}`);
    board = c.generateBoard(rows, cols, null);


    let characters = readlineSync.question(`Enter two characters that represent the player and computer
    (separated by a comma... for example: P,C)
    >`);
    characters=characters.split(",");

    p1 = characters[0] ||'😎';
    p2 = characters[1] ||'💻';
    console.log(`Using player and computer characters: ${p1} ${p2}`);
    

    const p = readlineSync.question(`Who goes first, (P)layer or (C)omputer?
    >`);
    currPlayer = p.toLowerCase()==="c" ? 'Computer':'Player';
    console.log(`${currPlayer} goes first`);

    readlineSync.question(`Press <ENTER> to start game`);

    result = {};
    clear();
    console.log(c.boardToString(board, null));
}
while(result.winner === undefined&&c.getAvailableColumns(board, null).length!==0){

    const availableCols = c.getAvailableColumns(board, null);

    if (currPlayer==='Player'){

        let col = readlineSync.question(`Choose a column letter to drop your piece in
        >`).toUpperCase();

        while (!availableCols.includes(col)){
            col = readlineSync.question(`Oops, that is not a valid move, try again!
            Choose a column letter to drop your piece in
            > `).toUpperCase();
        }


        clear();
        console.log(`...dropping in column ${col}`);

        const data = c.getEmptyRowCol(board, col, null);
        board = c.setCell(board, data.row, data.col, p1);
        result.winner = c.hasConsecutiveValues(board, data.row, data.col, numConsecutive, null)?p1: undefined;
        console.log(c.boardToString(board, null));


        currPlayer='Computer';
    }else {

        ///Decide Computer Move
        const col = availableCols[Math.floor(Math.random()*availableCols.length)];

        readlineSync.question(`Press <ENTER> to see computer move`);
        clear();
        console.log(`...dropping in column ${col}`);

        const data = c.getEmptyRowCol(board, col, null);
        board = c.setCell(board, data.row, data.col, p2);
        result.winner = c.hasConsecutiveValues(board, data.row, data.col, numConsecutive, null)? p2 : undefined;
        console.log(c.boardToString(board, null));

        currPlayer='Player';
    }

}

if (c.getAvailableColumns(board, null).length===0){
    console.log("No winner. So sad 😭");
}else{
    const winner = currPlayer==="Computer"? p1 : p2;
    console.log("Winner is "+ winner);
}