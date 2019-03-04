const wcwidth = require('wcwidth');

module.exports = {


    generateBoard: (rows, cols, fill=null)=>{

        return {
            data: new Array(cols*rows).fill(fill),
            rows,
            cols
        };

    }, 
        
    rowColToIndex: (board, row, col)=>{ 
        return col + row*board.cols;
    }, 

    indexToRowCol: (board, i)=>{
        
        return {
            row: Math.floor(i/board.cols),
            col: i%board.cols
        };
    },

    setCell: (board, row, col, value)=>{
        const temp = [...board.data];
        temp[col + row*board.cols]= value;
        
        
        return {
            data: temp,
            rows: board.rows,
            cols: board.cols
        };
    },

    setCells: (board, ...moves)=>{

        const temp = [...board.data];
        moves.map((item)=>{
            temp[item.col + item.row*board.cols]= item.val;
        });
        
        
        return {
            data: temp,
            rows: board.rows,
            cols: board.cols
        };

    },

    boardToString: (board, empty=null)=>{
        
        let charLength=0;
        for (let i=0;i<board.cols;i++){
            for (let j=0;j<board.rows;j++){
                charLength = Math.max(charLength, wcwidth(board.data[i + j*board.cols]));
            }
        }

        let string = "";

        let blankChar = "   ";
        for (let k=1;k<charLength;k++) {blankChar += " "; }

        for (let i=0;i<board.rows;i++){
            string+="|";
            for (let j=0;j<board.cols;j++){

                const index = j + i*board.cols;

                let value = " " + board.data[index] + " ";

                const curCharLength = wcwidth(board.data[index]);

                for (let k=0;k<charLength-curCharLength;k++) {value += " ";}

                string+= board.data[index]===empty? blankChar : value;
                string+="|";


            }
            string+="\n";
        }
        

        let line = "---";
        for (let k=1;k<charLength;k++) {line += "-";}

        string +="|"+line;

        for (let j=1;j<board.cols;j++){
            string +="+"+line;
        }
        string +="|\n";

        let letter = 65;

        let padding = " ";
        for (let k=0;k<charLength-1;k++) {padding += " ";}

        for (let j=0;j<board.cols;j++){

            string +="| "+String.fromCharCode(letter++)+padding;
        }
        string +="|";

        return string;
    },

    letterToCol: (letter)=>{
        if ( typeof letter !== "string"){
            return null;
        }
        const firstLet = letter.codePointAt(0)-65;
        if (firstLet<0||firstLet>25||letter.length>1){
            return null;
        }
        return firstLet;
    },

    getEmptyRowCol: (board, letter, empty=null)=>{
        
        const col = module.exports.letterToCol(letter);
        if (col===null||col>board.cols-1) {return null;}

        let ret = null;
        for (let i=board.rows-1;i>=0;i--){
            if (board.data[col + i*board.cols]===empty&&ret===null) {ret = {row: i, col};}
            else if (board.data[col + i*board.cols] !== empty) {ret = null;}
        }
        return ret;
    },

    getAvailableColumns: (board, empty=null)=>{

        const ret = [];
        for (let j=0;j<board.cols;j++){
            if (module.exports.getEmptyRowCol(board, String.fromCharCode(j+65), empty)!==null){
                ret.push(String.fromCharCode(j+65));
            }
        } 
        return ret;
    },

    hasConsecutiveValues: (board, row, col, n, empty=null)=>{

        const value = board.data[module.exports.rowColToIndex(board, row, col)];
        if (value===empty){return false;}
       // console.log("N->S");
        if (module.exports.search('N',board, row, col)+module.exports.search('S',board, row, col)+1>=n) {return true;}
       // console.log("E->W");
        if (module.exports.search('E',board, row, col)+module.exports.search('W',board, row, col)+1>=n) {return true;}
       // console.log("NW->SE");
        if (module.exports.search('NW',board, row, col)+module.exports.search('SE',board, row, col)+1>=n) {return true;}
       // console.log("SW->NE");
        if (module.exports.search('SW',board, row, col)+module.exports.search('NE',board, row, col)+1>=n) {return true;}
       // console.log("---->");

        return false;

    },

    search: (Dir,board, row, col)=>{

        let goRight,goDown;
        const stopN = 0;
        const stopS = board.rows-1;
        const stopE = board.cols-1;
        const stopW = 0; 
        
        switch (Dir) {
            case 'N':
                goRight=0;
                goDown=-1;
                break;
            case 'S':
                goRight=0;
                goDown=1;
                break;
            case 'E':
                goRight=1;
                goDown=0;
                break;
            case 'W':
                goRight=-1;
                goDown=0;
                break;
            case 'NE':
                goRight=1;
                goDown=-1;
                break;
            case 'NW':
                goRight=-1;
                goDown=-1;
                break;
            case 'SE':
                goRight=1;
                goDown=1;
                break;
            case 'SW':
                goRight=-1;
                goDown=1;
                break;
        }

        const currIndex= module.exports.rowColToIndex(board, row, col);
        const goToIndex= module.exports.rowColToIndex(board, row+goDown, col+goRight); 

        let count=0;

       // console.log(" in row "+row+", col "+col+", stopN "+stopN+", stopS "+stopS+", stopE "+stopE+", stopW "+stopW);
       // console.log(""+(row !=stopN && ( Dir === "N" || Dir === "NE" || Dir === "NW" )))
       // console.log(""+(row !=stopS && ( Dir === "S" || Dir === "SE" || Dir === "SW" )))
       // console.log(""+(col !=stopE && ( Dir === "E" || Dir === "NE" || Dir === "SE" )))
       // console.log(""+(col !=stopW && ( Dir === "W" || Dir === "NW" || Dir === "SW" )))
       // console.log(board.data[currIndex]===board.data[goToIndex])

        if (!((row ===stopN && ( Dir === "N" || Dir === "NE" || Dir === "NW" )) ||
            (row ===stopS && ( Dir === "S" || Dir === "SE" || Dir === "SW" )) ||
            (col ===stopE && ( Dir === "E" || Dir === "NE" || Dir === "SE" )) ||
            (col ===stopW && ( Dir === "W" || Dir === "NW" || Dir === "SW" ))) &&

        board.data[currIndex]===board.data[goToIndex]){

            

               // console.log("Going "+Dir);
                count += 1+module.exports.search(Dir,board, row+goDown, col+goRight);
        
        }
        
        return count;
    },

    autoplay: (board, s, numConsecutive, empty=null)=>{

        s=[...s];
        const p1 =s[0];
        const p2 =s[1];

        const ret = {
            board,
            pieces: [p1, p2],
          };

          let markedForDeath = false;

        for (let i=2;i<s.length;i++){
            const data = module.exports.getEmptyRowCol(ret.board, s[i]);
            ret.lastPieceMoved = s[i%2];
            if (data===null||markedForDeath===true){
                delete ret.winner;
                ret.error={
                    num:i-1,
                    val: s[i%2],
                    col: s[i]
                };
                ret.board = null;
                break;
            }else{
                ret.board = module.exports.setCell(ret.board, data.row, data.col, s[i%2]);
            }
            if (module.exports.hasConsecutiveValues(ret.board, data.row, data.col, numConsecutive, empty)){
                markedForDeath=true;
                ret.winner = s[i%2];
            }
            

        }
        return ret;
          
    }
};