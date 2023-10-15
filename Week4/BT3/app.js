$(document).ready(function() {
    // Keep track of pawns' first movement
    var blackPawnFirstMove = true;
    var whitePawnFirstMove = true;
    
    // Keep track of the current piece
    var dragTarget = null;
    
    // Win state
    var hasWon = false;
    
    // Chessboard layout initialization
    function chessboardLayoutInitialize() {
        const chessboard = $('.chessboard');
        const evenPattern = '<div data-position="" class="even-row-square"></div>';
        const oddPattern = '<div data-position="" class="odd-row-square"></div>';
    
        for (var i = 0; i < 4; i++) {
            chessboard.append(evenPattern.repeat(8));
            chessboard.append(oddPattern.repeat(8));
        }
    
        // Set position for each square
        const squares = $('.row-square');
        for (var i = 1; i < 9; i++) {
            for (var j = 1; j < 9; j++) {
                var squareIndex = (i - 1) * 8 + (j - 1);
                squares.eq(squareIndex).attr('data-position', i + '' + j);
            }
        }
    }
    
    // Chess pieces layout initialization
    function chesspiecesLayoutInitialize() {
        const initialChessboardLayout = [
            ["brook", "bknight", "bbishop", "bqueen", "bking", "bbishop", "bknight", "brook"],
            ["bpawn", "bpawn", "bpawn", "bpawn", "bpawn", "bpawn", "bpawn", "bpawn"],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["wpawn", "wpawn", "wpawn", "wpawn", "wpawn", "wpawn", "wpawn", "wpawn"],
            ["wrook", "wknight", "wbishop", "wqueen", "wking", "wbishop", "wknight", "wrook"],
        ];
    
        const squares = $('[class*="row-square"]');
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                var squareIndex = i * 8 + j;
                var pieceName = initialChessboardLayout[i][j];
    
                // Add chess piece to the square
                if (pieceName) {
                    squares.eq(squareIndex).html('<img class="piece" draggable="true" data-position="" data-piece="" src="" alt=""></img>');
                    var pieceImg = squares.eq(squareIndex).find('.piece');
    
                    // Set the src attribute for the chess piece image
                    pieceImg.attr('src', './assets/img/' + pieceName + '.png'); // Update the path accordingly
                    pieceImg.attr('alt', pieceName);
                    pieceImg.attr('data-piece', pieceName);
                    pieceImg.attr('data-position', (i + 1) + '' + (j + 1));
                }
            }
        }
    }
    
    // Convert to coordinates
    function convertToCoordinates(pos) {
        return {
            row: parseInt(pos[0]),
            col: parseInt(pos[1])
        };
    }
    
    // Convert to positions
    function convertToPositions(num1, num2) {
        return num1 + '' + num2;
    }
    
    // Check if there's a chess piece on a square
    function haveChessPiece(square) {
        return square.find('img').length > 0;
    }
    
    // Check if there's a chess piece to capture on a square
    function haveChessPieceToCapture(coor, dragTarget) {
        var pos = convertToPositions(coor.row, coor.col);
        var chessPiece = $('.chessboard').find(`img[data-position="${pos}"]`);
    
        if (chessPiece.length > 0) {
            // Find the color of the chess piece, if it doesn't match, it can be captured
            var chessPieceColor = chessPiece.data('piece')[0];
            if (chessPieceColor != dragTarget.data('piece')[0]) {
                return true;
            }
        }
    
        return false;
    }
    
    // Calculate valid moves for a chess piece
    function calculateValidMove(dragTarget) {
        var currentCoor = convertToCoordinates(dragTarget.data('position'));
        var chessName = dragTarget.data('piece');
        var validMovement = [];
    
        // Pawn can move 2 squares at first, but can only move 1 later
        // Can only capture diagonally
        // Can only go upwards
        if (chessName.includes('pawn')) {
            // If the pawn is black
            if (chessName === 'bpawn') {
                // If this is the first move
                if (blackPawnFirstMove) {
                    validMovement.push(convertToPositions(currentCoor.row + 2, currentCoor.col));
                }
                // If pawn can still move up
                if (currentCoor.row < 8) {
                    validMovement.push(convertToPositions(currentCoor.row + 1, currentCoor.col));
                }
                // Capture logic
                if (currentCoor.row < 8) {
                    // Column 2-7:
                    if (currentCoor.col > 1 && currentCoor.col < 8) {
                        var leftDiag = {
                            row: currentCoor.row + 1,
                            col: currentCoor.col - 1,
                        };
                        var rightDiag = {
                            row: currentCoor.row + 1,
                            col: currentCoor.col + 1,
                        };
                        // If the diag has a white chess piece
                        if (haveChessPieceToCapture(leftDiag, dragTarget)) {
                            validMovement.push(convertToPositions(leftDiag.row, leftDiag.col));
                        }
                        if (haveChessPieceToCapture(rightDiag, dragTarget)) {
                            validMovement.push(convertToPositions(rightDiag.row, rightDiag.col));
                        }
                    }
                    // Column 1
                    if (currentCoor.col === 1) {
                        var rightDiag = {
                            row: currentCoor.row + 1,
                            col: currentCoor.col + 1,
                        };
                        if (haveChessPieceToCapture(rightDiag, dragTarget)) {
                            validMovement.push(convertToPositions(rightDiag.row, rightDiag.col));
                        }
                    }
                    // Column 8
                    if (currentCoor.col === 8) {
                        var leftDiag = {
                            row: currentCoor.row + 1,
                            col: currentCoor.col - 1,
                        };
                        if (haveChessPieceToCapture(leftDiag, dragTarget)) {
                            validMovement.push(convertToPositions(leftDiag.row, leftDiag.col));
                        }
                    }
                }
            }
            // If the pawn is white
            if (chessName === 'wpawn') {
                // If this is the first move
                if (whitePawnFirstMove) {
                    validMovement.push(convertToPositions(currentCoor.row - 2, currentCoor.col));
                }
                // If pawn can still move down
                if (currentCoor.row > 1) {
                    validMovement.push(convertToPositions(currentCoor.row - 1, currentCoor.col));
                }
                // Capture logic
                if (currentCoor.row > 1) {
                    // Column 2-7:
                    if (currentCoor.col > 1 && currentCoor.col < 8) {
                        var leftDiag = {
                            row: currentCoor.row - 1,
                            col: currentCoor.col - 1,
                        };
                        var rightDiag = {
                            row: currentCoor.row - 1,
                            col: currentCoor.col + 1,
                        };
                        // If the diag has a black chess piece
                        if (haveChessPieceToCapture(leftDiag, dragTarget)) {
                            validMovement.push(convertToPositions(leftDiag.row, leftDiag.col));
                        }
                        if (haveChessPieceToCapture(rightDiag, dragTarget)) {
                            validMovement.push(convertToPositions(rightDiag.row, rightDiag.col));
                        }
                    }
                    // Column 1
                    if (currentCoor.col === 1) {
                        var rightDiag = {
                            row: currentCoor.row - 1,
                            col: currentCoor.col + 1,
                        };
                        if (haveChessPieceToCapture(rightDiag, dragTarget)) {
                            validMovement.push(convertToPositions(rightDiag.row, rightDiag.col));
                        }
                    }
                    // Column 8
                    if (currentCoor.col === 8) {
                        var leftDiag = {
                            row: currentCoor.row - 1,
                            col: currentCoor.col - 1,
                        };
                        if (haveChessPieceToCapture(leftDiag, dragTarget)) {
                            validMovement.push(convertToPositions(leftDiag.row, leftDiag.col));
                        }
                    }
                }
            }
        }
    
        // Rook can move in straight lines
        if (chessName.includes('rook')) {
            // Move vertically
            for (var i = currentCoor.row + 1; i <= 8; i++) {
                var pos = convertToPositions(i, currentCoor.col);
                if (haveChessPiece($('.chessboard').find('div[data-position="' + pos + '"]')) && !haveChessPieceToCapture({ row: i, col: currentCoor.col }, dragTarget)) {
                    break;
                }
                validMovement.push(pos);
                if (haveChessPieceToCapture({ row: i, col: currentCoor.col }, dragTarget)) {
                    break;
                }
            }
            for (var i = currentCoor.row - 1; i >= 1; i--) {
                var pos = convertToPositions(i, currentCoor.col);
                if (haveChessPiece($('.chessboard').find('div[data-position="' + pos + '"]')) && !haveChessPieceToCapture({ row: i, col: currentCoor.col }, dragTarget)) {
                    break;
                }
                validMovement.push(pos);
                if (haveChessPieceToCapture({ row: i, col: currentCoor.col }, dragTarget)) {
                    break;
                }
            }
            // Move horizontally
            for (var i = currentCoor.col + 1; i <= 8; i++) {
                var pos = convertToPositions(currentCoor.row, i);
                if (haveChessPiece($('.chessboard').find('div[data-position="' + pos + '"]')) && !haveChessPieceToCapture({ row: currentCoor.row, col: i }, dragTarget)) {
                    break;
                }
                validMovement.push(pos);
                if (haveChessPieceToCapture({ row: currentCoor.row, col: i }, dragTarget)) {
                    break;
                }
            }
            for (var i = currentCoor.col - 1; i >= 1; i--) {
                var pos = convertToPositions(currentCoor.row, i);
                if (haveChessPiece($('.chessboard').find('div[data-position="' + pos + '"]')) && !haveChessPieceToCapture({ row: currentCoor.row, col: i }, dragTarget)) {
                    break;
                }
                validMovement.push(pos);
                if (haveChessPieceToCapture({ row: currentCoor.row, col: i }, dragTarget)) {
                    break;
                }
            }
        }
    
        // Knight moves in L-shape (2x1 or 1x2)
        if (chessName.includes('knight')) {
            var possibleMoves = [
                { row: currentCoor.row + 2, col: currentCoor.col - 1 },
                { row: currentCoor.row + 2, col: currentCoor.col + 1 },
                { row: currentCoor.row - 2, col: currentCoor.col - 1 },
                { row: currentCoor.row - 2, col: currentCoor.col + 1 },
                { row: currentCoor.row + 1, col: currentCoor.col - 2 },
                { row: currentCoor.row + 1, col: currentCoor.col + 2 },
                { row: currentCoor.row - 1, col: currentCoor.col - 2 },
                { row: currentCoor.row - 1, col: currentCoor.col + 2 },
            ];
    
            for (var move of possibleMoves) {
                if (move.row >= 1 && move.row <= 8 && move.col >= 1 && move.col <= 8) {
                    var pos = convertToPositions(move.row, move.col);
                    if (!haveChessPiece($('.chessboard').find('div[data-position="' + pos + '"]')) || haveChessPieceToCapture(move, dragTarget)) {
                        validMovement.push(pos);
                    }
                }
            }
        }
    
        // Bishop can move diagonally
        if (chessName.includes('bishop')) {
            // Top-left diagonal
            for (var i = 1; currentCoor.row - i > 0 && currentCoor.col - i > 0; i++) {
                var pos = convertToPositions(currentCoor.row - i, currentCoor.col - i);
                if (haveChessPiece($('.chessboard').find('div[data-position="' + pos + '"]') && !haveChessPieceToCapture({ row: currentCoor.row - i, col: currentCoor.col - i }, dragTarget))) {
                    break;
                }
                validMovement.push(pos);
                if (haveChessPieceToCapture({ row: currentCoor.row - i, col: currentCoor.col - i }, dragTarget)) {
                    break;
                }
            }
            // Top-right diagonal
            for (var i = 1; currentCoor.row - i > 0 && currentCoor.col + i <= 8; i++) {
                var pos = convertToPositions(currentCoor.row - i, currentCoor.col + i);
                if (haveChessPiece($('.chessboard').find('div[data-position="' + pos + '"]') && !haveChessPieceToCapture({ row: currentCoor.row - i, col: currentCoor.col + i }, dragTarget))) {
                    break;
                }
                validMovement.push(pos);
                if (haveChessPieceToCapture({ row: currentCoor.row - i, col: currentCoor.col + i }, dragTarget)) {
                    break;
                }
            }
            // Bottom-left diagonal
            for (var i = 1; currentCoor.row + i <= 8 && currentCoor.col - i > 0; i++) {
                var pos = convertToPositions(currentCoor.row + i, currentCoor.col - i);
                if (haveChessPiece($('.chessboard').find('div[data-position="' + pos + '"]') && !haveChessPieceToCapture({ row: currentCoor.row + i, col: currentCoor.col - i }, dragTarget))) {
                    break;
                }
                validMovement.push(pos);
                if (haveChessPieceToCapture({ row: currentCoor.row + i, col: currentCoor.col - i }, dragTarget)) {
                    break;
                }
            }
            // Bottom-right diagonal
            for (var i = 1; currentCoor.row + i <= 8 && currentCoor.col + i <= 8; i++) {
                var pos = convertToPositions(currentCoor.row + i, currentCoor.col + i);
                if (haveChessPiece($('.chessboard').find('div[data-position="' + pos + '"]') && !haveChessPieceToCapture({ row: currentCoor.row + i, col: currentCoor.col + i }, dragTarget))) {
                    break;
                }
                validMovement.push(pos);
                if (haveChessPieceToCapture({ row: currentCoor.row + i, col: currentCoor.col + i }, dragTarget)) {
                    break;
                }
            }
        }
    
        // Queen can move diagonally and in straight lines
        if (chessName.includes('queen')) {
            // Rook-like movement
            // Move vertically
            for (var i = currentCoor.row + 1; i <= 8; i++) {
                var pos = convertToPositions(i, currentCoor.col);
                if (haveChessPiece($('.chessboard').find('div[data-position="' + pos + '"]')) && !haveChessPieceToCapture({ row: i, col: currentCoor.col }, dragTarget)) {
                    break;
                }
                validMovement.push(pos);
                if (haveChessPieceToCapture({ row: i, col: currentCoor.col }, dragTarget)) {
                    break;
                }
            }
            for (var i = currentCoor.row - 1; i >= 1; i--) {
                var pos = convertToPositions(i, currentCoor.col);
                if (haveChessPiece($('.chessboard').find('div[data-position="' + pos + '"]')) && !haveChessPieceToCapture({ row: i, col: currentCoor.col }, dragTarget)) {
                    break;
                }
                validMovement.push(pos);
                if (haveChessPieceToCapture({ row: i, col: currentCoor.col }, dragTarget)) {
                    break;
                }
            }
            // Move horizontally
            for (var i = currentCoor.col + 1; i <= 8; i++) {
                var pos = convertToPositions(currentCoor.row, i);
                if (haveChessPiece($('.chessboard').find('div[data-position="' + pos + '"]')) && !haveChessPieceToCapture({ row: currentCoor.row, col: i }, dragTarget)) {
                    break;
                }
                validMovement.push(pos);
                if (haveChessPieceToCapture({ row: currentCoor.row, col: i }, dragTarget)) {
                    break;
                }
            }
            for (var i = currentCoor.col - 1; i >= 1; i--) {
                var pos = convertToPositions(currentCoor.row, i);
                if (haveChessPiece($('.chessboard').find('div[data-position="' + pos + '"]')) && !haveChessPieceToCapture({ row: currentCoor.row, col: i }, dragTarget)) {
                    break;
                }
                validMovement.push(pos);
                if (haveChessPieceToCapture({ row: currentCoor.row, col: i }, dragTarget)) {
                    break;
                }
            }
            // Bishop-like movement
            // Top-left diagonal
            for (var i = 1; currentCoor.row - i > 0 && currentCoor.col - i > 0; i++) {
                var pos = convertToPositions(currentCoor.row - i, currentCoor.col - i);
                if (haveChessPiece($('.chessboard').find('div[data-position="' + pos + '"]') && !haveChessPieceToCapture({ row: currentCoor.row - i, col: currentCoor.col - i }, dragTarget))) {
                    break;
                }
                validMovement.push(pos);
                if (haveChessPieceToCapture({ row: currentCoor.row - i, col: currentCoor.col - i }, dragTarget)) {
                    break;
                }
            }
            // Top-right diagonal
            for (var i = 1; currentCoor.row - i > 0 && currentCoor.col + i <= 8; i++) {
                var pos = convertToPositions(currentCoor.row - i, currentCoor.col + i);
                if (haveChessPiece($('.chessboard').find('div[data-position="' + pos + '"]') && !haveChessPieceToCapture({ row: currentCoor.row - i, col: currentCoor.col + i }, dragTarget))) {
                    break;
                }
                validMovement.push(pos);
                if (haveChessPieceToCapture({ row: currentCoor.row - i, col: currentCoor.col + i }, dragTarget)) {
                    break;
                }
            }
            // Bottom-left diagonal
            for (var i = 1; currentCoor.row + i <= 8 && currentCoor.col - i > 0; i++) {
                var pos = convertToPositions(currentCoor.row + i, currentCoor.col - i);
                if (haveChessPiece($('.chessboard').find('div[data-position="' + pos + '"]') && !haveChessPieceToCapture({ row: currentCoor.row + i, col: currentCoor.col - i }, dragTarget))) {
                    break;
                }
                validMovement.push(pos);
                if (haveChessPieceToCapture({ row: currentCoor.row + i, col: currentCoor.col - i }, dragTarget)) {
                    break;
                }
            }
            // Bottom-right diagonal
            for (var i = 1; currentCoor.row + i <= 8 && currentCoor.col + i <= 8; i++) {
                var pos = convertToPositions(currentCoor.row + i, currentCoor.col + i);
                if (haveChessPiece($('.chessboard').find('div[data-position="' + pos + '"]') && !haveChessPieceToCapture({ row: currentCoor.row + i, col: currentCoor.col + i }, dragTarget))) {
                    break;
                }
                validMovement.push(pos);
                if (haveChessPieceToCapture({ row: currentCoor.row + i, col: currentCoor.col + i }, dragTarget)) {
                    break;
                }
            }
        }
    
        return validMovement;
    }
    
    function handleEvent () {
        const chessboard = $('.chessboard');
        const squares = $('[class*="row-square"]');
        const chessImgs = $('div[class*="row-square"] img');

        chessImgs.forEach((chessImg)=>{
            chessImg.on('dragstart', function (e) {
                dragTarget = $(this);
                const validSquaresPosition = calculateValidMove(dragTarget);
    
                // Highlight possible moves
                validSquaresPosition.forEach((validPos) => {
                    squares.each(function () {
                        if ($(this).data('position') === validPos) {
                            $(this).addClass('highlight');
                        }
                    });
                });
    
                setTimeout(() => {
                    e.target.classList.add('hide');
                }, 0);
            });
        })
        
        squares.forEach((square => {
            let validMovement;
            square.on('dragenter', function (e) {
                if (dragTarget) {
                    if (dragTarget){
                        validMovement = calculateValidMove(dragTarget);
                    }
                    
                    e.preventDefault();

                    if (e.target.tagName === 'IMG') {
                        const squarePosition = $(e.target).data('position');
                        squares.each(function () {
                            if ($(this).data('position') === squarePosition) {
                                targetSquare = $(this);
                                return;
                            }
                        });
                    } else {
                        targetSquare = $(this);
                    }
                }
            });

            square.on('dragover', function (e) {
                e.preventDefault();  
            });

            square.on('dragleave', function (e) {
            });

            square.on('drop', function (e) {
                if (isValidSquare(validMovement, $(this).data('position'))) {
                    if (dragTarget) {
                        const existingImg = targetSquare.find('img');
                        if (existingImg.length) {
                            const lostZone = existingImg.data('piece')[0] === 'w' ? $('.white-lost-list') : $('.black-lost-list');
                            const capturedPiece = `<img class="lost-piece" data-piece="" src="./assets/img/${existingImg.data('piece')}.png" alt=""></img>`;
                            lostZone.append(capturedPiece);
                            existingImg.remove();

                            if (existingImg.data('piece').includes('king')) {
                                $('.winning-screen').show();
                            }
                        }

                        if (dragTarget.data('piece').includes('pawn')) {
                            const currentPieceColor = dragTarget.data('piece')[0];
                            if ((currentPieceColor === 'b' && blackPawnFirstMove) || (currentPieceColor === 'w' && whitePawnFirstMove)) {
                                blackPawnFirstMove = whitePawnFirstMove = false;
                            }
                        }

                        squares.removeClass('highlight');
                        dragTarget.data('position', $(this).data('position'));
                        targetSquare.append(dragTarget);
                        dragTarget.removeClass('hide');
                        dragTarget = null;
                    }
                } else {
                    dragTarget.removeClass('hide');
                    squares.removeClass('highlight');
                    dragTarget = null;
                }
            });
        }))
    }

    function start () {
        chessboardLayoutInitialize();
        chesspiecesLayoutInitialize();
        handleEvent();
    }

    start()
})

