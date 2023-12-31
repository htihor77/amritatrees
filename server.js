require('dotenv').config()
const fs = require("fs");
const path = require("path");
const fastify = require("fastify")({logger: false,});
const PORT = process.env.PORT || 3000
const utils = require("./utils.js");

fastify.register(require("@fastify/static"), {root: path.join(__dirname, "public"),prefix: "/",});
fastify.register(require("@fastify/formbody"));
fastify.register(require("@fastify/view"), {
  engine: {handlebars: require("handlebars"),},
  options: {
    partials:{
      head: "/src/partials/head.handlebars",
      navbar: "/src/partials/navbar.handlebars",
      sidebar: "/src/partials/sidebar.handlebars",
      invbar: "/src/partials/invbar.handlebars",
      marker_prompt: "/src/partials/marker_prompt.handlebars",
    }
  },
});

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
    maxAge: 1000 * 60 * 60 * 24 * 30 * 12 // a year
  }
});

fastify.addHook("onRequest", (request, reply, next) => {
  // const protocol = request.raw.headers["x-forwarded-proto"].split(",")[0];
  // if (protocol === "http") {reply.redirect("https://" + request.hostname + request.url);}

  // console.log("onRequest:",request.url);
  const sid = request.session.sessionId;
  // console.log("sid:",sid);
  
  const valid_urls = ["/login","/signup","/leaderboards","/css/style.css","/manifest.json", "/", "/test"];
  const valid_prefix_urls = []
  if( request.session.isAuthenticated === undefined && valid_urls.indexOf(request.url) == -1 && !request.url.startsWith("/css/" || "/assets/") ){
    reply.redirect("/login");
  }
  next();
});

fastify.get("/", async (request, reply) => {
  
  let loginBtn = "LOGIN"
  let signIn_msg = "SIGNUP"
  let signIn_url = "signup"
  if( request.session.isAuthenticated ){
    console.log("user authenticated");
    loginBtn = "GAME";
    signIn_msg = "LOGOUT";
    signIn_url = "logout";
  }
  return reply.view("/src/pages/index.hbs", {loginBtn: loginBtn, signIn: { msg: signIn_msg, url: signIn_url } });
});

fastify.get("/game", async (request, reply) => {
  const user = request.session.user;
  const data = await db.runQuery1(`SELECT * FROM Users WHERE uid=${user.uid}`)  
  const User = {username:data[0].username,points:data[0].points}
  return reply.view("/src/pages/game.hbs", { user: User });
});

fastify.get("/serviceworker.js", async (req,reply)=>{
  const buffer = fs.readFileSync('serviceworker.js');
  return reply.type('application/javascript').send(buffer);
})
fastify.get("/manifest.json", async (req,reply)=>{
  const buffer = fs.readFileSync(__dirname+'/public/manifest.json');
  return reply.type('json').send(buffer);
})

fastify.get("/login", async (request, reply) => {
  console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
  // console.log("sid:",request.session.sessionId);
  // const data = await db.runQuery1(`SELECT session_id FROM Users`);
  // console.log(data);
  
  if( request.session.isAuthenticated ){
    // return reply.redirect("/map");
    return reply.redirect("/game");
  }else{
    return reply.view("/src/pages/login.hbs", {});
  }
});
fastify.post("/login", async (request, reply) => {
  console.log("==================================")
  const userdata = request.body.userdata;
  // const password = utils.reverse(request.body.password);
  const password = request.body.password;
  console.log(userdata,password);
  const user = await db.runQuery1(`SELECT * FROM Users WHERE username='${userdata}' AND password='${password}'`);
  // const user = await db.runQuery1(`SELECT * FROM Users WHERE email='${userdata}' AND password='${password}'`);
  if( user.length > 0 && userdata.length != 0 && password.length != 0){
    // user exists
    request.session.user = { uid: user[0].uid, username: user[0].username };
    request.session.isAuthenticated = true;
    const sid = request.session.sessionId;
    await db.runQuery2(`UPDATE Users SET session_id='${sid}' WHERE uid='${user[0].uid}'`);
    
  }else{
    // user does not exist
    return reply.view("/src/pages/login.hbs", {err:"User does not exist!"});
  }
  // return reply.redirect("/map");
  return reply.redirect("/game");
  // return reply.type("json").send(user);
});
fastify.get("/logout", async (request, reply) => {
  console.log(request.session.isAuthenticated);
  if(request.session.isAuthenticated){
    const uid = request.session.uid;
    request.session.destroy();
    await db.runQuery2(`UPDATE Users SET session_id=null WHERE uid='${uid}'`);
    return reply.redirect("/login");
  }else{
    return reply.type("json").send({error:"user not found to logout"});
  }
});

