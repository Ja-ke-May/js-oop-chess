// Pieces
class ChessPiece {
        constructor(color, icon, name, position, points) {
            this.color = color;
            this.icon = icon;
            this.name = name;
            this.position = position;
            this.promoted = false;
            this.points = points || 1; // 1 if not provided
        }

        getPoints() {
            return this.points;
        }
    
        isValidSquare(square) {
            const validHorizontal = square.x >= 0 && square.x < 8;
            const validVertical = square.y >= 0 && square.y < 8;
            return validHorizontal && validVertical;
        }
    
        isMoveValid(targetSquare, currentPosition) {
            // Check if target square is valid square
            if (!this.isValidSquare(targetSquare)) {
                return false;
            }
    
            // Check if any pieces in path
            const deltaX = targetSquare.x - currentPosition.x;
            const deltaY = targetSquare.y - currentPosition.y;
    
            for (let i = 1; i < Math.max(Math.abs(deltaX), Math.abs(deltaY)); i++) {
                const intermediateSquare = {
                    x: currentPosition.x + i * Math.sign(deltaX),
                    y: currentPosition.y + i * Math.sign(deltaY)
                };
    
                if (findPieceAtPosition(intermediateSquare)) {
                    return false; // Obstruction in path
                }
            }
    
            return true;
        }
    
        highlightLegalMoves() {
            const legalMoves = this.getLegalMoves();
            legalMoves.forEach(move => {
                const squareElement = getSquareElement(move); 
                if (squareElement) {
                    squareElement.classList.add('highlighted-square');
                }
            });
        }
    
        removeHighlights() {
            const legalMoves = this.getLegalMoves();
            legalMoves.forEach(move => {
                const squareElement = getSquareElement(move); 
                if (squareElement) {
                    squareElement.classList.remove('highlighted-square');
                }
            });
        }
    
        isLegalMove(targetSquare, currentPosition = this.position) {
            const legalMoves = this.getLegalMoves(currentPosition);
            return legalMoves.some(move => move.x === targetSquare.x && move.y === targetSquare.y);
        }
    
        movePieceTo(targetSquare) {
            if (this.isLegalMove(targetSquare)) {
                this.position = targetSquare;
            }
        }
    }
    
// Pawn
class Pawn extends ChessPiece {
        constructor(color, icon, name, position, points) {
            super(color, icon, name, position, points);
        }

        points = 1;

        getLegalMoves(currentPosition = this.position) {
            const legalMoves = [];
            const direction = this.color === 'white' ? 1 : -1;
    
            // Forward move
            const forwardMove = { x: currentPosition.x, y: currentPosition.y + direction };
            if (this.isValidSquare(forwardMove) && !findPieceAtPosition(forwardMove)) {
                legalMoves.push(forwardMove);
    
                // Double move from start
                const doubleMove = { x: currentPosition.x, y: currentPosition.y + 2 * direction };
                if (this.isValidSquare(doubleMove) && currentPosition.y === (this.color === 'white' ? 1 : 6) && !findPieceAtPosition(doubleMove)) {
                    legalMoves.push(doubleMove);
                } 
            }
    
            // Diagonal attacks
            const diagonalAttackLeft = { x: currentPosition.x - 1, y: currentPosition.y + direction };
            const diagonalAttackRight = { x: currentPosition.x + 1, y: currentPosition.y + direction };
    
            [diagonalAttackLeft, diagonalAttackRight].forEach((diagonalMove) => {
                if (this.isValidSquare(diagonalMove)) {
                    const pieceAtDiagonal = findPieceAtPosition(diagonalMove);
                    if (pieceAtDiagonal && pieceAtDiagonal.color !== this.color) {
                        legalMoves.push(diagonalMove);
                    }
                }
            });
            return legalMoves;
        }
    }       

// Rook class
class Rook extends ChessPiece {
        constructor(color, icon, name, position, points) {
            super(color, icon, name, position, points);
        }
    
        points = 5;

