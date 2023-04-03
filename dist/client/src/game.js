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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bot_1 = __importDefault(require("./bot"));
var engine_1 = require("./engine");
var createChessboard_1 = __importDefault(require("./createChessboard"));
var Game = /** @class */ (function () {
    function Game(gameMode, playerColor, side, label, gameCounter, id) {
        this.engine = new engine_1.Engine(side);
        this.botColor = playerColor == "white" ? "black" : "white";
        this.bot = new bot_1.default(this.engine, this.botColor);
        this.gameMode = gameMode;
        this.playerColor = playerColor;
        this.side = side;
        this.label = label;
        this.engine.chessboard = this.startNewGame();
        this.gameCounter = gameCounter;
        this.id = id;
    }
    Game.prototype.startNewGame = function () {
        this.engine.chessboard = (0, createChessboard_1.default)(this.side);
        if (this.playerColor == "black" && this.gameMode == 1 /* BOT */) {
            this.bot.makeMove(this.engine.chessboard);
        }
        return this.engine.chessboard;
    };
    Game.prototype.clickHandler = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var engine, square, squareId, board;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        engine = this.engine;
                        if (this.gameMode == 2 /* ONLINE */ && engine.turn !== this.playerColor) {
                            return [2 /*return*/];
                        }
                        if (!!(this.gameMode == 1 /* BOT */ && engine.turn !== this.playerColor)) return [3 /*break*/, 4];
                        if (!(event.target instanceof Element)) {
                            return [2 /*return*/];
                        }
                        square = event.target.closest(".chessboard__square");
                        if (!square) return [3 /*break*/, 3];
                        if (!square.getAttribute("id")) {
                            return [2 /*return*/];
                        }
                        squareId = square.getAttribute("id");
                        if (!squareId) {
                            return [2 /*return*/];
                        }
                        board = JSON.stringify(this.engine.chessboard);
                        engine.performAction(parseInt(squareId), engine.chessboard);
                        if (board == JSON.stringify(this.engine.chessboard)) {
                            return [2 /*return*/];
                        }
                        if (!(engine.turn == this.bot.color && this.gameMode == 1 /* BOT */)) return [3 /*break*/, 2];
                        return [4 /*yield*/, sleep(2000)];
                    case 1:
                        _a.sent();
                        this.bot.makeMove(this.engine.chessboard);
                        this.engine.setWinner(this.engine.chessboard, this.engine.turn, this.engine.playerSide);
                        _a.label = 2;
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        engine.unselectPiece();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return Game;
}());
exports.default = Game;
function sleep(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
//# sourceMappingURL=game.js.map