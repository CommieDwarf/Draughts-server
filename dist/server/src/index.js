"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var app = express();
var http = require("http");
var cors = require("cors");
var server = http.createServer(app);
var Server = require("socket.io").Server;
var reverseChessboard_1 = __importDefault(require("./reverseChessboard"));
app.use(cors({
    origin: 'localhost/Draughts/client'
}));
var io = new Server(server, {
    cors: {
        origin: "http://localhost",
        methods: ["POST", "GET"]
    }
});
var players = [];
var isWritingRooms = {};
io.on("connection", function (socket) {
    console.log("User bbb", socket.id, socket.handshake.address);
    console.log('dupa');
    socket.on("player-connected", function (name) {
        socket.join("global");
        if (name.length > 6) {
            name = name.slice(0, 6);
        }
        players.push({
            name: name,
            avatar: {
                theme: getRandomElement(avatarThemes),
                shape: getRandomElement(avatarShapes)
            },
            id: socket.id
        });
        io.emit("players_update", players);
    });
    socket.on("create_room", function (room) {
        socket.broadcast.emit("room_created", room);
    });
    socket.on("join_room", function (room) {
        socket.join(room.id);
    });
    socket.on("leave_room", function (room) {
        socket.leave(room.id);
    });
    socket.on("join_game", function (gameId) {
        socket.join(gameId);
    });
    socket.on("request_join_game", function (author) {
        socket.broadcast.emit("requested_join_game", author);
    });
    socket.on("send_message", function (msg) {
        console.log(msg);
        socket.broadcast.to(msg.room.id).emit(("get_message"), msg);
    });
    socket.on("writing", function (room) {
        socket.broadcast.emit("someone_writing", room);
    });
    socket.on("done_writing", function (room) {
        socket.broadcast.emit("done_writing", room);
    });
    socket.on("request_players_list", function () {
        socket.emit("get_players", players);
    });
    socket.on("accept_challange", function (gameInfo) {
        socket.broadcast.to(gameInfo.gameId).emit("challange_accepted", gameInfo);
    });
    socket.on("make_move", function (game) {
        console.log("move make");
        var reversed = (0, reverseChessboard_1.default)(game.engine.chessboard);
        game.engine.chessboard = reversed;
        socket.broadcast.to(game.id).emit("move_made", game);
    });
    socket.on("disconnect", function () {
        console.log("user disconnected");
        var player = players.find(function (player) { return player.id == socket.id; });
        players = players.filter(function (player) { return player.id !== socket.id; });
        io.emit("players_update", players);
        if (player) {
            io.emit("player_disconnected", player);
        }
    });
});
server.listen(3001, function () {
    console.log('server running');
});
var avatarThemes = ["frogideas", "sugarsweets", "heatwave", "daisygarden", "seascape",
    "summerwarmth", "bythepool", "duskfalling", "berrypie", "base"];
var avatarShapes = ["squares", "isogrids", "spaceinvaders", "labs/isogrids/hexa", "labs/isogrids/hexa16"];
function getRandomElement(array) {
    return array[Math.floor(Math.random() * (array.length - 1))];
}
// const cacheDir = // where to put cache files
// const cacheKey = // calculate cache key for the input
// const cacheFile = path.join(cacheDir, cacheKey);
// if (exists(cacheFile)) {
// 	// the result is cached
// 	return fs.readFile(cacheFile);
// }else {
// 	// calculate the result and store it
// 	const result = // run the process
// 	await fs.writeFile(cacheFile, result);
// 	return result;
// }
//# sourceMappingURL=index.js.map