        getLegalMoves(currentPosition = this.position) {
            const legalMoves = [];
            if (!currentPosition) {
                return legalMoves;
            }
    
            // Horizontal moves
            for (let i = 0; i < 8; i++) {
                if (i !== currentPosition.x) {
                    const move = { x: i, y: currentPosition.y };
                    if (this.isMoveValid(move, currentPosition)) {
                        legalMoves.push(move);
                    }
                }
            }
    
            // Vertical moves
            for (let i = 0; i < 8; i++) {
                if (i !== currentPosition.y) {
                    const move = { x: currentPosition.x, y: i };
                    if (this.isMoveValid(move, currentPosition)) {
                        legalMoves.push(move);
                    }
                }
            }
    
            return legalMoves;
        }
    
        isMoveValid(targetSquare, currentPosition) {
            // Check if target square is valid square
            if (!this.isValidSquare(targetSquare)) {
                return false;
            }
    
            // Check if move is horizontal/vertical
            if (targetSquare.x !== currentPosition.x && targetSquare.y !== currentPosition.y) {
                return false;
            }
    
            // Check if there are any pieces in path
            const deltaX = targetSquare.x - currentPosition.x;
            const deltaY = targetSquare.y - currentPosition.y;
    
            for (let i = 1; i < Math.max(Math.abs(deltaX), Math.abs(deltaY)); i++) {
                const intermediateSquare = {
                    x: currentPosition.x + i * Math.sign(deltaX),
                    y: currentPosition.y + i * Math.sign(deltaY)
                };
    
                if (findPieceAtPosition(intermediateSquare)) {
                    return false;
                }
            }
    
            return true;
        }
    }
    
// Knight
class Knight extends ChessPiece {
        constructor(color, icon, name, position, points) {
            super(color, icon, name, position, points);
        }

        points = 3;
    
        getLegalMoves(currentPosition = this.position) {
            const legalMoves = [];
            if (!currentPosition) {
                return legalMoves;
            }
    
            const moves = [
                { x: 2, y: 1 }, { x: 1, y: 2 },
                { x: -2, y: 1 }, { x: -1, y: 2 },
                { x: 2, y: -1 }, { x: 1, y: -2 },
                { x: -2, y: -1 }, { x: -1, y: -2 }
            ];
    
            for (const move of moves) {
                const newPosition = { x: currentPosition.x + move.x, y: currentPosition.y + move.y };
                if (this.isValidSquare(newPosition)) {
                    legalMoves.push(newPosition);
                }
            }
    
            return legalMoves;
        }
    
        isMoveValid(targetSquare, currentPosition) {
            if (!this.isValidSquare(targetSquare)) {
                return false;
            }
    
            // Check if move is an L-shaped jump for knights
            const deltaX = Math.abs(targetSquare.x - currentPosition.x);
            const deltaY = Math.abs(targetSquare.y - currentPosition.y);
    
            return (deltaX === 1 && deltaY === 2) || (deltaX === 2 && deltaY === 1);
        }
    }
    

// Bishop 
class Bishop extends ChessPiece {
    constructor(color, icon, name, position, points) {
        super(color, icon, name, position, points);
    }

    points = 3;

    getLegalMoves(currentPosition = this.position) {
        const legalMoves = [];


        // Diagonal moves
        for (let i = 1; i < 8; i++) {
            const moves = [
                { x: i, y: i },
                { x: i, y: -i },
                { x: -i, y: i },
                { x: -i, y: -i }
            ];

            for (const move of moves) {
                const newSquare = {
                    x: currentPosition.x + move.x,
                    y: currentPosition.y + move.y
                };

                if (this.isMoveValid(newSquare, currentPosition)) {
                    legalMoves.push(newSquare);
                }
            }
        }

        return legalMoves;
    }
}

// Queen
class Queen extends ChessPiece {
    constructor(color, icon, name, position, points) {
        super(color, icon, name, position, points);
    }

    points = 9;

