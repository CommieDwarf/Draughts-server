"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Engine = void 0;
var utility = __importStar(require("./utility"));
var Engine = /** @class */ (function () {
    function Engine(side) {
        this.whiteSide = side == 0 /* NORMAL */ ? "bot" : "top";
        this.playerSide = this.whiteSide; // this is turn side. Player is always bot
        this.chessboard = [];
        this.turn = "white";
        this.selectedPiece = null;
        this.availableMoves = [];
        this.selectionLock = false;
        this.lockedPieces = [];
        this.killablePieces = [];
        this.winner = "";
    }
    Engine.prototype.dispatchEvent = function () {
        document.dispatchEvent(new Event('chessboardChanged'));
    };
    Engine.prototype.setWinner = function (chessboard, turn, playerSide) {
        var allMoves = this.getAllMoves(chessboard, turn, playerSide);
        var opponent = turn == "white" ? "black" : "white";
        if (allMoves.length == 0) {
            this.winner = opponent;
            return opponent;
        }
    };
    Engine.prototype.unselectPiece = function () {
        this.selectedPiece = null;
    };
    Engine.prototype.selectPiece = function (id) {
        this.selectedPiece = id;
    };
    Engine.prototype.setAvailableMoves = function (moves) {
        var movesOnly = [];
        for (var _i = 0, moves_1 = moves; _i < moves_1.length; _i++) {
            var move = moves_1[_i];
            movesOnly.push(move.move);
        }
        this.availableMoves = movesOnly;
    };
    Engine.prototype.unsetAvailableMoves = function () {
        this.availableMoves = [];
    };
    Engine.prototype.lockPieces = function (pieces) {
        this.lockedPieces = pieces;
    };
    Engine.prototype.unlockPieces = function () {
        this.lockedPieces = [];
    };
    Engine.prototype.getRoutesStarts = function (routes) {
        var array = [];
        for (var i = 0; i < routes.length; i++) {
            array.push(routes[i][0]);
        }
        return array;
    };
    /////////////////////////////// MAIN FUNCTION
    Engine.prototype.performAction = function (clickedId, chessboard) {
        var oldState = {
            selectedPiece: this.selectedPiece,
            chessboard: JSON.stringify(this.chessboard),
            turn: this.turn,
        };
        var killMoves = this.getAllMovesWithKill(chessboard, this.turn, this.playerSide);
        var routes = this.getLongestRoutes(killMoves, this.turn, chessboard, this.playerSide);
        if (routes.length > 0) {
            var startPieces = this.getRoutesStarts(routes);
            this.lockPieces(startPieces);
        }
        else {
            this.unlockPieces();
        }
        // Selecting
        if (clickedId && chessboard[clickedId]["piece"] == this.turn && this.selectedPiece !== clickedId) {
            if (this.lockedPieces.length == 0 || this.lockedPieces.includes(clickedId)) {
                this.selectPiece(clickedId);
            }
        }
        else if (!(clickedId && this.selectedPiece && this.availableMoves.includes(clickedId))) {
            this.unselectPiece();
            this.unsetAvailableMoves();
        }
        if (this.selectedPiece) {
            var moves = this.getMoves(this.selectedPiece, chessboard, this.turn, this.playerSide);
            if (this.lockedPieces.length > 0) {
                moves = moves.filter(function (move) { return routes.some(function (route) { return move.move == route[1]; }); });
            }
            this.setAvailableMoves(moves);
        }
        // movement and killing
        if (clickedId && this.availableMoves.includes(clickedId) && this.selectedPiece) {
            var moves = this.getMoves(this.selectedPiece, chessboard, this.turn, this.playerSide);
            var move = this.getMove(clickedId, moves);
            if (move) {
                this.move(move.piece, clickedId, chessboard);
                this.unsetAvailableMoves();
                this.unselectPiece();
                this.lockPieces([]);
                var killed = false;
                if (move.kill) {
                    this.kill(move.kill, chessboard);
                    killed = true;
                }
                if (killed) {
                    var routes_2 = this.getLongestRoutes([move.move], this.turn, chessboard, this.playerSide);
                    if (routes_2.some(function (route) { return route.length > 1; })) {
                        this.lockPieces([move.move]);
                        this.selectPiece(move.move);
                        var moves_2 = this.getMoves(move.move, chessboard, this.turn, this.playerSide);
                        for (var _i = 0, routes_1 = routes_2; _i < routes_1.length; _i++) {
                            var route = routes_1[_i];
                            this.availableMoves.push(route[1]);
                        }
                    }
                    else {
                        var shouldQueen = this.shouldMakeQueen(move.move, chessboard);
                        if (shouldQueen) {
                            this.makeQueen(move.move, chessboard);
                        }
                        this.switchTurn();
                    }
                }
                else {
                    var shouldQueen = this.shouldMakeQueen(move.move, chessboard);
                    if (shouldQueen) {
                        this.makeQueen(move.move, chessboard);
                    }
                    this.switchTurn();
                }
            }
        }
        this.setWinner(chessboard, this.turn, this.playerSide);
        var currentState = {
            selectedPiece: this.selectedPiece,
            chessboard: JSON.stringify(this.chessboard),
            turn: this.turn,
        };
        if (JSON.stringify(oldState) != JSON.stringify(currentState) || this.winner) {
            this.dispatchEvent();
        }
    };
    /////////////////////////////////////////////////
    Engine.prototype.shouldMakeQueen = function (piece, chessboard) {
        if (this.playerSide == "bot") {
            if (chessboard[piece]["border-top"]) {
                return true;
            }
        }
        else {
            if (chessboard[piece]["border-bot"]) {
                return true;
            }
        }
        return false;
    };
    Engine.prototype.makeQueen = function (id, chessboard) {
        chessboard[id]['queen'] = true;
    };
    Engine.prototype.switchTurn = function () {
        this.turn = this.turn == "white" ? "black" : "white";
        this.playerSide = this.playerSide == "bot" ? "top" : "bot";
    };
    Engine.prototype.kill = function (target, chessboard) {
        chessboard[target]["piece"] = "";
        chessboard[target]["queen"] = false;
        return chessboard;
    };
    // picking Move object based on his move attribute
    Engine.prototype.getMove = function (id, moves) {
        for (var _i = 0, moves_3 = moves; _i < moves_3.length; _i++) {
            var move = moves_3[_i];
            if (move.move == id) {
                return move;
            }
        }
        return null;
    };
    Engine.prototype.move = function (from, target, chessboard) {
        if (chessboard[from]["queen"]) {
            chessboard[from]["queen"] = false;
            chessboard[target]["queen"] = true;
        }
        chessboard[target]["piece"] = chessboard[from]["piece"];
        chessboard[from]["piece"] = "";
    };
    Engine.prototype.getMoves = function (selected, chessboard, turn, playerSide) {
        var moves = [];
        if (chessboard[selected]['queen']) {
            moves = this.getQueenMoves(selected, chessboard, turn);
        }
        else {
            moves = this.getRegularMoves(selected, chessboard, turn, playerSide);
        }
        return moves;
    };
    Engine.prototype.getQueenMoves = function (selected, chessboard, turn) {
        var moves = this.getObliqueMoves(selected, chessboard);
        moves = this.filterBlockedMoves(chessboard, moves, selected, turn);
        var qMoves = this.getQueenFullMoves(moves, chessboard, selected, turn);
        return qMoves;
    };
    Engine.prototype.getObliqueMoves = function (queenPosition, chessboard) {
        var allMoves = [[], [], [], []];
        var current = queenPosition;
        var borders = ['border-left', 'border-top', 'border-right', 'border-bot', "border-left"];
        var directions = [-9, -7, 9, 7];
        for (var i = 0; i < borders.length - 1; i++) {
            var border1 = borders[i];
            var border2 = borders[i + 1];
            var direction = directions[i];
            while (current >= 0 || current <= 63) {
                allMoves[i].push(current);
                if (chessboard[current][border1] || chessboard[current][border2]) {
                    break;
                }
                current += direction;
            }
            current = queenPosition;
            allMoves[i].shift();
        }
        return allMoves;
    };
    Engine.prototype.filterBlockedMoves = function (chessboard, allMoves, queenPosition, turn) {
        var _a;
        var newAllMoves = [[], [], [], []];
        for (var i = 0; i < allMoves.length; i++) {
            for (var j = 0; j < allMoves[i].length; j++) {
                var move = allMoves[i][j];
                var move2 = allMoves[i][j + 1];
                if (chessboard[move]["piece"] !== turn) {
                    if (!chessboard[move]["piece"] || !((_a = chessboard[move2]) === null || _a === void 0 ? void 0 : _a["piece"])) {
                        newAllMoves[i].push(allMoves[i][j]);
                    }
                    else {
                        break;
                    }
                }
                else {
                    break;
                }
            }
        }
        return newAllMoves;
    };
    Engine.prototype.getQueenFullMoves = function (moves, chessboard, queenPos, turn) {
        var opponent = turn == "white" ? "black" : "white";
        var qMoves = [];
        for (var i = 0; i < moves.length; i++) {
            var kill = void 0;
            for (var j = 0; j < moves[i].length; j++) {
                if (chessboard[moves[i][j]]['piece'] == opponent) {
                    kill = moves[i][j];
                }
                if (kill !== moves[i][j]) {
                    if (kill) {
                        qMoves.push({ piece: queenPos, move: moves[i][j], kill: kill });
                    }
                    else {
                        qMoves.push({ piece: queenPos, move: moves[i][j], kill: null });
                    }
                }
            }
        }
        return qMoves;
    };
    Engine.prototype.getRegularMoves = function (selected, chessboard, turn, playerSide) {
        var directions = [-9, -7, 7, 9];
        var playerDirections;
        if (this.playerSide == "bot") {
            playerDirections = [-9, -7];
        }
        else {
            playerDirections = [9, 7];
        }
        if (chessboard[selected]["border-left"]) {
            directions = directions.filter(function (dir) { return dir !== 7; });
            directions = directions.filter(function (dir) { return dir !== -9; });
        }
        else if (chessboard[selected]["border-right"]) {
            directions = directions.filter(function (dir) { return dir !== -7; });
            directions = directions.filter(function (dir) { return dir !== 9; });
        }
        var moves = [];
        for (var _i = 0, directions_1 = directions; _i < directions_1.length; _i++) {
            var dir = directions_1[_i];
            var moveBy1 = selected + dir;
            if (moveBy1 < 0 || moveBy1 > 63) {
                continue;
            }
            var piece = chessboard[moveBy1]["piece"];
            if (piece == turn) {
                continue;
            }
            else if (piece == "" && playerDirections.includes(dir)) {
                moves.push({ piece: selected, kill: null, move: moveBy1 });
            }
            else {
                var moveBy2 = moveBy1 + dir;
                if (moveBy2 < 0 || moveBy2 > 63) {
                    continue;
                }
                else if (chessboard[moveBy2]["border-left"] && (dir == -7 || dir == 9)) {
                    continue;
                }
                else if (chessboard[moveBy2]["border-right"] && (dir == -9 || dir == 7)) {
                    continue;
                }
                else if (chessboard[moveBy2]["square"] !== 'black') {
                    continue;
                }
                else if (chessboard[moveBy1]["piece"] && !chessboard[moveBy2]["piece"]) {
                    moves.push({ piece: selected, kill: moveBy1, move: moveBy2 });
                }
            }
        }
        return moves;
    };
    Engine.prototype.getAllMovesWithKill = function (chessboard, turn, playerSide) {
        var killMoves = [];
        for (var i = 0; i < 64; i++) {
            if (chessboard[i]["piece"] && chessboard[i]["piece"] == turn) {
                var moves = this.getMoves(i, chessboard, turn, playerSide);
                for (var _i = 0, moves_4 = moves; _i < moves_4.length; _i++) {
                    var move = moves_4[_i];
                    if (move.kill) {
                        killMoves.push(move.piece);
                    }
                }
            }
        }
        return killMoves;
    };
    Engine.prototype.getLongestRoutes = function (moves, turn, chessboard, playerSide) {
        var _this = this;
        var _a;
        var deepPositions = [];
        var stack = [];
        moves.forEach(function (move) {
            var board = JSON.parse(JSON.stringify(chessboard));
            var position = {
                move: move,
                depth: 0,
                prev: null,
                board: board,
                visited: new Set(),
            };
            stack.push(position);
        });
        var current = stack[stack.length - 1];
        var counter = 0; // for optimization testing porpouse 
        while (current) {
            var temp = [];
            for (var _i = 0, stack_1 = stack; _i < stack_1.length; _i++) {
                var d = stack_1[_i];
                temp.push(d);
            }
            counter++;
            if (counter > 20) {
                break;
            }
            current.board[current.move]["piece"] = "";
            var moves_5 = this.getMoves(current.move, current.board, turn, playerSide);
            var movesWithKill = moves_5.filter(function (move) { return move.kill !== null; });
            // pushing available moves to stack
            movesWithKill.forEach(function (move) {
                var newBoard = JSON.parse(JSON.stringify(current.board));
                if (move.kill) {
                    newBoard = _this.kill(move.kill, newBoard);
                }
                if (!current.visited.has(move.move)) {
                    var visit = new Set();
                    var position = {
                        move: move.move,
                        depth: current.depth + 1,
                        prev: current,
                        board: newBoard,
                        visited: visit,
                    };
                    stack.push(position);
                }
            });
            var flatMoves = [];
            for (var i = 0; i < movesWithKill.length; i++) {
                flatMoves.push(movesWithKill[i].move);
            }
            // poping from stack when available moves from current pos are already visited
            if (utility.setIncludesArray(current.visited, flatMoves)) {
                deepPositions.push(current);
                stack.pop();
                current = stack[stack.length - 1];
            }
            // Proceding to stack's top or stopping loop when empty
            if (stack.length > 0) {
                current = stack[stack.length - 1];
            }
            else {
                break;
            }
            (_a = current.prev) === null || _a === void 0 ? void 0 : _a.visited.add(current.move);
        }
        var deepest = this.findDeepestMoves(deepPositions);
        var routes = this.getFullRoutes(deepest);
        routes = this.remNestArrayDuplicates(routes);
        for (var _b = 0, routes_3 = routes; _b < routes_3.length; _b++) {
            var route = routes_3[_b];
            route.reverse();
        }
        return routes;
    };
    Engine.prototype.remNestArrayDuplicates = function (array) {
        var set = new Set();
        for (var i = 0; i < array.length; i++) {
            set.add(JSON.stringify(array[i]));
        }
        var arr = Array.from(set);
        var filtered = [];
        for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
            var elem = arr_1[_i];
            filtered.push(JSON.parse(elem));
        }
        return filtered;
    };
    Engine.prototype.findDeepestMoves = function (moves) {
        if (moves.length == 0) {
            return [];
        }
        moves.sort(function (a, b) { return b.depth - a.depth; });
        var highest = moves[0].depth;
        var deepest = [];
        for (var _i = 0, moves_6 = moves; _i < moves_6.length; _i++) {
            var move = moves_6[_i];
            if (move.depth >= highest) {
                deepest.push(move);
            }
            else {
                break;
            }
        }
        return deepest;
    };
    Engine.prototype.getFullRoutes = function (deepestPositions) {
        var routes = [];
        deepestPositions.forEach(function (position) {
            var route = [];
            var current = position;
            while (current) {
                route.push(current.move);
                current = current.prev;
            }
            routes.push(route);
        });
        return routes;
    };
    Engine.prototype.filterMovesWithoutKill = function (moves) {
        var filtered = moves.filter(function (move) { return move.kill !== null; });
        return filtered;
    };
    Engine.prototype.getAllMoves = function (chessboard, turn, playerSide) {
        var allMoves = [];
        for (var i = 0; i < 64; i++) {
            if (chessboard[i]["piece"] == turn) {
                var moves = this.getMoves(i, chessboard, turn, playerSide);
                allMoves.push.apply(allMoves, moves);
            }
        }
        return allMoves;
    };
    return Engine;
}());
exports.Engine = Engine;
//# sourceMappingURL=engine.js.map