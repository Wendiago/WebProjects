const app = {
    //Keep track of pawns first movement
    blackPawnFirstMove: true,
    whitePawnFirstMove: true,

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

    haveChessPieceToCapture: function(coor, currentPieceColor){
        let pos = this.convertToPositions(coor.row, coor.col);
        const chessboard = document.querySelector('.chessboard');
        const chessPiece = chessboard.querySelector(`img[data-position="${pos}"]`);

        if (chessPiece != null){
            //find the color of the chess piece, if not match => can capture 
            const chessPieceColor = chessPiece.dataset.piece[0];
            if (chessPieceColor != currentPieceColor){
                return true;
            }
        }
        return false;
    },

    calculateValidMove: function(position, chessName){
        let currentCoor = this.convertToCoordinates(position);
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
                        if (this.haveChessPieceToCapture(leftDiag, 'b') === true )
                        {
                            validMovement.push(this.convertToPositions(leftDiag.row, leftDiag.col));
                        }
                        if (this.haveChessPieceToCapture(rightDiag, 'b') === true )
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
                        if (this.haveChessPieceToCapture(rightDiag, 'b') === true )
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
                        if (this.haveChessPieceToCapture(leftDiag, 'b') === true )
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
                        if (this.haveChessPieceToCapture(leftDiag, 'w') === true )
                        {
                            validMovement.push(this.convertToPositions(leftDiag.row, leftDiag.col));
                        }
                        if (this.haveChessPieceToCapture(rightDiag, 'w') === true )
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
                        if (this.haveChessPieceToCapture(rightDiag, 'w') === true )
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
                        if (this.haveChessPieceToCapture(leftDiag, 'w') === true )
                        {
                            validMovement.push(this.convertToPositions(leftDiag.row, leftDiag.col));
                        }
                    }
                }
            }
        }
        if(chessName.includes('rook')){
            
        }
        if(chessName.includes('knight')){
            //
        }
        if(chessName.includes('bishop')){
            //
        }
        if(chessName.includes('king')){
            //
        }
        if(chessName.includes('queen')){
            //
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
        
        let dragTarget = null;
        chessImgs.forEach((chessImg)=>{
            chessImg.addEventListener('dragstart', (e)=>{
                dragTarget = e.target;
                let validSquaresPosition = this.calculateValidMove(dragTarget.dataset.position, dragTarget.dataset.piece);
                
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
                    validMovement = this.calculateValidMove(dragTarget.dataset.position, dragTarget.dataset.piece);
                }
                if (this.isValidSquare(validMovement, e.target.dataset.position)){
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
                }
            })
            square.addEventListener('dragover', (e)=>{
                if (this.isValidSquare(validMovement, e.target.dataset.position)){
                    e.preventDefault();
                    //targetSquare.classList.add('drag-over');
                }
            });
            square.addEventListener('dragleave', (e)=>{
                if (this.isValidSquare(validMovement, e.target.dataset.position)){
                    //targetSquare.classList.remove('drag-over');
                }
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