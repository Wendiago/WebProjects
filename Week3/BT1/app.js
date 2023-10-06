const app = {
    //Keep track of pawns first movement
    blackPawnFirstMove: true,
    whitePawnFirstMove: true,

    //Keep track of current piece
    dragTarget: null,

    //Win state
    hasBlackWon: false,
    hasWhiteWon: false,

    chessboardLayoutInitialize: function(){
        const chessboard = document.querySelector('.chessboard');
        let evenPattern = '<div data-position = "" class = "even-row-square"></div>';
        let oddPattern = '<div data-position = "" class = "odd-row-square"></div>';
    
        for (i = 0; i < 4; i++){
            chessboard.innerHTML += evenPattern.repeat(8);
            chessboard.innerHTML += oddPattern.repeat(8);
        }
    
        /*Set position to each square*/
        const squares = chessboard.querySelectorAll('[class*="row-square"]');
        for (i = 1; i < 9; i++){
            for (j = 1; j < 9; j++){
                let squareIndex = (i-1) * 8 + (j-1);
                squares[squareIndex].dataset.position = `${i}${j}`;
            }
        }
    },

    chesspiecesLayoutInitialize: function(){
        const chessboard = document.querySelector('.chessboard');

        /* Initialize chess play - place chess on board */
        const initialChessboardLayout = [
            ["brook", "bknight", "bbishop", "bqueen", "bking", "bbishop", "bknight", "brook"],
            ["bpawn", "bpawn", "bpawn", "bpawn", "bpawn", "bpawn", "bpawn", "bpawn"],
            ["", "", "", "", "", "", "", ""], // Empty row
            ["", "", "", "", "", "", "", ""], // Empty row
            ["", "", "", "", "", "", "", ""], // Empty row
            ["", "", "", "", "", "", "", ""], // Empty row
            ["wpawn", "wpawn", "wpawn", "wpawn", "wpawn", "wpawn", "wpawn", "wpawn"],
            ["wrook", "wknight", "wbishop", "wqueen", "wking", "wbishop", "wknight", "wrook"],
        ];
    
        const squares = chessboard.querySelectorAll('[class*="row-square"]');
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const squareIndex = i * 8 + j;
                const pieceName = initialChessboardLayout[i][j];
    
                //Add chesspiece to the square
                if(pieceName){
                    squares[squareIndex].innerHTML = '<img class="piece" draggable="true" data-position = "" data-piece="" src="" alt=""></img>'
                    const pieceImg = squares[squareIndex].querySelector('.piece');
    
                    // Set the src attribute for the chess piece image
                    pieceImg.src = `./assets/img/${pieceName}.png`; // Update the path accordingly
                    pieceImg.alt = pieceName;
                    pieceImg.dataset.piece = pieceName; 
                    pieceImg.dataset.position = `${i+1}${j+1}`
                }
            }
        }
    },
    
    convertToCoordinates: function(pos){
        return {
            row: parseInt(pos[0]),
            col: parseInt(pos[1])
        };
    },

    convertToPositions: function(num1, num2){
        return `${num1}${num2}`;
    },

    haveChessPiece: function(square){
        const chessPiece = square.querySelector(`img`);
        if (chessPiece != null){
            return true;
        }
        return false;
    },

    haveChessPieceToCapture: function(coor, dragTarget){
        let pos = this.convertToPositions(coor.row, coor.col);
        const chessboard = document.querySelector('.chessboard');
        const chessPiece = chessboard.querySelector(`img[data-position="${pos}"]`);

        if (chessPiece != null){
            //find the color of the chess piece, if not match => can capture 
            const chessPieceColor = chessPiece.dataset.piece[0];
            if (chessPieceColor != dragTarget.dataset.piece[0]){
                return true;
            }
        }
        return false;
    },

    calculateValidMove: function(dragTarget){
        let currentCoor = this.convertToCoordinates(dragTarget.dataset.position);
        let chessName = dragTarget.dataset.piece;
        let validMovement = [];

        //Pawn can move 2 squares at first, but can only move 1 later
        //Can only capture diagonally
        //Can only go upwards
        if(chessName.includes('pawn')){
            //if the pawn is black
            if(chessName === 'bpawn'){
                //If this is the first move
                if(this.blackPawnFirstMove === true){
                    validMovement.push(this.convertToPositions(currentCoor.row+2, currentCoor.col));   
                }
                //If pawn can still move up
                if (currentCoor.row < 8){
                    validMovement.push(this.convertToPositions(currentCoor.row+1, currentCoor.col));
                }
                //Capture logic
                if (currentCoor.row < 8){
                    //Column 2-7:
                    if (currentCoor.col > 1 && currentCoor.col < 8){
                        let leftDiag = {
                            row: currentCoor.row+1,
                            col: currentCoor.col-1,
                        };
                        let rightDiag = {
                            row: currentCoor.row+1,
                            col: currentCoor.col+1,
                        };
                        //If the diag have white chess piece
                        if (this.haveChessPieceToCapture(leftDiag, dragTarget) === true )
                        {
                            validMovement.push(this.convertToPositions(leftDiag.row, leftDiag.col));
                        }
                        if (this.haveChessPieceToCapture(rightDiag, dragTarget) === true )
                        {
                            validMovement.push(this.convertToPositions(rightDiag.row, rightDiag.col));
                        }
                    }
                    //Column 1
                    if (currentCoor.col === 1){
                        let rightDiag = {
                            row: currentCoor.row+1,
                            col: currentCoor.col+1,
                        };
                        if (this.haveChessPieceToCapture(rightDiag, dragTarget) === true )
                        {
                            validMovement.push(this.convertToPositions(rightDiag.row, rightDiag.col));
                        }
                    }
                    //Column 8
                    if (currentCoor.col === 8){
                        let leftDiag = {
                            row: currentCoor.row+1,
                            col: currentCoor.col-1,
                        };
                        if (this.haveChessPieceToCapture(leftDiag, dragTarget) === true )
                        {
                            validMovement.push(this.convertToPositions(leftDiag.row, leftDiag.col));
                        }
                    }
                }
            }
            //if the pawn is white
            if(chessName === 'wpawn'){
                //If this is the first move
                if(this.whitePawnFirstMove === true){
                    validMovement.push(this.convertToPositions(currentCoor.row-2, currentCoor.col));
                }
                //If pawn can still move up
                if (currentCoor.row > 1){
                    validMovement.push(this.convertToPositions(currentCoor.row-1, currentCoor.col));
                }
                //Capture logic
                if (currentCoor.row > 1){
                    //Column 2-7:
                    if (currentCoor.col > 1 && currentCoor.col < 8){
                        let leftDiag = {
                            row: currentCoor.row-1,
                            col: currentCoor.col-1,
                        };
                        let rightDiag = {
                            row: currentCoor.row-1,
                            col: currentCoor.col+1,
                        };
                        //If the diag have black chess piece
                        if (this.haveChessPieceToCapture(leftDiag, dragTarget) === true )
                        {
                            validMovement.push(this.convertToPositions(leftDiag.row, leftDiag.col));
                        }
                        if (this.haveChessPieceToCapture(rightDiag, dragTarget) === true )
                        {
                            validMovement.push(this.convertToPositions(rightDiag.row, rightDiag.col));
                        }
                    }
                    //Column 1
                    if (currentCoor.col === 1){
                        let rightDiag = {
                            row: currentCoor.row-1,
                            col: currentCoor.col+1,
                        };
                        if (this.haveChessPieceToCapture(rightDiag, dragTarget) === true )
                        {
                            validMovement.push(this.convertToPositions(rightDiag.row, rightDiag.col));
                        }
                    }
                    //Column 8
                    if (currentCoor.col === 8){
                        let leftDiag = {
                            row: currentCoor.row-1,
                            col: currentCoor.col-1,
                        };
                        if (this.haveChessPieceToCapture(leftDiag, dragTarget) === true )
                        {
                            validMovement.push(this.convertToPositions(leftDiag.row, leftDiag.col));
                        }
                    }
                }
            }
        }

        //Rook can only move horizontally or vertically
        //Rook can't move over other chess pieces
        if(chessName.includes('rook')){
            const chessboard = document.querySelector('.chessboard');
            const squares = chessboard.querySelectorAll('[class*="row-square"]'); 
            let row = currentCoor.row;
            let col = currentCoor.col;

            // Check the top path
            for (let i = row - 1; i >= 1; i--) {
                const squareIndex = (i - 1) * 8 + col - 1;
                const square = squares[squareIndex];

                //Encounter a chess piece
                if (this.haveChessPiece(square)) {
                    if (square.children[0].dataset.piece[0] !== dragTarget.dataset.piece[0]) {
                        // It's an opposite color piece, allow capturing
                        validMovement.push(this.convertToPositions(i, col));
                    }
                    break; // Stop checking in this direction
                } else {
                    // Empty square, valid move
                    validMovement.push(this.convertToPositions(i, col));
                }
            }

            // Check the right path
            for (let j = col + 1; j <= 8; j++) {
                const squareIndex = (row - 1) * 8 + j - 1;
                const square = squares[squareIndex];

                //Encounter a chess piece
                if (this.haveChessPiece(square)) {
                    if (square.children[0].dataset.piece[0] !== dragTarget.dataset.piece[0]) {
                        // It's an opposite color piece, allow capturing
                        validMovement.push(this.convertToPositions(row, j));
                    }
                    break; // Stop checking in this direction
                } else {
                    // Empty square, valid move
                    validMovement.push(this.convertToPositions(row, j));
                }
            }

            // Check the left path
            for (let j = col - 1; j >= 1; j--) {
                const squareIndex = (row - 1) * 8 + j - 1;
                const square = squares[squareIndex];

                //Encounter a chess piece
                if (this.haveChessPiece(square)) {
                    if (square.children[0].dataset.piece[0] !== dragTarget.dataset.piece[0]) {
                        // It's an opposite color piece, allow capturing
                        validMovement.push(this.convertToPositions(row, j));
                    }
                    break; // Stop checking in this direction
                } else {
                    // Empty square, valid move
                    validMovement.push(this.convertToPositions(row, j));
                }
            }

            // Check the bottom path
            for (let i = row + 1; i <= 8; i++) {
                const squareIndex = (i - 1) * 8 + col - 1;
                const square = squares[squareIndex];

                //Encounter a chess piece
                if (this.haveChessPiece(square)) {
                    if (square.children[0].dataset.piece[0] !== dragTarget.dataset.piece[0]) {
                        // It's an opposite color piece, allow capturing
                        validMovement.push(this.convertToPositions(i, col));
                    }
                    break; // Stop checking in this direction
                } else {
                    // Empty square, valid move
                    validMovement.push(this.convertToPositions(i, col));
                }
            }
        }

        // Knight can move in an L-shape (2 squares in one direction and 1 square perpendicular to that).
        // Check all 8 possible knight moves from its current position.
        if(chessName.includes('knight')){
            const chessboard = document.querySelector('.chessboard');
            const possibleMoves = [
                { row: currentCoor.row - 2, col: currentCoor.col - 1 },
                { row: currentCoor.row - 2, col: currentCoor.col + 1 },
                { row: currentCoor.row - 1, col: currentCoor.col - 2 },
                { row: currentCoor.row - 1, col: currentCoor.col + 2 },
                { row: currentCoor.row + 1, col: currentCoor.col - 2 },
                { row: currentCoor.row + 1, col: currentCoor.col + 2 },
                { row: currentCoor.row + 2, col: currentCoor.col - 1 },
                { row: currentCoor.row + 2, col: currentCoor.col + 1 },
            ];
        
            // Check if each move is valid (within the board boundaries and not blocked by your own piece).
            possibleMoves.forEach((move) => {
                if (
                    move.row >= 1 && move.row <= 8 &&
                    move.col >= 1 && move.col <= 8 
                ) {
                    //Select the target square
                    const targetSquare = chessboard.querySelector(`[data-position="${this.convertToPositions(move.row, move.col)}"]`);
                    if (this.haveChessPiece(targetSquare)){
                        //If there is a chess piece that can be captured => valid move 
                        if (this.haveChessPieceToCapture(move, dragTarget))
                        {
                            validMovement.push(this.convertToPositions(move.row, move.col));
                        }
                    }
                    else{
                        //If the target square is empty
                        validMovement.push(this.convertToPositions(move.row, move.col));
                    }
                }
            });
        }

        //Bishop can only move diagonally
        //Bishop can't move over other chess pieces
        if(chessName.includes('bishop')){
            const chessboard = document.querySelector('.chessboard');
            const squares = chessboard.querySelectorAll('[class*="row-square"]');
            let row = currentCoor.row;
            let col = currentCoor.col;

            // Check the top-left diagonal
            for (let i = row - 1, j = col - 1; i >= 1 && j >= 1; i--, j--) {
                const squareIndex = (i - 1) * 8 + j - 1;
                const square = squares[squareIndex];

                // Encounter a chess piece
                if (this.haveChessPiece(square)) {
                    if (square.children[0].dataset.piece[0] !== dragTarget.dataset.piece[0]) {
                        // It's an opposite color piece, allow capturing
                        validMovement.push(this.convertToPositions(i, j));
                    }
                    break; // Stop checking in this direction
                } else {
                    // Empty square, valid move
                    validMovement.push(this.convertToPositions(i, j));
                }
            }

            // Check the top-right diagonal
            for (let i = row - 1, j = col + 1; i >= 1 && j <= 8; i--, j++) {
                const squareIndex = (i - 1) * 8 + j - 1;
                const square = squares[squareIndex];

                // Encounter a chess piece
                if (this.haveChessPiece(square)) {
                    if (square.children[0].dataset.piece[0] !== dragTarget.dataset.piece[0]) {
                        // It's an opposite color piece, allow capturing
                        validMovement.push(this.convertToPositions(i, j));
                    }
                    break; // Stop checking in this direction
                } else {
                    // Empty square, valid move
                    validMovement.push(this.convertToPositions(i, j));
                }
            }

            // Check the bottom-left diagonal
            for (let i = row + 1, j = col - 1; i <= 8 && j >= 1; i++, j--) {
                const squareIndex = (i - 1) * 8 + j - 1;
                const square = squares[squareIndex];

                // Encounter a chess piece
                if (this.haveChessPiece(square)) {
                    if (square.children[0].dataset.piece[0] !== dragTarget.dataset.piece[0]) {
                        // It's an opposite color piece, allow capturing
                        validMovement.push(this.convertToPositions(i, j));
                    }
                    break; // Stop checking in this direction
                } else {
                    // Empty square, valid move
                    validMovement.push(this.convertToPositions(i, j));
                }
            }

            // Check the bottom-right diagonal
            for (let i = row + 1, j = col + 1; i <= 8 && j <= 8; i++, j++) {
                const squareIndex = (i - 1) * 8 + j - 1;
                const square = squares[squareIndex];

                // Encounter a chess piece
                if (this.haveChessPiece(square)) {
                    if (square.children[0].dataset.piece[0] !== dragTarget.dataset.piece[0]) {
                        // It's an opposite color piece, allow capturing
                        validMovement.push(this.convertToPositions(i, j));
                    }
                    break; // Stop checking in this direction
                } else {
                    // Empty square, valid move
                    validMovement.push(this.convertToPositions(i, j));
                }
            }
        }

        //King can move anywhere but only 1 square each time
        if(chessName.includes('king')){
            const chessboard = document.querySelector('.chessboard');
            const squares = chessboard.querySelectorAll('[class*="row-square"]');
            const row = currentCoor.row;
            const col = currentCoor.col;
            // Define possible king moves in all directions
            const kingMoves = [
                { row: row - 1, col: col - 1 },
                { row: row - 1, col },
                { row: row - 1, col: col + 1 },
                { row, col: col - 1 },
                { row, col: col + 1 },
                { row: row + 1, col: col - 1 },
                { row: row + 1, col },
                { row: row + 1, col: col + 1 },
            ];

            // Check each possible king move
            for (const move of kingMoves) {
                // Check if the move is within the board boundaries
                if (move.row >= 1 && move.row <= 8 && move.col >= 1 && move.col <= 8) {
                    const squareIndex = (move.row - 1) * 8 + move.col - 1;
                    const targetSquare = squares[squareIndex];
                    // Check if the square is empty or occupied by an opponent's piece
                    if (!this.haveChessPiece(targetSquare) || this.haveChessPieceToCapture(move, dragTarget)) {
                        validMovement.push(this.convertToPositions(move.row, move.col));
                    }
                }
            }
        }

        //Queen can't move over other chess piece
        //Queen can move anywhere
        if(chessName.includes('queen')){
            const chessboard = document.querySelector('.chessboard');
            const squares = chessboard.querySelectorAll('[class*="row-square"]');
            const row = currentCoor.row;
            const col = currentCoor.col;

            // Define possible queen moves in all directions
            const queenMoves = [
                // Horizontal and Vertical Moves
                { dRow: -1, dCol: 0 }, // Up
                { dRow: 1, dCol: 0 },  // Down
                { dRow: 0, dCol: -1 }, // Left
                { dRow: 0, dCol: 1 },  // Right
                // Diagonal Moves
                { dRow: -1, dCol: -1 }, // Up-Left
                { dRow: -1, dCol: 1 },  // Up-Right
                { dRow: 1, dCol: -1 },  // Down-Left
                { dRow: 1, dCol: 1 },   // Down-Right
            ];

            // Check each possible queen move
            for (const move of queenMoves) {
                let newRow = row + move.dRow;
                let newCol = col + move.dCol;

                while (newRow >= 1 && newRow <= 8 && newCol >= 1 && newCol <= 8) {
                    const targetSquareIndex = (newRow - 1) * 8 + newCol - 1;
                    const targetSquare = squares[targetSquareIndex];

                    // If the square is empty, it's a valid move
                    if (!this.haveChessPiece(targetSquare)) {
                        validMovement.push(this.convertToPositions(newRow, newCol));
                    }
                    // If the square is occupied by an opponent's piece, it's a valid capture move
                    else if (this.haveChessPieceToCapture({ row: newRow, col: newCol }, dragTarget)) {
                        validMovement.push(this.convertToPositions(newRow, newCol));
                        break; // Stop checking in this direction after capturing
                    }
                    // If the square is occupied by your own piece, you can't move beyond it
                    else {
                        break; // Stop checking in this direction
                    }
                    newRow += move.dRow;
                    newCol += move.dCol;
                }
            }
        }

        return validMovement;
    },
    
    //Determines if the square is valid for a chess piece to drop
    isValidSquare: function(validMovement, squarePosition) {
        let isPresent = validMovement.some((element)=>element.includes(squarePosition));
        return isPresent;
    },

    handleEvent: function(){
        const chessboard = document.querySelector('.chessboard');
        const squares = chessboard.querySelectorAll('[class*="row-square"]');
        const chessImgs = chessboard.querySelectorAll('div[class*="row-square"] img');
        
        chessImgs.forEach((chessImg)=>{
            chessImg.addEventListener('dragstart', (e)=>{
                dragTarget = e.target;
                let validSquaresPosition = this.calculateValidMove(dragTarget);
                
                //Highlight possible move
                validSquaresPosition.forEach((validPos)=>{
                    squares.forEach((square) => {
                        if (square.dataset.position === validPos) {
                            square.classList.add('highlight');
                        }
                    });
                })
                setTimeout(() => {
                    e.target.classList.add('hide');
                }, 0);
            });
        })

        squares.forEach((square) => {
            let targetSquare = null; 
            let validMovement;
            square.addEventListener('dragenter', (e)=>{
                if (dragTarget){
                    validMovement = this.calculateValidMove(dragTarget);
                }
                //if (this.isValidSquare(validMovement, e.target.dataset.position)){
                    e.preventDefault();
                    // If the target is an img, find the square which has that img
                    if (e.target.tagName === 'IMG') {
                        const squarePosition = e.target.dataset.position;

                        // Loop through squares to find the matching square
                        squares.forEach((square) => {
                            if (square.dataset.position === squarePosition) {
                                targetSquare = square;
                                return;
                            }
                        });
                    } else {
                        targetSquare = e.target; // If the target is a square
                    }

                    if (targetSquare) {
                        //targetSquare.classList.add('drag-over');
                    }
                //}
            })
            square.addEventListener('dragover', (e)=>{
                //if (this.isValidSquare(validMovement, e.target.dataset.position)){
                    e.preventDefault();
                    //targetSquare.classList.add('drag-over');
                //}
            });
            square.addEventListener('dragleave', (e)=>{
                //if (this.isValidSquare(validMovement, e.target.dataset.position)){
                    //targetSquare.classList.remove('drag-over');
                //}
            });

            //Drop an img into an empty square => e.target is the square
            //Drop an img into a square that has img => e.target is the img
            square.addEventListener('drop', (e)=>{
                if (this.isValidSquare(validMovement, e.target.dataset.position)){
                    //targetSquare.classList.remove('drag-over');
                    //Drop into an empty square
                    if (dragTarget){
                        //If the square already has img => remove the img
                        const existingImg = targetSquare.querySelector('img');
                        if (existingImg){
                            targetSquare.removeChild(existingImg);
                            //If king is captured => Stop the game and notify the winner
                            if (existingImg.dataset.piece.includes('king')){
                                const winScreen = document.querySelector(".winning-screen");
                                winScreen.style.display = 'block';
                            }
                        }

                        // Check if the piece is a pawn and update its first move status
                        if (dragTarget.dataset.piece.includes('pawn')) {
                            const currentPieceColor = dragTarget.dataset.piece[0];
                            if (currentPieceColor === 'b' && this.blackPawnFirstMove) {
                                this.blackPawnFirstMove = false; // Black pawn has moved
                            } else if (currentPieceColor === 'w' && this.whitePawnFirstMove) {
                                this.whitePawnFirstMove = false; // White pawn has moved
                            }
                        }

                        //Remove all highlight
                        squares.forEach((square) => {
                            square.classList.remove('highlight');
                        });

                        //Update the position of the new chess piece before appending
                        dragTarget.dataset.position = e.target.dataset.position;
                        targetSquare.appendChild(dragTarget);
                        dragTarget.classList.remove('hide');
                        dragTarget = null;
                    }
                }
                // Drop into an invalid square
                else{
                    dragTarget.classList.remove('hide');
                    //Remove all highlight
                    squares.forEach((square) => {
                        square.classList.remove('highlight');
                    });
                    dragTarget = null;
                }
            });
        })
    },
    start: function(){
        this.chessboardLayoutInitialize();
        this.chesspiecesLayoutInitialize();
        this.handleEvent();
    }
}

app.start();