fastify.get("/signup", async (request, reply) => {
  return reply.view("/src/pages/signup.hbs", {err:""});
});
fastify.post("/signup", async (request, reply) => {
  let email = request.body.email.trim();
  let username = request.body.username.trim();
  const password = request.body.password.trim();
  
  const findEmail = await db.runQuery1(`SELECT * FROM Users WHERE email='${email}'`);
  const findUsername = await db.runQuery1(`SELECT * FROM Users WHERE username='${username}'`);
  // console.log(email,username,password);
  
  let msg;
  if( findEmail.length > 0 ){
    msg = "Email already exists!";
    email = "";
  }else if( findUsername.length > 0 ){
    msg = "Username already exists";
    username = "";
  }else{
    // new user
    console.log("new user details");
    await db.runQuery2(`INSERT INTO Users (email,username,password,session_id,points,collected,lat,lng) VALUES ('${email}','${username}','${password}',null,0, 0,10.9,76.9)`);
    return reply.view("/src/pages/login.hbs", {msg:""});
  }
  
  // return reply.send("post");
  return reply.view("/src/pages/signup.hbs", {err:msg, username: username, email:email});
});


fastify.get("/inventory", async (request, reply) => {
  const params = request.query.raw ? {}: {};
  console.log(params);
  
  const user = request.session.user;
  const data = await db.runQuery1(`SELECT username,points FROM Users WHERE uid=${user.uid}`);
  params.user = data[0];
  console.log(user.username)  
  // params.unlocked = await db.runQuery1(`SELECT Inventory.scientific_name,A_TREE_butes.url FROM Inventory, A_TREE_butes WHERE Inventory.username='${user.username}' AND Inventory.scientific_name=A_TREE_butes.scientific_name`)
  params.unlocked = await db.runQuery1(`SELECT scientific_name FROM Inventory WHERE Inventory.username='${user.username}'`)
  params.locked = await db.runQuery1(`SELECT scientific_name,url FROM A_TREE_butes WHERE scientific_name NOT IN (SELECT scientific_name FROM Inventory WHERE username='${user.username}')`);
  const maxTrees = await db.runQuery1("SELECT COUNT(DISTINCT scientific_name) FROM Quiz");
  params.max = maxTrees[0]["COUNT(DISTINCT scientific_name)"]
  
  return request.query.raw
    ? reply.send(params)
    : reply.view("/src/pages/inventory.hbs", params );
});

fastify.get("/treedata", async (request, reply) => {
  const userdata = request.session.user;
  const UserArr = await db.runQuery1(`SELECT username,points FROM Users WHERE uid=${userdata.uid}`);
  const user = UserArr[0];
  
  // const data = await db.runQuery1(`SELECT * FROM Trees WHERE scientific_name IN (SELECT DISTINCT scientific_name FROM Quiz)`);
  const data = await db.runQuery1(`SELECT * FROM Trees WHERE scientific_name IN (SELECT scientific_name FROM Quiz WHERE scientific_name NOT IN (SELECT scientific_name FROM Inventory WHERE username='${user.username}'))`);
  
  return reply.send(data)
});
fastify.get("/treerepo", async (request, reply) => {
  const data = await db.runQuery1(`SELECT * FROM Trees INNER JOIN A_TREE_butes ON Trees.scientific_name = A_TREE_butes.scientific_name`);
  return reply.send(data)
});
fastify.get("/treerepo_namelist", async (request, reply) => {
  const data = await db.runQuery1(`SELECT DISTINCT A_TREE_butes.scientific_name, Trees.coords FROM A_TREE_butes LEFT JOIN Trees ON Trees.scientific_name=A_TREE_butes.scientific_name ORDER BY A_TREE_butes.scientific_name`);
  return reply.send(data)
});



fastify.get("/leaderboards", async (request, reply) => {
  const data1 = await db.runQuery1(`SELECT username,points FROM Users ORDER BY points DESC`);
  const data2 = await db.runQuery1(`SELECT username,collected FROM Users ORDER BY collected DESC`);
  return reply.view("/src/pages/leaderboards.hbs", { points: data1, collected: data2 } );
  // return reply.type("json").send({ points: data1, collected: data2 });
});


fastify.get("/repository", async (request, reply) => {
  const data = await db.runQuery1("");
  return reply.view("/src/pages/repository.hbs", { trees: data } );
});




