
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const server = http.createServer(app);
const { Server } = require("socket.io");

app.use(cors({
    origin: '*'
}));

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["POST", "GET"]
    }
});






interface Player {
    name: string,
    avatar: {
        theme: string,
        shape: string,
    }
    id: string
}

export type IMessage = {
    content: string,
    author: Player,
    room: Room,
}

type Room = {
    author: string,
    target: string,
    id: string
}

type GameInfo = {
    gameId: number,
    playerAccepted: string,
    playerAcceptedColor: string,
    roomId : string,
}

type Rematch = {
    requested: boolean,
    player: Player | null,
    gameId: number,
    roomId: string,
}


let players: Player[] = [];
io.on("connection", (socket: any) => {

    console.log("User connected", socket.id, socket.handshake.address);
    socket.on("player-connected", (name: string) => {
        socket.join("global")
       
        if (name.length > 6) {
            name = name.slice(0, 6);
        }
        players.push({
            name,
            avatar: {
                theme: getRandomElement(avatarThemes),
                shape: getRandomElement(avatarShapes)
            },
            id: socket.id
        });
        io.emit("players_update", players);
    })

    socket.on("create_room", (room: Room) => {
        socket.broadcast.emit("room_created", room);
    })
    socket.on("join_room", (room: Room) => {
        socket.join(room.id);
    })
    socket.on("leave_room", (room: Room) => {
        socket.leave(room.id);
    })

    socket.on("join_game", (roomId: string) => {
        socket.join(roomId);
        socket.broadcast.to(roomId).emit("get_gameId");
    })

    socket.on("request_join_game", ({author, gameId, target}: {gameId: number, author:string, target:string}) => {
        socket.broadcast.emit("requested_join_game", {author, gameId, target});
    })

    socket.on("send_message", (msg: IMessage) => {
        console.log(msg);
        socket.broadcast.to(msg.room.id).emit(("get_message"), msg);
    })


    socket.on("writing", (room: {name: string, id:string}) => {
        socket.broadcast.emit("someone_writing", room);
    })
    socket.on("done_writing", (room: {name: string, id:string}) => {
        socket.broadcast.emit("done_writing", room)
    })

    socket.on("request_players_list", () => {
        io.emit("get_players", players);
    })

    socket.on("accept_challange", (gameInfo: GameInfo) => {
        socket.broadcast.to(gameInfo.roomId).emit("challange_accepted", gameInfo);
    })
    socket.on("make_move", (gameInfo: GameInfo) => {
            socket.broadcast.to(gameInfo.roomId).emit("move_made", gameInfo);
    })
    socket.on("player_wants_rematch", (rematch: Rematch) => {
        socket.broadcast.to(rematch.roomId).emit("player_wants_rematch", rematch)
    })
    socket.on("restart_game", (gameInfo: GameInfo) => {
        socket.broadcast.to(gameInfo.roomId).emit("game_restarted")
    })
    socket.on("player-close-game", (gameInfo: GameInfo) => {
        socket.broadcast.to(gameInfo.roomId).emit("player_closed_game", gameInfo);
        console.log("close", gameInfo.roomId, gameInfo.gameId)
    })

    socket.on("disconnect", () => {
        console.log("user disconnected");
        const player = players.find((player) => player.id == socket.id);
        players = players.filter((player) => player.id !== socket.id);
        io.emit("players_update", players);
        if (player) {
            io.emit("player_disconnected", player);
        }
    })

})


server.listen(process.env.PORT , () => {
    console.log('server running');
})


const avatarThemes = ["frogideas", "sugarsweets", "heatwave", "daisygarden", "seascape",
    "summerwarmth", "bythepool", "duskfalling", "berrypie", "base"];

const avatarShapes = ["squares", "isogrids", "spaceinvaders", "labs/isogrids/hexa", "labs/isogrids/hexa16"];

function getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * (array.length - 1))]
}