    getLegalMoves(currentPosition = this.position) {
        const legalMoves = [];

        // Horizontal and Vertical moves
        for (let i = 0; i < 8; i++) {
            if (i !== currentPosition.x) {
                legalMoves.push({ x: i, y: currentPosition.y });
            }

            if (i !== currentPosition.y) {
                legalMoves.push({ x: currentPosition.x, y: i });
            }
        }

        // Diagonal moves
        for (let i = 1; i < 8; i++) {
            legalMoves.push({ x: currentPosition.x + i, y: currentPosition.y + i });
            legalMoves.push({ x: currentPosition.x + i, y: currentPosition.y - i });
            legalMoves.push({ x: currentPosition.x - i, y: currentPosition.y + i });
            legalMoves.push({ x: currentPosition.x - i, y: currentPosition.y - i });
        }

        return legalMoves.filter(move => this.isMoveValid(move, currentPosition));
    }
}

// King
class King extends ChessPiece {
    constructor(color, icon, name, position, points) {
        super(color, icon, name, position, points);
    }

    points = 100;

    getLegalMoves(currentPosition = this.position) {
        const legalMoves = [];

        const moves = [
            { x: 1, y: 0 }, { x: 1, y: 1 },
            { x: 0, y: 1 }, { x: -1, y: 1 },
            { x: -1, y: 0 }, { x: -1, y: -1 },
            { x: 0, y: -1 }, { x: 1, y: -1 }
        ];

        for (const move of moves) {
            const newPosition = { x: currentPosition.x + move.x, y: currentPosition.y + move.y };
            if (this.isMoveValid(newPosition, currentPosition)) {
                legalMoves.push(newPosition);
            }
        }

        return legalMoves;
    }
}


// gameplay

const chessBoardElement = document.getElementById('chessBoard');
const boardSize = 400;

chessBoardElement.style.width = boardSize + 'px';
chessBoardElement.style.height = boardSize + 'px';

const whitePieces = [
    new Rook('white', '♖', 'Rook', { x: 0, y: 0 }),
    new Knight('white', '♘', 'Knight', { x: 1, y: 0 }),
    new Bishop('white', '♗', 'Bishop', { x: 2, y: 0 }),
    new Queen('white', '♕', 'Queen', { x: 3, y: 0 }),
    new King('white', '♔', 'King', { x: 4, y: 0 }),
    new Bishop('white', '♗', 'Bishop', { x: 5, y: 0 }),
    new Knight('white', '♘', 'Knight', { x: 6, y: 0 }),
    new Rook('white', '♖', 'Rook', { x: 7, y: 0 }),

    new Pawn('white', '♙', 'Pawn', { x: 0, y: 1 }),
    new Pawn('white', '♙', 'Pawn', { x: 1, y: 1 }),
    new Pawn('white', '♙', 'Pawn', { x: 2, y: 1 }),
    new Pawn('white', '♙', 'Pawn', { x: 3, y: 1 }),
    new Pawn('white', '♙', 'Pawn', { x: 4, y: 1 }),
    new Pawn('white', '♙', 'Pawn', { x: 5, y: 1 }),
    new Pawn('white', '♙', 'Pawn', { x: 6, y: 1 }),
    new Pawn('white', '♙', 'Pawn', { x: 7, y: 1 }),
];

const blackPieces = [
    new Rook('black', '♜', 'Rook', { x: 0, y: 7 }),
    new Knight('black', '♞', 'Knight', { x: 1, y: 7 }),
    new Bishop('black', '♝', 'Bishop', { x: 2, y: 7 }),
    new Queen('black', '♛', 'Queen', { x: 3, y: 7 }),
    new King('black', '♚', 'King', { x: 4, y: 7 }),
    new Bishop('black', '♝', 'Bishop', { x: 5, y: 7 }),
    new Knight('black', '♞', 'Knight', { x: 6, y: 7 }),
    new Rook('black', '♜', 'Rook', { x: 7, y: 7 }),

    new Pawn('black', '♟', 'Pawn', { x: 0, y: 6 }),
    new Pawn('black', '♟', 'Pawn', { x: 1, y: 6 }),
    new Pawn('black', '♟', 'Pawn', { x: 2, y: 6 }),
    new Pawn('black', '♟', 'Pawn', { x: 3, y: 6 }),
    new Pawn('black', '♟', 'Pawn', { x: 4, y: 6 }),
    new Pawn('black', '♟', 'Pawn', { x: 5, y: 6 }),
    new Pawn('black', '♟', 'Pawn', { x: 6, y: 6 }),
    new Pawn('black', '♟', 'Pawn', { x: 7, y: 6 }),
];
        
