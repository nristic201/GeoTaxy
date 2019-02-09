"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const typeorm_1 = require("typeorm");
const helpers_1 = require("./assets/helpers");
const Taksista_1 = require("./entiteti/Taksista");
const Voznja_1 = require("./entiteti/Voznja");
let app = express_1.default();
var bodyParser = require("body-parser");
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
}));
app.use(express_1.default.json()); // to support JSON-encoded bodies
app.use(express_1.default.urlencoded());
const db = require("../src/modules/ormconfig");
const db_conn = typeorm_1.createConnection(db)
    .then(db_conn => {
    app.post("/login", (req, res) => {
        let username = req.body.username;
        let password = req.body.password;
        let t1 = db_conn
            .getRepository(Taksista_1.Taksista)
            .find({
            username: username
        })
            .then(user => {
            if (user[0].password === password) {
                res.json(user[0]);
            }
            else {
                res.json({
                    error: "wrong data"
                });
            }
        });
    });
    app.get('/', (req, res) => {
        res.json({ "msg": "..." });
    });
    app.get("/profile", (req, res) => {
        let username = req.query.username;
        db_conn
            .getRepository(Taksista_1.Taksista)
            .find({
            relations: ["firma", "lista_voznji"],
            where: { username: username }
        })
            .then(result => {
            if (result) {
                let user = result[0];
                let voznje = user.lista_voznji;
                let sum = 0;
                voznje.forEach(voznja => {
                    sum += voznja.ocena;
                });
                let ocena = sum / voznje.length;
                //  user.ocena = ocena;
                // db_conn.getRepository(Taksista).save(user);
                res.json(user);
            }
        });
    });
    app.listen(3000, () => {
        console.log("express pokrenut...");
        let amqp = require("amqplib/callback_api");
        amqp.connect(helpers_1.amqp_url, (err, conn) => {
            if (err)
                bail(err);
            console.log("amqp pokrenut...");
            receiveCoords(conn);
            receiveRequests(conn);
            receiveResponse(conn);
            receiveStartRide(conn, db_conn);
            receiveOcena(conn, db_conn);
            receiveEndRide(conn, db_conn);
        });
    });
})
    .catch(err => console.log(err));
function bail(err) {
    console.error(err);
    process.exit(1);
}
function receiveCoords(conn) {
    conn.createChannel((err, ch) => {
        if (!err == null)
            bail(err);
        ch.assertQueue("KoordinateTaksista");
        ch.consume("KoordinateTaksista", (msg) => {
            if (msg) {
                console.log("consumed");
                replyReceivingCorrds(conn, msg.content.toString());
            }
        }, { noAck: true });
    });
}
function replyReceivingCorrds(conn, msg) {
    conn.createChannel((err, ch) => {
        if (!err == null)
            bail(err);
        console.log("sent");
        ch.assertExchange("amq.fanout", "fanout", { durable: true });
        ch.publish("amq.fanout", "", new Buffer(msg));
    });
}
function receiveRequests(conn) {
    conn.createChannel((err, ch) => {
        if (!err == null)
            bail(err);
        ch.assertQueue("ZahtevQueue");
        ch.consume("ZahtevQueue", (msg) => {
            if (msg) {
                replyRequests(conn, msg.content.toString());
            }
        }, { noAck: true });
    });
}
function replyRequests(conn, msg) {
    conn.createChannel((err, ch) => {
        if (!err == null)
            bail(err);
        let request = JSON.parse(msg);
        let taxiUsername = request.usernameTaksiste;
        ch.assertQueue(taxiUsername + ":zahtev");
        ch.sendToQueue(taxiUsername + ":zahtev", new Buffer(msg));
    });
}
function receiveResponse(conn) {
    conn.createChannel((err, ch) => {
        if (!err == null)
            bail(err);
        ch.assertQueue("OdgovorQueue");
        ch.consume("OdgovorQueue", (msg) => {
            if (msg) {
                replyResponse(conn, msg.content.toString());
            }
        }, { noAck: true });
    });
}
function replyResponse(conn, msg) {
    conn.createChannel((err, ch) => {
        if (!err == null)
            bail(err);
        let response = JSON.parse(msg);
        let queueForResponse = response.listeningQueue;
        ch.assertQueue(queueForResponse);
        ch.sendToQueue(queueForResponse, new Buffer(msg));
    });
}
function receiveEndRide(conn, db_conn) {
    conn.createChannel((err, ch) => {
        if (!err == null)
            bail(err);
        ch.assertQueue("KrajVoznjeQueue");
        ch.consume("KrajVoznjeQueue", (msg) => {
            if (msg) {
                let endRide = JSON.parse(msg.content.toString());
                let v;
                db_conn
                    .getRepository(Taksista_1.Taksista)
                    .findOne({ username: endRide.username })
                    .then((taksista) => {
                    let taksista_id = taksista.id;
                    db_conn
                        .getRepository(Voznja_1.Voznja)
                        .findOne({ vozac: taksista, u_toku: 1 })
                        .then((voznja) => {
                        v = voznja;
                        v.lokacija_do_lat = endRide.lat;
                        v.lokacija_do_lon = endRide.lon;
                        v.u_toku = 0;
                        db_conn
                            .getRepository(Voznja_1.Voznja)
                            .save(v)
                            .then((res) => {
                            replyEndRide(conn, msg.content.toString(), v);
                        });
                    });
                })
                    .catch((err) => console.log(err));
            }
        }, { noAck: true });
    });
}
function replyEndRide(conn, msg, v) {
    conn.createChannel((err, ch) => {
        if (!err == null)
            bail(err);
        let endRide = JSON.parse(msg);
        let voznja = { id_voznje: v.id };
        let queueForResponse = endRide.queueForResponse + "1";
        ch.assertQueue(queueForResponse);
        ch.sendToQueue(queueForResponse, new Buffer(JSON.stringify(voznja)));
    });
}
function receiveStartRide(conn, db_conn) {
    conn.createChannel((err, ch) => {
        if (!err == null)
            bail(err);
        ch.assertQueue("PocetakVoznjeQueue");
        ch.consume("PocetakVoznjeQueue", (msg) => {
            if (msg) {
                let startRide = JSON.parse(msg.content.toString());
                let voznja = new Voznja_1.Voznja(startRide.lat_start, startRide.lon_start, "", "", -1, 1, new Date());
                db_conn
                    .getRepository(Taksista_1.Taksista)
                    .findOne({ username: startRide.username })
                    .then((res) => {
                    if (res) {
                        voznja.Vozac = res;
                        db_conn.getRepository(Voznja_1.Voznja).save(voznja);
                    }
                    else {
                        console.log("error upisivanja voznje");
                    }
                });
            }
        }, { noAck: true });
    });
}
function receiveOcena(conn, db_conn) {
    conn.createChannel((err, ch) => {
        if (!err == null)
            bail(err);
        ch.assertQueue("OcenaQueue");
        ch.consume("OcenaQueue", (msg) => {
            if (msg) {
                let ocena = JSON.parse(msg.content.toString());
                db_conn
                    .getRepository(Voznja_1.Voznja)
                    .findOne({ id: ocena.idVoznje })
                    .then((res) => {
                    let voznja = res;
                    voznja.ocena = ocena.ocena;
                    db_conn.getRepository(Voznja_1.Voznja).save(voznja);
                });
            }
        }, { noAck: true });
    });
}
const queueExist = (conn) => { };
process.on('uncaughtException', function (err) {
    console.error(err);
});
//# sourceMappingURL=index.js.map