
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



fastify.register(require('@fastify/cookie'), {
  secret: process.env.COOKIE_SECRET, // for cookies signature
  parseOptions: {}     // options for parsing cookies
})
fastify.register(require("@fastify/session"), {
  secret: process.env.SESSION_SECRET,
  saveUninitialized: true, 
  cookie: {
    secure:false, 
    httpOnly: true, 
    sameSite: false, 
    maxAge: 1000 * 60 * 5 // 5 mins
  }
});






fastify.addHook("onRequest", (req, reply, next) => {
  const protocol = req.raw.headers["x-forwarded-proto"].split(",")[0];
  if (protocol === "http") {reply.redirect("https://" + req.hostname + req.url);}
  
  console.log(req.url, req.session.isAuthenticated);
  if( req.session.isAuthenticated === undefined && req.url != "/login"){
    reply.redirect("/login");
  }
  next();
});



fastify.get("/", async (request, reply) => {
  reply.send("hey");
});


fastify.get("/login", async (request, reply) => {
  return reply.view("/src/pages/login.hbs", {msg:""});
});

fastify.post("/login", async (request, reply) => {
  console.log("=================")
  const username = request.body.username;
  const password = request.body.password;
  // console.log(username,password);
  const user = await db.runQuery1(`SELECT * FROM Users WHERE username='${username}' AND password='${password}'`);
  if( user.length > 0 ){
    // user exists
    request.session.uid = user.uid;
    request.session.username = user.username;
    request.session.isAuthenticated = true;
    
  }else{
    // user does not exist
    return reply.view("/src/pages/login.hbs", {msg:"User does not exist!"});
  }
  return reply.redirect("/");
  // return reply.type("json").send(user);
});


fastify.get("/logout", async (request, reply) => {
  console.log(request.session.isAuthenticated);
  if(request.session.isAuthenticated){
    const uid = request.session.uid;
    await db.runQuery2(`UPDATE Users SET session_id=null WHERE uid='${uid}'`);
    return reply.type("json").send({success:"user successfully logged out"});
  }else{
    return reply.type("json").send({error:"user not found to logout"});
  }
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