function createChessboard() {
            console.log('Creating chessboard');
            chessBoardElement.innerHTML = '';
        
            for (let row = 0; row < 8; row++) {
                const rowElement = document.createElement('div');
                rowElement.className = 'chess-row';
                rowElement.setAttribute('data-row', row);
        
                for (let col = 0; col < 8; col++) {
                    const squareElement = document.createElement('div');
                    squareElement.className = 'chess-square';
                    squareElement.setAttribute('data-col', col);
                    squareElement.setAttribute('id', `square-${col}-${row}`); 
        
                    squareElement.removeEventListener('click', handleSquareClick);
        
                    squareElement.addEventListener('click', handleSquareClick);
        
                    if ((row + col) % 2 === 0) {
                        squareElement.classList.add('light-square');
                    } else {
                        squareElement.classList.add('dark-square');
                    }
        
                    const piece = findPieceAtPosition({ x: col, y: row });
                    if (piece) {
                        console.log(`${piece.name} at position (${piece.position.x}, ${piece.position.y})`);
                        squareElement.textContent = piece.icon;
                    }
                    rowElement.appendChild(squareElement);
                }
                chessBoardElement.appendChild(rowElement);
            }
            updatePoints();
        }        

function updateChessboard() {
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    const squareElement = document.querySelector(`.chess-row:nth-child(${row + 1}) .chess-square:nth-child(${col + 1})`);
                    squareElement.innerHTML = '';
    
                    const piece = findPieceAtPosition({ x: col, y: row });
                    if (piece) {
                        console.log(`${piece.name} at position (${piece.position.x}, ${piece.position.y})`);
                        squareElement.textContent = piece.icon;
                    }
                }
            }
        }
        
let selectedPiece = null;
                 

function handleSquareClick(event) {
    console.log('handleSquareClick function called');
    const squareElement = event.target;
    const col = parseInt(squareElement.getAttribute('data-col'));
    const row = parseInt(squareElement.parentElement.getAttribute('data-row'));

    const piece = findPieceAtPosition({ x: col, y: row });

    console.log('Selected Piece:', piece);

    if (selectedPiece) {
        // If a piece is already selected
        console.log('Previously Selected Piece:', selectedPiece);

        if (piece && piece.color === selectedPiece.color) {
            // Clicked on another piece of the same color
            selectedPiece.removeHighlights();
            selectedPiece = piece;
            selectedPiece.highlightLegalMoves();
        } else if (selectedPiece.isLegalMove({ x: col, y: row }, selectedPiece.position)) {
            // Clicked on a legal move
            console.log('Legal Move Selected');
            
            if (!isMoveAllowed(selectedPiece, { x: col, y: row })) {
                // Check if the move is allowed based on check condition
                console.log('Invalid Move Selected in Check');
                selectedPiece.removeHighlights();
                selectedPiece = null;
                return;
            }
            
            movePiece(selectedPiece, { x: col, y: row }); // Pass the targetSquare
            selectedPiece = null;

            // After the move is made
            if (isKingInCheck(getCurrentPlayerKing(), opponent === 'white' ? whitePieces : blackPieces)) {
                alert('Check!'); // Alert if the current player's king is in check
            }
        } else {
            // Clicked on an invalid square
            console.log('Invalid Move Selected');
            selectedPiece.removeHighlights();
            selectedPiece = null;
        }
    } else {
        // If no piece is selected
        if (piece && piece.color === currentPlayer) {
            // Clicked on a piece of the current player's color
            console.log('Piece of Current Player Selected');
            selectedPiece = piece;
            selectedPiece.highlightLegalMoves();
        } else {
            // Clicked on an empty or opponent's square
            console.log('Empty or Opponent\'s Square Selected');
            selectedPiece = null;
        }
    }

    // Log statements to check highlighted squares
    const highlightedSquares = document.querySelectorAll('.highlighted-square');
    console.log('Highlighted Squares:', highlightedSquares);
    highlightedSquares.forEach(square => {
        console.log('Highlighted Square Coordinates:', square.getAttribute('data-col'), square.parentElement.getAttribute('data-row'));
    });
}
     
