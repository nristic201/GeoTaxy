import "reflect-metadata";
import * as express from "express";
import { createConnection } from "typeorm";
import { amqp_url } from "./assets/helpers";
import { Taksista } from "./entiteti/Taksista";
import { Voznja } from "./entiteti/Voznja";
let app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({extended:true}));


createConnection()
  .then(db_conn => {
    app.post("/login", (req: any, res: any) => {
      let username = req.body.username;
      let password = req.body.password;

      db_conn
        .getRepository(Taksista)
        .find({
          username: username
        })
        .then(user => {
          if (user[0].password === password) {
            res.json(user[0]);
          } else {
            res.json({
              error: "wrong data"
            });
          }
        });
    });
    app.get("/", (req, res) => {
      res.json({ msg: "..." });
    });
    app.get("/profile", (req:any, res:any) => {
      let username = req.query.username;
      db_conn
        .getRepository(Taksista)
        .find({
          relations: ["firma", "lista_voznji"],
          where: { username: username }
        })
        .then(result => {
          if (result) {
            let user = result[0] as Taksista;
            let voznje = user.lista_voznji;
            let sum:number = 0;
            voznje.forEach(voznja => {
              sum += voznja.ocena;
            });
            let ocena = sum / voznje.length;
             user.ocena = ocena;
            db_conn.getRepository(Taksista).save(user);

            res.json(user);
          }
        });
    });

    app.listen(3000, () => {
      console.log("express pokrenut...");
      let amqp = require("amqplib/callback_api");
      amqp.connect(amqp_url, (err: any, conn: any) => {
        if (err) bail(err);
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

function bail(err: any) {
  console.error(err);
  process.exit(1);
}

function receiveCoords(conn: any) {
  conn.createChannel((err: any, ch: any) => {
    if (!err == null) bail(err);
    ch.assertQueue("KoordinateTaksista");

    ch.consume(
      "KoordinateTaksista",
      (msg: any) => {
        if (msg) {
          console.log("consumed");
          replyReceivingCorrds(conn, msg.content.toString());
        }
      },
      { noAck: true }
    );
  });
}

function replyReceivingCorrds(conn: any, msg: string) {
  conn.createChannel((err: any, ch: any) => {
    if (!err == null) bail(err);
    console.log("sent");
    ch.assertExchange("amq.fanout", "fanout", { durable: true });
    ch.publish("amq.fanout", "", new Buffer(msg));
  });
}

function receiveRequests(conn: any) {
  conn.createChannel((err: any, ch: any) => {
    if (!err == null) bail(err);
    ch.assertQueue("ZahtevQueue");
    ch.consume(
      "ZahtevQueue",
      (msg: any) => {
        if (msg) {
          replyRequests(conn, msg.content.toString());
        }
      },
      { noAck: true }
    );
  });
}

function replyRequests(conn: any, msg: string) {
  conn.createChannel((err: any, ch: any) => {
    if (!err == null) bail(err);
    let request = JSON.parse(msg);
    let taxiUsername = request.usernameTaksiste;
    ch.assertQueue(taxiUsername + ":zahtev");
    ch.sendToQueue(taxiUsername + ":zahtev", new Buffer(msg));
  });
}

function receiveResponse(conn: any) {
  conn.createChannel((err: any, ch: any) => {
    if (!err == null) bail(err);

    ch.assertQueue("OdgovorQueue");
    ch.consume(
      "OdgovorQueue",
      (msg: any) => {
        if (msg) {
          replyResponse(conn, msg.content.toString());
        }
      },
      { noAck: true }
    );
  });
}

function replyResponse(conn: any, msg: string) {
  conn.createChannel((err: any, ch: any) => {
    if (!err == null) bail(err);
    let response = JSON.parse(msg);
    let queueForResponse = response.listeningQueue;
    ch.assertQueue(queueForResponse);
    ch.sendToQueue(queueForResponse, new Buffer(msg));
  });
}

function receiveEndRide(conn: any, db_conn: any) {
  conn.createChannel((err: any, ch: any) => {
    if (!err == null) bail(err);

    ch.assertQueue("KrajVoznjeQueue");
    ch.consume(
      "KrajVoznjeQueue",
      (msg: any) => {
        if (msg) {
          let endRide = JSON.parse(msg.content.toString());
          db_conn
            .getRepository(Taksista)
            .findOne({ username: endRide.username })
            .then((taksista: any) => {
              //let taksista_id:number = (taksista as Taksista).id;
              let v: Voznja;
              db_conn
                .getRepository(Voznja)
                .findOne({ vozac: taksista as Taksista, u_toku: 1 })
                .then((voznja: any) => {
                  v = voznja as Voznja;
                  v.lokacija_do_lat = endRide.lat;
                  v.lokacija_do_lon = endRide.lon;
                  v.u_toku = 0;
                  db_conn
                    .getRepository(Voznja)
                    .save(v)
                    .then((res: any) => {
                      replyEndRide(conn, msg.content.toString(), v);
                    });
                });
            })
            .catch((err: any) => console.log(err));
        }
      },
      { noAck: true }
    );
  });
}

function replyEndRide(conn: any, msg: string, v: Voznja) {
  conn.createChannel((err: any, ch: any) => {
    if (!err == null) bail(err);

    let endRide = JSON.parse(msg);
    let voznja = { id_voznje: v.id };
    let queueForResponse = endRide.queueForResponse + "1";

    ch.assertQueue(queueForResponse);
    ch.sendToQueue(queueForResponse, new Buffer(JSON.stringify(voznja)));
  });
}

function receiveStartRide(conn: any, db_conn: any) {
  conn.createChannel((err: any, ch: any) => {
    if (!err == null) bail(err);

    ch.assertQueue("PocetakVoznjeQueue");
    ch.consume(
      "PocetakVoznjeQueue",
      (msg: any) => {
        if (msg) {
          let startRide = JSON.parse(msg.content.toString());

          let voznja = new Voznja(
            startRide.lat_start,
            startRide.lon_start,
            "",
            "",
            -1,
            1,
            new Date()
          );

          db_conn
            .getRepository(Taksista)
            .findOne({ username: startRide.username })
            .then((res: any) => {
              if (res) {
                voznja.Vozac = res as Taksista;
                db_conn.getRepository(Voznja).save(voznja);
              } else {
                console.log("error upisivanja voznje");
              }
            });
        }
      },
      { noAck: true }
    );
  });
}

function receiveOcena(conn: any, db_conn: any) {
  conn.createChannel((err: any, ch: any) => {
    if (!err == null) bail(err);

    ch.assertQueue("OcenaQueue");
    ch.consume(
      "OcenaQueue",
      (msg: any) => {
        if (msg) {
          let ocena = JSON.parse(msg.content.toString());
          db_conn
            .getRepository(Voznja)
            .findOne({ id: ocena.idVoznje })
            .then((res: any) => {
              let voznja = res as Voznja;
              voznja.ocena = ocena.ocena;
              db_conn.getRepository(Voznja).save(voznja);
            });
        }
      },
      { noAck: true }
    );
  });
}

//const queueExist = (conn: any) => {};

process.on("uncaughtException", function(err) {
  console.error(err);
});
