"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var express = require("express");
var typeorm_1 = require("typeorm");
var helpers_1 = require("./assets/helpers");
var Taksista_1 = require("./entiteti/Taksista");
var Voznja_1 = require("./entiteti/Voznja");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
}));
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true }));
typeorm_1.createConnection()
    .then(function (db_conn) {
    app.post("/login", function (req, res) {
        var username = req.body.username;
        var password = req.body.password;
        db_conn
            .getRepository(Taksista_1.Taksista)
            .find({
            username: username
        })
            .then(function (user) {
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
    app.get("/", function (req, res) {
        res.json({ msg: "..." });
    });
    app.get("/profile", function (req, res) {
        var username = req.query.username;
        db_conn
            .getRepository(Taksista_1.Taksista)
            .find({
            relations: ["firma", "lista_voznji"],
            where: { username: username }
        })
            .then(function (result) {
            if (result) {
                var user = result[0];
                var voznje = user.lista_voznji;
                var sum_1 = 0;
                voznje.forEach(function (voznja) {
                    sum_1 += voznja.ocena;
                });
                var ocena = sum_1 / voznje.length;
                user.ocena = ocena;
                db_conn.getRepository(Taksista_1.Taksista).save(user);
                res.json(user);
            }
        });
    });
    app.listen(3000, function () {
        console.log("express pokrenut...");
        var amqp = require("amqplib/callback_api");
        amqp.connect(helpers_1.amqp_url, function (err, conn) {
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
    .catch(function (err) { return console.log(err); });
function bail(err) {
    console.error(err);
    process.exit(1);
}
function receiveCoords(conn) {
    conn.createChannel(function (err, ch) {
        if (!err == null)
            bail(err);
        ch.assertQueue("KoordinateTaksista");
        ch.consume("KoordinateTaksista", function (msg) {
            if (msg) {
                console.log("consumed");
                replyReceivingCorrds(conn, msg.content.toString());
            }
        }, { noAck: true });
    });
}
function replyReceivingCorrds(conn, msg) {
    conn.createChannel(function (err, ch) {
        if (!err == null)
            bail(err);
        console.log("sent");
        ch.assertExchange("amq.fanout", "fanout", { durable: true });
        ch.publish("amq.fanout", "", new Buffer(msg));
    });
}
function receiveRequests(conn) {
    conn.createChannel(function (err, ch) {
        if (!err == null)
            bail(err);
        ch.assertQueue("ZahtevQueue");
        ch.consume("ZahtevQueue", function (msg) {
            if (msg) {
                replyRequests(conn, msg.content.toString());
            }
        }, { noAck: true });
    });
}
function replyRequests(conn, msg) {
    conn.createChannel(function (err, ch) {
        if (!err == null)
            bail(err);
        var request = JSON.parse(msg);
        var taxiUsername = request.usernameTaksiste;
        ch.assertQueue(taxiUsername + ":zahtev");
        ch.sendToQueue(taxiUsername + ":zahtev", new Buffer(msg));
    });
}
function receiveResponse(conn) {
    conn.createChannel(function (err, ch) {
        if (!err == null)
            bail(err);
        ch.assertQueue("OdgovorQueue");
        ch.consume("OdgovorQueue", function (msg) {
            if (msg) {
                replyResponse(conn, msg.content.toString());
            }
        }, { noAck: true });
    });
}
function replyResponse(conn, msg) {
    conn.createChannel(function (err, ch) {
        if (!err == null)
            bail(err);
        var response = JSON.parse(msg);
        var queueForResponse = response.listeningQueue;
        ch.assertQueue(queueForResponse);
        ch.sendToQueue(queueForResponse, new Buffer(msg));
    });
}
function receiveEndRide(conn, db_conn) {
    conn.createChannel(function (err, ch) {
        if (!err == null)
            bail(err);
        ch.assertQueue("KrajVoznjeQueue");
        ch.consume("KrajVoznjeQueue", function (msg) {
            if (msg) {
                var endRide_1 = JSON.parse(msg.content.toString());
                db_conn
                    .getRepository(Taksista_1.Taksista)
                    .findOne({ username: endRide_1.username })
                    .then(function (taksista) {
                    //let taksista_id:number = (taksista as Taksista).id;
                    var v;
                    db_conn
                        .getRepository(Voznja_1.Voznja)
                        .findOne({ vozac: taksista, u_toku: 1 })
                        .then(function (voznja) {
                        v = voznja;
                        v.lokacija_do_lat = endRide_1.lat;
                        v.lokacija_do_lon = endRide_1.lon;
                        v.u_toku = 0;
                        db_conn
                            .getRepository(Voznja_1.Voznja)
                            .save(v)
                            .then(function (res) {
                            replyEndRide(conn, msg.content.toString(), v);
                        });
                    });
                })
                    .catch(function (err) { return console.log(err); });
            }
        }, { noAck: true });
    });
}
function replyEndRide(conn, msg, v) {
    conn.createChannel(function (err, ch) {
        if (!err == null)
            bail(err);
        var endRide = JSON.parse(msg);
        var voznja = { id_voznje: v.id };
        var queueForResponse = endRide.queueForResponse + "1";
        ch.assertQueue(queueForResponse);
        ch.sendToQueue(queueForResponse, new Buffer(JSON.stringify(voznja)));
    });
}
function receiveStartRide(conn, db_conn) {
    conn.createChannel(function (err, ch) {
        if (!err == null)
            bail(err);
        ch.assertQueue("PocetakVoznjeQueue");
        ch.consume("PocetakVoznjeQueue", function (msg) {
            if (msg) {
                var startRide = JSON.parse(msg.content.toString());
                var voznja_1 = new Voznja_1.Voznja(startRide.lat_start, startRide.lon_start, "", "", -1, 1, new Date());
                db_conn
                    .getRepository(Taksista_1.Taksista)
                    .findOne({ username: startRide.username })
                    .then(function (res) {
                    if (res) {
                        voznja_1.Vozac = res;
                        db_conn.getRepository(Voznja_1.Voznja).save(voznja_1);
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
    conn.createChannel(function (err, ch) {
        if (!err == null)
            bail(err);
        ch.assertQueue("OcenaQueue");
        ch.consume("OcenaQueue", function (msg) {
            if (msg) {
                var ocena_1 = JSON.parse(msg.content.toString());
                db_conn
                    .getRepository(Voznja_1.Voznja)
                    .findOne({ id: ocena_1.idVoznje })
                    .then(function (res) {
                    var voznja = res;
                    voznja.ocena = ocena_1.ocena;
                    db_conn.getRepository(Voznja_1.Voznja).save(voznja);
                });
            }
        }, { noAck: true });
    });
}
//const queueExist = (conn: any) => {};
process.on("uncaughtException", function (err) {
    console.error(err);
});
//# sourceMappingURL=index.js.map