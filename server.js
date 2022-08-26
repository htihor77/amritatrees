
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
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
});
fastify.addHook("onRequest", (req, reply, next) => {
  const protocol = req.raw.headers["x-forwarded-proto"].split(",")[0];
  if (protocol === "http") {reply.redirect("https://" + req.hostname + req.url);}
  
  // console.log(req.url, req.session.isAuthenticated);
  if( req.session.isAuthenticated === undefined && req.url != "/login"){
    reply.redirect("/login");
  }
  next();
});


fastify.get("/", async (request, reply) => {
  const user = request.session.user;
  const data = await db.runQuery1(`SELECT * FROM Users WHERE uid=${user.uid}`)
  
  const User = {
    username:data[0].username,
    points:data[0].points
  }
  return reply.view("/src/pages/index.hbs", { user: User });
});


fastify.get("/login", async (request, reply) => {
  if( request.session.isAuthenticated ){
    return reply.redirect("/");
  }else{
    return reply.view("/src/pages/login.hbs", {msg:""});
  }
});
fastify.post("/login", async (request, reply) => {
  console.log("=================")
  const username = request.body.username;
  const password = request.body.password;
  // console.log(username,password);
  const user = await db.runQuery1(`SELECT * FROM Users WHERE username='${username}' AND password='${password}'`);
  if( user.length > 0 ){
    // user exists
    request.session.user = { uid: user[0].uid, username: user[0].username };
    request.session.isAuthenticated = true;
    const sid = request.session.sessionId;
    await db.runQuery2(`UPDATE Users SET session_id='${sid}' WHERE username='${username}'`);
    
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
    request.session.destroy();
    await db.runQuery2(`UPDATE Users SET session_id=null WHERE uid='${uid}'`);
    return reply.type("json").send({success:"user successfully logged out"});
  }else{
    return reply.type("json").send({error:"user not found to logout"});
  }
});



fastify.get("/inventory", async (request, reply) => {
  const user = request.session.user;
  const data = await db.runQuery1(`SELECT * FROM Users WHERE uid=${user.uid}`)
  const User = {
    username:data[0].username,
    points:data[0].points
  }
  const data1 = await db.runQuery1(`SELECT Inventory.tree_name,Atreebutes.url FROM Inventory,Atreebutes WHERE Inventory.uid=${user.uid} AND Inventory.tree_name=Atreebutes.tree_name`)
  const data2 = await db.runQuery1(`SELECT tree_name,url FROM Atreebutes WHERE tree_name NOT IN (SELECT tree_name FROM Inventory WHERE uid=${user.uid})`);
  return reply.view("/src/pages/inventory.hbs", { user: User, unlocked: data1, locked: data2 } );
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
