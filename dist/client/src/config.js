"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPreset = void 0;
function getPreset(side) {
    switch (+side) {
        case 2 /* CUSTOM */:
            return {
                //   whitePieces: [33, 49, 51, 53, 62],
                //  blackPieces: [26, 28, 21],
                whitePieces: [42],
                blackPieces: [49],
                whiteSide: "bot",
                playerSide: "bot",
                turn: "white",
                queen: [],
            };
            break;
        case 0 /* NORMAL */:
            return {
                whitePieces: [62, 60, 58, 56, 55, 53, 51, 49, 46, 44, 42, 40],
                blackPieces: [1, 3, 5, 7, 8, 10, 12, 14, 17, 19, 21, 23],
                playerSide: "bot",
                whiteSide: "bot",
                turn: "white",
                queen: []
            };
            break;
        case 1 /* REVERSED */:
            return {
                whitePieces: [1, 3, 5, 7, 8, 10, 12, 14, 17, 19, 21, 23],
                blackPieces: [62, 60, 58, 56, 55, 53, 51, 49, 46, 44, 42, 40],
                playerSide: "top",
                whiteSide: "top",
                turn: "white",
                queen: []
            };
            break;
    }
}
exports.getPreset = getPreset;
//# sourceMappingURL=config.js.map