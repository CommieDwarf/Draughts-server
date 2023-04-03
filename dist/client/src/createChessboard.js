"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
function createChessboard(side) {
    var chessboard = createBoard();
    var preset = (0, config_1.getPreset)(side);
    if (preset) {
        chessboard = addStartingPieces(chessboard, preset);
    }
    return chessboard;
}
exports.default = createChessboard;
function createBoard() {
    var chessboard = [];
    for (var i = 0; i < 64; i++) {
        chessboard = pushSquare(i, chessboard);
        chessboard = setBlackSquare(i, chessboard);
        chessboard = setBorder(i, chessboard);
    }
    return chessboard;
}
function pushSquare(i, chessboard) {
    var square = {
        id: i,
        piece: "",
        square: "white",
        "border-top": false,
        "border-bot": false,
        "border-right": false,
        "border-left": false,
        queen: false,
    };
    +chessboard.push(square);
    return chessboard;
}
function setBlackSquare(i, chessboard) {
    if (i % 2 != 0 && i <= 7) {
        chessboard[i]["square"] = "black";
    }
    else if (i % 2 == 0 && i > 7 && i <= 14) {
        chessboard[i]["square"] = "black";
    }
    else if (i % 2 != 0 && i > 15 && i <= 23) {
        chessboard[i]["square"] = "black";
    }
    else if (i % 2 == 0 && i > 23 && i <= 31) {
        chessboard[i]["square"] = "black";
    }
    else if (i % 2 != 0 && i > 31 && i <= 39) {
        chessboard[i]["square"] = "black";
    }
    else if (i % 2 == 0 && i > 39 && i <= 47) {
        chessboard[i]["square"] = "black";
    }
    else if (i % 2 != 0 && i > 47 && i <= 55) {
        chessboard[i]["square"] = "black";
    }
    else if (i % 2 == 0 && i > 55 && i <= 63) {
        chessboard[i]["square"] = "black";
    }
    return chessboard;
}
function setBorder(i, chessboard) {
    switch (i) {
        case 1:
        case 3:
        case 5:
            chessboard[i]["border-top"] = true;
            break;
        case 58:
        case 60:
        case 62:
            chessboard[i]["border-bot"] = true;
            break;
        case 8:
        case 24:
        case 40:
            chessboard[i]["border-left"] = true;
            break;
        case 56:
            chessboard[i]["border-left"] = true;
            chessboard[i]["border-bot"] = true;
            break;
        case 7:
            chessboard[i]["border-top"] = true;
            chessboard[i]["border-right"] = true;
            break;
        case 23:
        case 39:
        case 55:
            chessboard[i]["border-right"] = true;
            break;
    }
    return chessboard;
}
function addStartingPieces(chessboard, preset) {
    var _a;
    for (var i = 0; i < 64; i++) {
        if (chessboard[i]["square"] == "black") {
            if (preset.whitePieces.includes(i)) {
                addPiece(i, "white", chessboard);
            }
            else if (preset.blackPieces.includes(i)) {
                addPiece(i, "black", chessboard);
            }
            if ((_a = preset.queen) === null || _a === void 0 ? void 0 : _a.includes(i)) {
                chessboard[i]["queen"] = true;
            }
        }
    }
    return chessboard;
}
function addPiece(i, color, chessboard) {
    chessboard[i]["piece"] = color;
}
//# sourceMappingURL=createChessboard.js.map