// Move piece 
function movePiece(piece, targetSquare) {
            // Check move is valid
            if (piece && piece.isLegalMove(targetSquare, piece.position) && piece.color === currentPlayer) {
                // Remove highlights from current piece
                piece.removeHighlights();
        
               // Check for pawn promotion
                if (piece instanceof Pawn && (targetSquare.y === 0 || targetSquare.y === 7)) {
                    // Pawn at opposite end of board, prompt for promotion
                    const promotionPiece = prompt("Pawn promotion! Choose a piece to promote to: Queen, Rook, Bishop, Knight");

                    //Regex to allow upper/lower case spellings
                    const queenRegex = /^(queen|q)$/i;
                    const rookRegex = /^(rook|r)$/i;
                    const bishopRegex = /^(bishop|b)$/i;
                    const knightRegex = /^(knight|k)$/i;

                    let newPiece;

                    if (queenRegex.test(promotionPiece)) {
                        newPiece = new Queen(piece.color, piece.color === 'white' ? '♕' : '♛', 'Queen', targetSquare);
                    } else if (rookRegex.test(promotionPiece)) {
                        newPiece = new Rook(piece.color, piece.color === 'white' ? '♖' : '♜', 'Rook', targetSquare);
                    } else if (bishopRegex.test(promotionPiece)) {
                        newPiece = new Bishop(piece.color, piece.color === 'white' ? '♗' : '♝', 'Bishop', targetSquare);
                    } else if (knightRegex.test(promotionPiece)) {
                        newPiece = new Knight(piece.color, piece.color === 'white' ? '♘' : '♞', 'Knight', targetSquare);
                    } else {
                        // Default Queen
                        newPiece = new Queen(piece.color, piece.color === 'white' ? '♕' : '♛', 'Queen', targetSquare);
                    }

                    // Replace promoted pawn with chosen piece
                    const index = piece.color === 'white' ? whitePieces.indexOf(piece) : blackPieces.indexOf(piece);
                    if (index !== -1) {
                        if (piece.color === 'white') {
                            whitePieces.splice(index, 1, newPiece);
                        } else {
                            blackPieces.splice(index, 1, newPiece);
                        }
                        piece = newPiece;
                    }
                    piece.removeHighlights();
                } else {
                    // Update piece's position
                    piece.position = targetSquare;
                }
                        
                // Capture opponent's piece
                const opponentPieces = currentPlayer === 'white' ? blackPieces : whitePieces;
                const capturedPieceIndex = opponentPieces.findIndex(opponentPiece =>
                    opponentPiece.position && opponentPiece.position.x === targetSquare.x && opponentPiece.position.y === targetSquare.y
                );
        
                if (capturedPieceIndex !== -1) {
                    const capturedPiece = opponentPieces[capturedPieceIndex];
                    opponentPieces.splice(capturedPieceIndex, 1);
                
                    if (currentPlayer === 'white') {
                        whiteScore += capturedPiece.getPoints();
                    } else {
                        blackScore += capturedPiece.getPoints();
                    }
                }

                updatePoints();
                updateChessboard();

                // Check for check and checkmate before switching players
        if (isKingInCheck(getCurrentPlayerKing(), opponent === 'white' ? whitePieces : blackPieces)) {
            alert('Check!'); // Alert if the current player's king is in check
        }

                switchPlayer();
            }
        }                
        
