"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
        console.log("sent");
        ch.assertExchange("amq.fanout", "fanout", { durable: true });
        ch.publish("amq.fanout", "", new Buffer(msg));
    });
}
function receiveRequests(conn) {
    conn.createChannel(function (err, ch) {
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
        var request = JSON.parse(msg);
        var taxiUsername = request.usernameTaksiste;
        ch.assertQueue(taxiUsername + ":zahtev");
        ch.sendToQueue(taxiUsername + ":zahtev", new Buffer(msg));
    });
}
function receiveResponse(conn) {
    conn.createChannel(function (err, ch) {
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
        var response = JSON.parse(msg);
        var queueForResponse = response.listeningQueue;
        ch.assertQueue(queueForResponse);
        ch.sendToQueue(queueForResponse, new Buffer(msg));
    });
}
function receiveEndRide(conn, db_conn) {
    var _this = this;
    conn.createChannel(function (err, ch) {
        ch.assertQueue("KrajVoznjeQueue");
        ch.consume("KrajVoznjeQueue", function (msg) {
            if (msg) {
                var endRide_1 = JSON.parse(msg.content.toString());
                var v_1;
                db_conn.getRepository(Taksista_1.Taksista).findOne({ relations: ["lista_voznji"], where: { username: endRide_1.username } })
                    .then(function (taksista) { return __awaiter(_this, void 0, void 0, function () {
                    var taxist;
                    return __generator(this, function (_a) {
                        console.log(taksista);
                        taxist = taksista;
                        taxist.lista_voznji.forEach(function (voznja) {
                            if (voznja.u_toku == 1) {
                                v_1 = voznja;
                                console.log(v_1);
                            }
                        });
                        v_1.lokacija_do_lat = endRide_1.lat;
                        v_1.lokacija_do_lon = endRide_1.lon;
                        v_1.u_toku = 0;
                        db_conn.getRepository(Voznja_1.Voznja).save(v_1).then(function (res) {
                            console.log(v_1);
                            replyEndRide(conn, msg.content.toString(), v_1);
                        });
                        return [2 /*return*/];
                    });
                }); }).catch(function (err) { return console.log(err); });
            }
        }, { noAck: true });
    });
}
function replyEndRide(conn, msg, v) {
    conn.createChannel(function (err, ch) {
        var endRide = JSON.parse(msg);
        var voznja = { id_voznje: v.id };
        var queueForResponse = endRide.queueForResponse + "1";
        ch.assertQueue(queueForResponse);
        ch.sendToQueue(queueForResponse, new Buffer(JSON.stringify(voznja)));
    });
}
function receiveStartRide(conn, db_conn) {
    conn.createChannel(function (err, ch) {
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