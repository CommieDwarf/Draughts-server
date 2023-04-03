"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var utility_1 = require("./utility");
var Bot = /** @class */ (function () {
    function Bot(engine, color) {
        this.engine = engine;
        this.color = color;
        this.playerColor = this.color == "white" ? "black" : "white";
        this.scoreSheet = getScoreSheet();
    }
    Bot.prototype.makeMove = function (chessboard) {
        return __awaiter(this, void 0, void 0, function () {
            var moves, move, shouldQueen, routes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.engine.playerSide = "top";
                        moves = this.findBestMoves(chessboard, this.color);
                        move = moves[Math.floor(Math.random() * moves.length)];
                        if (!move) return [3 /*break*/, 5];
                        shouldQueen = this.engine.shouldMakeQueen(move.move, chessboard);
                        if (shouldQueen) {
                            this.engine.makeQueen(move.move, chessboard);
                        }
                        this.engine.move(move.piece, move.move, chessboard);
                        this.engine.dispatchEvent();
                        if (!move.kill) return [3 /*break*/, 4];
                        this.engine.kill(move.kill, chessboard);
                        routes = this.engine.getLongestRoutes([move.move], this.color, chessboard, "top");
                        if (!routes.some(function (route) { return route.length > 1; })) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, utility_1.sleep)(1000)];
                    case 1:
                        _a.sent();
                        this.makeMove(chessboard);
                        this.engine.dispatchEvent();
                        return [3 /*break*/, 3];
                    case 2:
                        this.engine.turn = this.playerColor;
                        this.engine.dispatchEvent();
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        this.engine.turn = this.playerColor;
                        this.engine.dispatchEvent();
                        _a.label = 5;
                    case 5:
                        this.engine.playerSide = "bot";
                        return [2 /*return*/];
                }
            });
        });
    };
    Bot.prototype.findBestMoves = function (chessboard, color) {
        var engine = this.engine;
        var opponentColor = color == "white" ? "black" : "white";
        // When bot has kill he figuers up which killing combo is the best
        var board = JSON.parse(JSON.stringify(chessboard));
        var combos = this.doComboSequence(board, color, "top");
        if (combos.length > 0) {
            return this.getMovesFromCombos(combos, board, color);
        }
        // When bot needs to make normal move he simulates each every possible move nad checking
        // consequences
        board = JSON.parse(JSON.stringify(chessboard));
        var possibleMoves = engine.getAllMoves(board, color, "top");
        var simulatedMoves = this.simulateMove(possibleMoves, board, color, "top");
        var bestMoves = this.getBestMoves(simulatedMoves);
        var moves = bestMoves.map(function (move) { return move.move; });
        return moves;
    };
    // returns moves that have highest .prediction attribute that is above 1. If none of them have .prediction
    // above 1 it picks move with highest .diff (botScore - playerScore).
    Bot.prototype.getBestMoves = function (simulatedMoves) {
        var bestScore = Number.NEGATIVE_INFINITY;
        var bestMoves = [];
        for (var _i = 0, simulatedMoves_1 = simulatedMoves; _i < simulatedMoves_1.length; _i++) {
            var move = simulatedMoves_1[_i];
            var score = void 0;
            if (move.prediction) {
                score = move.prediction;
            }
            else {
                score = move.diff;
            }
            if (score > bestScore) {
                bestScore = score;
                bestMoves = [move];
            }
            else if (score == bestScore) {
                bestMoves.push(move);
            }
        }
        return bestMoves;
    };
    Bot.prototype.getMovesFromCombos = function (combos, chessboard, color) {
        var finishCombos = combos.filter(function (combo) { return combo.finish == true; });
        var bestCombos = this.getBestCombos(finishCombos);
        var originalRoutes = this.getOriginalRoutesFromCombos(bestCombos);
        var moves = this.getFirstMovesFromRoutes(originalRoutes, chessboard, color, "top");
        return moves;
    };
    Bot.prototype.simulateMove = function (moves, chessboard, color, side) {
        var opponentSide = side == "top" ? "bot" : "top";
        var opponentColor = color == "white" ? "black" : "white";
        var simulatedMoves = [];
        for (var _i = 0, moves_1 = moves; _i < moves_1.length; _i++) {
            var move = moves_1[_i];
            var board = JSON.parse(JSON.stringify(chessboard));
            this.engine.move(move.piece, move.move, board);
            var playerScore = this.getScore(board, this.playerColor, 'bot');
            var botScore = this.getScore(board, this.color, 'top');
            var diff = botScore - playerScore;
            var pushed = { move: move, board: board, diff: diff, prev: null };
            simulatedMoves.push(pushed);
            // PLAYER MOVES
            var combos = this.doComboSequence(board, opponentColor, opponentSide);
            if (combos.length > 0) {
                var worstCombos = this.getWorstCombos(combos);
                pushed.prediction = worstCombos[0].scoreDiff;
            }
        }
        return simulatedMoves;
    };
    Bot.prototype.getFirstMovesFromRoutes = function (routes, chessboard, turn, side) {
        var firstMoves = [];
        for (var _i = 0, routes_1 = routes; _i < routes_1.length; _i++) {
            var route = routes_1[_i];
            var piece = route[0];
            var moveId = route[1];
            var moves = this.engine.getMoves(piece, chessboard, turn, side);
            var move = this.engine.getMove(moveId, moves);
            firstMoves.push(move);
        }
        return firstMoves;
    };
    Bot.prototype.getOriginalRoutesFromCombos = function (combos) {
        var routes = [];
        for (var _i = 0, combos_1 = combos; _i < combos_1.length; _i++) {
            var combo = combos_1[_i];
            var current = combo;
            while (true) {
                if (!current.prev) {
                    routes.push(current.route);
                    break;
                }
                else {
                    current = current.prev;
                }
            }
        }
        return routes;
    };
    Bot.prototype.getBestCombos = function (combos) {
        var best = [];
        var highestDiff = Number.NEGATIVE_INFINITY;
        for (var _i = 0, combos_2 = combos; _i < combos_2.length; _i++) {
            var combo = combos_2[_i];
            if (combo.scoreDiff > highestDiff) {
                highestDiff = combo.scoreDiff;
                best = [combo];
            }
            else if (combo.scoreDiff == highestDiff) {
                best.push(combo);
            }
        }
        return best;
    };
    Bot.prototype.getWorstCombos = function (combos) {
        var worst = [];
        var lowestDiff = Infinity;
        var lastCombos = this.getLastCombos(combos);
        for (var _i = 0, lastCombos_1 = lastCombos; _i < lastCombos_1.length; _i++) {
            var combo = lastCombos_1[_i];
            if (combo.scoreDiff < lowestDiff) {
                if (combo.next)
                    lowestDiff = combo.scoreDiff;
                worst = [combo];
            }
            else if (combo.scoreDiff == lowestDiff) {
                worst.push(combo);
            }
        }
        return worst;
    };
    Bot.prototype.getLastCombos = function (combos) {
        var lastCombos = combos.map(function (combo) {
            var current = combo;
            var counter = 0;
            while (current.next) {
                counter++;
                if (counter > 20) {
                    break;
                }
                if (current.next) {
                    current = current.next;
                }
            }
            return current;
        });
        return lastCombos;
    };
    Bot.prototype.doComboSequence = function (chessboard, color, side) {
        var _this = this;
        var opponentColor = color == "white" ? "black" : "white";
        var allCombos = [];
        var board = JSON.parse(JSON.stringify(chessboard));
        var combos = this.doCombo(board, color, side, color);
        allCombos = allCombos.concat(combos);
        combos.forEach(function (combo) {
            var board = combo.board;
            board = JSON.parse(JSON.stringify(board));
            var combos2 = _this.doCombo(board, opponentColor, side, opponentColor);
            if (combos2.length == 0) {
                combo.finish = true;
            }
            allCombos = allCombos.concat(combos2);
            combos2.forEach(function (combo2) {
                combo.next = combo2;
                combo2.prev = combo;
                var board = combo2.board;
                board = JSON.parse(JSON.stringify(board));
                var combos3 = _this.doCombo(board, color, side, color);
                if (combos3.length == 0) {
                    combo2.finish = true;
                }
                combos3.forEach(function (combo3) {
                    combo3.prev = combo2;
                    combo2.next = combo3;
                    combo3.finish = true;
                });
                allCombos = allCombos.concat(combos3);
            });
        });
        return allCombos;
    };
    Bot.prototype.doCombo = function (chessboard, turn, side, color) {
        var engine = this.engine;
        var board = JSON.parse(JSON.stringify(chessboard));
        var killMoves = engine.getAllMovesWithKill(board, turn, side);
        var combos = [];
        var routes = engine.getLongestRoutes(killMoves, turn, board, side);
        var boards = [];
        for (var i = 0; i < routes.length; i++) {
            board = JSON.parse(JSON.stringify(chessboard));
            boards.push(this.moveAlongRoute(routes[i], board, side, color));
            var botScore = this.getScore(boards[i], this.color, "top");
            var playerScore = this.getScore(boards[i], this.playerColor, "bot");
            combos.push({
                route: routes[i],
                playerScore: playerScore,
                botScore: botScore,
                board: boards[i],
                color: turn,
                scoreDiff: botScore - playerScore,
                finish: false,
            });
        }
        return combos;
    };
    Bot.prototype.moveAlongRoute = function (route, chessboard, side, color) {
        var engine = this.engine;
        var current = route[0];
        var routeCopy = route.slice(0);
        while (routeCopy.length > 1) {
            var next = routeCopy[1];
            var moves = engine.getMoves(current, chessboard, color, side);
            var move = engine.getMove(next, moves);
            if (move) {
                engine.move(current, move.move, chessboard);
                if (move.kill) {
                    chessboard = engine.kill(move.kill, chessboard);
                }
            }
            routeCopy.shift();
            current = routeCopy[0];
        }
        return chessboard;
    };
    Bot.prototype.getScore = function (chessboard, color, side) {
        var scoresheet = this.scoreSheet.slice(0);
        scoresheet = side == "top" ? this.scoreSheet : scoresheet.reverse();
        var sum = 0;
        for (var i = 0; i < scoresheet.length; i++) {
            if (chessboard[i]["queen"] && chessboard[i]["piece"] == color) {
                sum += 25;
            }
            else if (chessboard[i]["piece"] == color) {
                sum += scoresheet[i];
            }
        }
        return sum;
    };
    return Bot;
}());
exports.default = Bot;
function getScoreSheet() {
    var scoreSheet = [10, 10, 10, 10, 10, 10, 10, 10,
        11, 12, 12, 12, 12, 12, 12, 11,
        13, 14, 14, 14, 14, 14, 14, 13,
        15, 16, 16, 16, 16, 16, 16, 15,
        17, 18, 18, 18, 18, 18, 18, 17,
        18, 19, 19, 19, 19, 19, 19, 18,
        20, 21, 21, 21, 21, 21, 21, 20,
        24, 25, 25, 25, 25, 25, 25, 24];
    return scoreSheet;
}
//# sourceMappingURL=bot.js.map