const express = require("express");
const helmet = require("helmet");
const path = require("path");
const {
  Monolith,
  Ritual,
  Portal,
  sacrifice,
  alter,
  log
} = require("./src/index.js");

const ports = { http_port: 3000, https_port: 3443 };
const FP_MONOLITH = new Monolith(
  {
    filepath: `${__dirname}`,
    title: "test", // rememberable name
    ...sacrifice(path.join(__dirname, "src", "dist", "new.html")) // We are dismantling a file to create a new working copy
  },
  true,
  true
);

// Duplicate, needs a higher level abstraction
const VIRTUAL_MONOLITH = new Monolith(FP_MONOLITH, true);
VIRTUAL_MONOLITH.reassign({ body: alter(VIRTUAL_MONOLITH) }, true, true);

const theDance = (req, res) => {
  // This is a light verification of form data, title influences file name right now
  if (/^[a-z]+$/gi.test(req.body.title)) {

    VIRTUAL_MONOLITH.reassign(req.body);
    // Replace the body and init for retemplating <default behavior>
    FP_MONOLITH.reassign(req.body);
    // We may simply comment this out to remove saving from the net entirely or place a bool flag before it
    FP_MONOLITH.write();
    // alter is only called once, to append itself within itself
    VIRTUAL_MONOLITH.reassign({ body: alter(VIRTUAL_MONOLITH) }, true);
    // I dont like users so I reply or I don't.
    res.status(200).send(VIRTUAL_MONOLITH.payload);
  } else {
    log("You may only assign an alphabetic path/filename.", "red");
    res.end();
  }
};

const theUninitiated = new Ritual(
  [
    {
      path: "/",
      page: VIRTUAL_MONOLITH,
      post: [express.urlencoded({ extended: false }), theDance]
    },
    { path: "/sanity", page: FP_MONOLITH.payload },
    { path: "/*", page: "404, you won't find a file directory here." }
  ],
  express.Router(),
  ports.https_port
);

let client = express();
client.use(
  helmet(),
  helmet.permittedCrossDomainPolicies(),
  helmet.noCache(),
  helmet.referrerPolicy(),
  (req, res, next) => {
    theUninitiated.ritual(req, res, next);
  }
);
Portal(client, ports);