fastify.post("/checkinglocation", async (request, reply) => {
  
  // const entrance = {lat:10.901853212312897,lng: 76.89603899041079};
  const body = request.body;
  console.log(body)
  const pos1 = body.pos1;
  const pos2 = body.pos2;

  const treeCoords1 = pos2.lat + ", " + pos2.lng;
  const treeCoords2 = pos2.lat + "0, " + pos2.lng;
  const treeCoords3 = pos2.lat + ", " + pos2.lng + "0";
  const treeCoords4 = pos2.lat + "0, " + pos2.lng + "0";
  
  
  const treeArr1 = await db.runQuery1(`SELECT * FROM Trees WHERE coords='${treeCoords1}'`)
  const treeArr2 = await db.runQuery1(`SELECT * FROM Trees WHERE coords='${treeCoords2}'`)
  const treeArr3 = await db.runQuery1(`SELECT * FROM Trees WHERE coords='${treeCoords3}'`)
  const treeArr4 = await db.runQuery1(`SELECT * FROM Trees WHERE coords='${treeCoords4}'`)
  
  const tree = treeArr1[0] ||  treeArr2[0] || treeArr3[0] || treeArr4[0]
  
  console.log(tree);
  
  const QuizArr = await db.runQuery1(`SELECT * FROM Quiz WHERE scientific_name='${tree.scientific_name}'`)
  
  console.log(QuizArr)
  
  const index = Math.floor(Math.random() * QuizArr.length)
  const quiz = QuizArr[index]
  // console.log(quiz)
  
  const distance = utils.measureDistance(pos1.lat,pos1.lng, pos2.lat, pos2.lng);
  return reply.type("json").send({distance: distance, quiz_id: quiz.quiz_id , quiz: quiz.question , options: quiz.options });
});

fastify.post("/checkinganswer", async (request, reply) => {
  let tree = ""
    const userdata = request.session.user;
    const UserArr = await db.runQuery1(`SELECT username,points FROM Users WHERE uid=${userdata.uid}`);
    const user = UserArr[0];
  // const entrance = {lat:10.901853212312897,lng: 76.89603899041079};
  const body = request.body;
  const q = Number(body.q);
  const ans = body.ans.trim();
  let points = 0;
  console.log(q)
  console.log(ans)

  const QuizArr = await db.runQuery1(`SELECT * FROM Quiz WHERE quiz_id=${q}`)
  const quiz = QuizArr[0];
  
  let true_or_false = false;
  console.log(quiz);
  
  if( quiz.answer.trim() == ans.trim() ){
    console.log("answer is correct");
    true_or_false = true;
    
    const val = await db.runQuery1(`SELECT EXISTS(SELECT 1 FROM Inventory WHERE scientific_name='${quiz.scientific_name}' AND username='${user.username}' LIMIT 1);`)
    const available = Object.values(val[0])[0];
    tree = quiz.scientific_name;
    console.log("available:",available)
    if( available == "0" ){
      console.log("add tree into user inventory");
      await db.runQuery2(`INSERT INTO Inventory (username, scientific_name) VALUES ('${user.username}', '${quiz.scientific_name}')`)
      console.log(await db.runQuery1(`SELECT * FROM Inventory WHERE username='${user.username}'`));
      
      points = 10;
      await db.runQuery2(`UPDATE Users SET points=points+${points} WHERE username='${user.username}'`);
      await db.runQuery2(`UPDATE Users SET collected=collected+1 WHERE username='${user.username}'`);
      
    }
    
  }else{
    console.log("add cooldown for that user for",quiz.scientific_name);
    // DisabledTrees
    await db.runQuery2(`INSERT INTO DisabledTrees (username, scientific_name, time) VALUES ('${user.username}', '${quiz.scientific_name}', ${Date.now()})`)
  }
  
  return reply.type("json").send({"correct": true_or_false, "tree": tree, "points": points});
});







fastify.post("/setuserlocation", async (request, reply) => {
  const userdata = request.session.user;
  
  const lat = request.body.lat;
  const lng = request.body.lng;
  
  await db.runQuery2(`UPDATE Users SET lat=${lat}, lng=${lng} WHERE uid=${userdata.uid}`);
  return reply.type("json").send({"status": "OK"});
});








fastify.get("/db", async (request, reply) => {
  const table = request.query.table;
  const data = await db.runQuery1(`SELECT * FROM ${table}`);
  return reply.send(data)
});


fastify.get("/test", async (request, reply) => {
  
  // const data = await db.runQuery1("")  
  // const data = await db.runQuery1(`SELECT Inventory.scientific_name,A_TREE_butes.url FROM Inventory, A_TREE_butes WHERE Inventory.username='rishi ' AND Inventory.scientific_name=A_TREE_butes.scientific_name`)
  // const data = await db.runQuery1(`SELECT Inventory.scientific_name,A_TREE_butes.url FROM Inventory INNER JOIN A_TREE_butes ON Inventory.scientific_name=A_TREE_butes.scientific_name WHERE Inventory.username='rishi '`)
  // const data = await db.runQuery1(`SELECT scientific_name FROM Inventory WHERE username='nandhu'`)
  const data = await db.runQuery1(`SELECT * FROM Trees WHERE scientific_name IN (SELECT scientific_name FROM Quiz WHERE scientific_name NOT IN (SELECT scientific_name FROM Inventory WHERE username='nandhu'))`)
  
  return reply.send(data).type("json")
});

// fastify.listen(
//   { port: PORT, host: "127.0.0.1" },
//   function (err, address) {
//     if (err) {
//       fastify.log.error(err);
//       process.exit(1);
//     }
//     console.log(`Your app is listening on ${address}`);
//     fastify.log.info(`server listening on ${address}`);
//   }
// );

fastify.listen({port:PORT}, function(){
  console.log("running..")
})