"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function reverseChessboard(chessboard) {
    var reversedChessboard = chessboard;
    for (var i = 0; i < chessboard.length; i--) {
        console.log(i);
        reversedChessboard[i].piece = chessboard[chessboard.length - i].piece;
        reversedChessboard[i].queen = chessboard[chessboard.length - i].queen;
    }
    return reversedChessboard;
}
exports.default = reverseChessboard;
//# sourceMappingURL=reverseChessboard.js.map