// Get piece        
function findPieceAtPosition(position, pieces) {
            const allPieces = pieces ? pieces : whitePieces.concat(blackPieces);
            return allPieces.find(piece => piece.position.x === position.x && piece.position.y === position.y);
        } 
        
 // Get Square       
function getSquareElement(coordinates) {
            return document.getElementById(`square-${coordinates.x}-${coordinates.y}`);
        }
        
// Set starting player
let currentPlayer = 'white'; 
let opponent = 'black';


// Switch player
function switchPlayer() {
    currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
    opponent = opponent === 'white' ? 'black' : 'white'; 

    // Player to move message
    const whiteToMove = document.getElementById('whiteToMove');
    const blackToMove = document.getElementById('blackToMove');

    if (currentPlayer === 'white') {
        whiteToMove.classList.remove('hidden');
        blackToMove.classList.add('hidden');
        whitePointsElement.style.display = "block"
        blackPointsElement.style.display = "block"
    } else {
        whiteToMove.classList.add('hidden');
        blackToMove.classList.remove('hidden');
        whitePointsElement.style.display = "block"
        blackPointsElement.style.display = "block"
    }

    console.log('Switched to', currentPlayer, 'player');
}


const whitePointsElement = document.getElementById('whitePoints');
const blackPointsElement = document.getElementById('blackPoints');

let whiteScore = 0;
let blackScore = 0;

function updatePoints() {
    
    whitePointsElement.textContent = `White has ${whiteScore} points`;
    blackPointsElement.textContent = `Black has ${blackScore} points`;
}


// Play button click
        
document.getElementById('playButton').addEventListener('click', function () {
    const playButton = document.getElementById('playButton');
    playButton.style.display = 'none';

    const whiteToMove = document.getElementById('whiteToMove');
    whiteToMove.classList.remove('hidden');

    const blackToMove = document.getElementById('blackToMove');
    blackToMove.classList.add('hidden');

    createChessboard();
});

// Check and checkmate functions 

// Function to check if king in check
function isKingInCheck(king, opponentPieces) {
    const kingPosition = king.position;

    // Check each opponent piece's legal moves
    for (const piece of opponentPieces) {
        const legalMoves = piece.getLegalMoves();
        if (legalMoves.some(move => move.x === kingPosition.x && move.y === kingPosition.y)) {
            return true; // King is in check
        }
    }

    return false; // King is not in check
}

function isMovePuttingKingInCheck(piece, targetSquare, opponentPieces) {
    const originalPosition = piece.position;

    // Temporarily move the piece to the target square
    piece.movePieceTo(targetSquare);

    // Check if the king is in check after the move
    const isCheck = isKingInCheck(getCurrentPlayerKing(), opponentPieces);

    // Move the piece back to its original position
    piece.movePieceTo(originalPosition);

    return !isCheck; // If the move puts the king out of check, it's a valid move
}


// Function to get the current player's king
function getCurrentPlayerKing() {
    const currentPlayerPieces = currentPlayer === 'white' ? whitePieces : blackPieces;
    return currentPlayerPieces.find(piece => piece instanceof King);
}

function isMoveAllowed(piece, targetSquare) {
    const currentPlayerKing = getCurrentPlayerKing();
    const opponentPieces = opponent === 'white' ? whitePieces : blackPieces;

    // Check if the move is allowed based on check condition
    if (isKingInCheck(currentPlayerKing, opponentPieces)) {
        if (piece === currentPlayerKing) {
            // Allow the king to move only if the move puts it out of check
            if (!isMovePuttingKingInCheck(piece, targetSquare, opponentPieces)) {
                // Check if the move exposes the king to check from another piece
                const isExposedToCheck = opponentPieces.some(opponentPiece => {
                    const legalMoves = opponentPiece.getLegalMoves();
                    return legalMoves.some(move => move.x === targetSquare.x && move.y === targetSquare.y);
                });

                return !isExposedToCheck;
            }
        } else {
            // Allow other pieces only if they are defending the king
            return isDefendingPiece(piece, targetSquare);
        }
    }

    return true;
}
