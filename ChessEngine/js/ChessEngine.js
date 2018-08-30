const maxBoardLength = 8;
window.onload = function(){chess_main();};


class ChessBot{
    constructor(difficulty, color){
        this.difficulty = difficulty;
        this.color = color;
    }

    makeMove(game, board, source, target){
        let nextMove = undefined;
        if (this.difficulty === 'Random'){
            nextMove = this.determineSimplestBotMove(game, source, target);
        } else if (this.difficulty === 'Easy') {
            nextMove = this.determineNextBestBotMoveOneMoveDeep(game, source, target);
        } else if (this.difficulty === 'Medium'){
            let depth = Math.floor(Math.random() * 1 + 2);
            console.clear();
            console.log(depth + " moves ahead.");
            nextMove = this.determineBestBotMove(depth, game, true);
        }

        if (nextMove !== undefined) {
            game.move(nextMove);
            board.position(game.fen());
        }else {
            throw "difficulty not recognized" + this.difficulty;
        }
    }

    determineSimplestBotMove(game, source, target){
        let possibleMoves = game.moves();

        if (possibleMoves.length === 0) return;

        let randomIndex = Math.floor(Math.random() * possibleMoves.length);
        return possibleMoves[randomIndex];
    }

    getWhitePieceWeight(piece){
        if (piece.type === 'p'){
            return 10;
        } else if (piece.type === 'r'){
            return 50;
        } else if (piece.type === 'n'){
            return 30;
        } else if (piece.type === 'b'){
            return 35;
        } else if (piece.type === 'q'){
            return 90;
        } else if (piece.type === 'k'){
            return 900;
        }
        throw "Unknown piece type:  " + piece.type;
    }

    getPieceValue(piece){
        if(piece === null){
            return 0;
        }
        return piece.color === 'w' ? this.getWhitePieceWeight(piece) : -this.getWhitePieceWeight(piece);
    }

    evaluateBoardForWhite(game){
        let totalEvaluation = 0;
        for (let i = 0; i < maxBoardLength; i++){
            for (let j = 0; j < maxBoardLength; j++){
                totalEvaluation += this.getPieceValue(game.get(String.fromCharCode(97 + i) + (j + 1)));
            }
        }
        return totalEvaluation;
    }

    evaluateBoardForBlack(game){return -this.evaluateBoardForWhite(game);}

    determineNextBestBotMoveOneMoveDeep(game, source, target) {
        let bestMove = null;
        let bestValue = -9999;
        let boardValue = 0;
        let possibleMoves = game.moves();

        for (let i = 0; i < possibleMoves.length; i++) {
            let newGameMove = possibleMoves[i];
            game.move(newGameMove);

            if (this.color === "w") {
                boardValue = this.evaluateBoardForWhite(game);
            } else if (this.color === "b") {
                boardValue = this.evaluateBoardForBlack(game);
            } else {
                throw "Unknown bot team color:  " + this.color;
            }
            game.undo();

            if (boardValue > bestValue) {
                bestValue = boardValue;
                bestMove = newGameMove;
            }
        }

        if (bestValue === 0) {
            return this.determineSimplestBotMove(game, source, target);
        } else {
            return bestMove;
        }
    }

    determineBestBotMove(depth, game, isMaximizingPlayer){
        let possibleMoves = game.moves();
        let bestValue = -9999;
        let bestMove;

        for (let i = 0; i < possibleMoves.length; i++){
            game.move(possibleMoves[i])
            let currentValue = this.mini_max_AB(depth - 1, game, -10000, 10000, !isMaximizingPlayer);
            game.undo();
            if(currentValue >= bestValue){
                bestMove = possibleMoves[i];
                bestValue = currentValue;
            }
        }
        
        if (bestValue === 0) {
            return this.determineSimplestBotMove(game, source, target);
        } else {
            return bestMove;
        }
    }

    mini_max_AB(depth, game, alpha, beta, isMaximizingPlayer){
        if (depth === 0 && this.color === 'w'){
            return this.evaluateBoardForWhite(game);
        } else if (depth === 0 && this.color === 'b') {
            return this.evaluateBoardForBlack(game);
        }

        let possibleMoves = game.moves();
        let bestValue = 9999 * (isMaximizingPlayer ? -1 : 1);
        for (let i = 0; i < possibleMoves.length; i++){
            game.move(possibleMoves[i]);
            if (isMaximizingPlayer){
                bestValue = Math.max(bestValue, this.mini_max_AB(depth-1, game, alpha, beta, !isMaximizingPlayer));
                alpha = Math.max(alpha, bestValue);
            } else {
                bestValue = Math.min(bestValue, this.mini_max_AB(depth-1, game, alpha, beta, !isMaximizingPlayer));
                beta = Math.min(beta, bestValue);
            }
            game.undo();
            if (beta <= alpha){
                return bestValue;
            }
        }
        return bestValue;
    }
}

function chess_main() {
    let game = new Chess();
    let board = ChessBoard('board');
    let BBot = new ChessBot('Medium', 'b');
    setupChess(game, board, BBot);
}

function setupChess(game, board, bot){
    let onDragStart = function(source, piece, position, orientation) {
        if (game.in_checkmate() === true || game.in_draw() === true ||
            piece.search(/^b/) !== -1) {
            return false;
        }
    };

    let onDrop = function(source, target) {
        let move = game.move({
            from: source,
            to: target,
            promotion: 'q' // NOTE: always promote to a queen for example simplicity
        });

        if (move === null) return 'snapback';

        window.setTimeout(bot.makeMove(game, board, source, target), 250);
    };

    let onSnapEnd = function() {
        board.position(game.fen());
    };

    let cfg = {
        draggable: true,
        dropOffBoard: 'snapback',
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd
    };
    board = ChessBoard('board', cfg);
}
