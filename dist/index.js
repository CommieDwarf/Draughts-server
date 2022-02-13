"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var app = express();
var http = require("http");
var cors = require("cors");
var server = http.createServer(app);
var Server = require("socket.io").Server;
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
io.on("connection", function (socket) {
    console.log("User connected", socket.id, socket.handshake.address);
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
    socket.on("join_game", function (roomId) {
        socket.join(roomId);
        socket.broadcast.to(roomId).emit("get_gameId");
    });
    socket.on("request_join_game", function (_a) {
        var author = _a.author, gameId = _a.gameId;
        socket.broadcast.emit("requested_join_game", { author: author, gameId: gameId });
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
        io.emit("get_players", players);
    });
    socket.on("accept_challange", function (gameInfo) {
        socket.broadcast.to(gameInfo.roomId).emit("challange_accepted", gameInfo);
    });
    socket.on("make_move", function (gameInfo) {
        socket.broadcast.to(gameInfo.roomId).emit("move_made", gameInfo);
    });
    socket.on("player_wants_rematch", function (rematch) {
        socket.broadcast.to(rematch.roomId).emit("player_wants_rematch", rematch);
    });
    socket.on("restart_game", function (gameInfo) {
        socket.broadcast.to(gameInfo.roomId).emit("game_restarted");
    });
    socket.on("player-close-game", function (gameInfo) {
        socket.broadcast.to(gameInfo.roomId).emit("player_closed_game", gameInfo);
        console.log("close", gameInfo.roomId, gameInfo.gameId);
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
//# sourceMappingURL=index.js.map