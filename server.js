
const fs = require("fs");
const path = require("path");
const fastify = require("fastify")({logger: false,});

fastify.register(require("@fastify/static"), {root: path.join(__dirname, "public"),prefix: "/",});
fastify.register(require("@fastify/formbody"));
fastify.register(require("@fastify/view"), {engine: {handlebars: require("handlebars"),},});

// Load and parse SEO data
const seo = require("./src/seo.json");
if (seo.url === "glitch-default") {seo.url = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;}
const data = require("./src/data.json");
const db = require("./src/" + data.database);










fastify.addHook("onRequest", (req, reply, next) => {
  const protocol = req.raw.headers["x-forwarded-proto"].split(",")[0];
  if (protocol === "http") {reply.redirect("https://" + req.hostname + req.url);}
  
  console.log(req.url, req.session);
  if( req.session === undefined && req.url != "/login"){
    reply.redirect("/login");
  }
  next();
});



fastify.get("/", async (request, reply) => {
  reply.send("hey");
});


fastify.get("/login", async (request, reply) => {
  reply.send("login");
});

fastify.get("/post", async (request, reply) => {

});



































fastify.listen(
  { port: process.env.PORT, host: "0.0.0.0" },
  function (err, address) {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
    fastify.log.info(`server listening on ${address}`);
  }
);
