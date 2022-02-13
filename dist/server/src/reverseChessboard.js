"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function reverseChessboard(chessboard) {
    var reversedChessboard = [];
    for (var i = chessboard.length - 1; i >= 0; i--) {
        reversedChessboard.push(chessboard[i]);
    }
    return reversedChessboard;
}
exports.default = reverseChessboard;
//# sourceMappingURL=reverseChessboard.js.map