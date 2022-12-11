
const fs = require("fs");
const path = require("path");
const fastify = require("fastify")({logger: false,});

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
  const protocol = request.raw.headers["x-forwarded-proto"].split(",")[0];
  if (protocol === "http") {reply.redirect("https://" + request.hostname + request.url);}

  // console.log("onRequest:",request.url);
  const sid = request.session.sessionId;
  // console.log("sid:",sid);
  
  const valid_urls = ["/login","/signup","/leaderboards","/css/style.css","/manifest.json", "/"];
  const valid_prefix_urls = []
  if( request.session.isAuthenticated === undefined && valid_urls.indexOf(request.url) == -1 && !request.url.startsWith("/css/" || "/assets/") ){
    reply.redirect("/login");
  }
  next();
});

fastify.get("/", async (request, reply) => {
  return reply.view("/src/pages/index.hbs", {});
});
// fastify.get("/map", async (request, reply) => {
//   const user = request.session.user;
//   const data = await db.runQuery1(`SELECT * FROM Users WHERE uid=${user.uid}`)
  
//   const User = {
//     username:data[0].username,
//     points:data[0].points
//   }
// return reply.view("/src/pages/map.hbs", { user: User });
// });
fastify.get("/game", async (request, reply) => {
  const user = request.session.user;
  const data = await db.runQuery1(`SELECT * FROM Users WHERE uid=${user.uid}`)  
  const User = {username:data[0].username,points:data[0].points}
  return reply.view("/src/page/game.hbs", { user: User });
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
  const password = utils.reverse(request.body.password);
  // console.log(username,password);
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
  let email = request.body.email;
  let username = request.body.username;
  const password = request.body.password;
  
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
    await db.runQuery2(`INSERT INTO Users (email,username,password,session_id,points,collected,lat,long) VALUES ('${email}','${username}','${password}',null,0, 0,null,null)`);
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
  // params.unlocked = await db.runQuery1(`SELECT Inventory.tree_name,Atreebutes.url FROM Inventory,Atreebutes WHERE Inventory.uid=${user.uid} AND Inventory.tree_name=Atreebutes.tree_name`)
  params.unlocked = await db.runQuery1(`SELECT Inventory.tree_name,A_TREE_butes.url FROM Inventory, A_TREE_butes WHERE Inventory.username='${user.username}' AND Inventory.tree_name=A_TREE_butes.tree_name`)
  params.locked = await db.runQuery1(`SELECT tree_name,url FROM A_TREE_butes WHERE tree_name NOT IN (SELECT tree_name FROM Inventory WHERE username='${user.username}')`);
  
  return request.query.raw
    ? reply.send(params)
    : reply.view("/src/pages/inventory.hbs", params );
});

fastify.get("/treedata", async (request, reply) => {
  const data = await db.runQuery1(`SELECT A_TREE_butes.tree_name,A_TREE_butes.scientific_name,A_TREE_butes.origin,A_TREE_butes.link,A_TREE_butes.properties,Trees.coords 
  FROM Trees,A_TREE_butes 
  WHERE Trees.tree_name LIKE A_TREE_butes.scientific_name OR Trees.tree_name LIKE A_TREE_butes.tree_name`);
  // console.log(data);
  
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

fastify.get("/db", async (request, reply) => {
  const table = request.query.table;
  
  const data = await db.runQuery1(`SELECT * FROM ${table}`);
  return reply.send(data)
});


fastify.get("/test", async (request, reply) => {
  return reply.view("/src/pages/test.hbs", { } );
});


fastify.get("/treedata2", async (request, reply) => {
  const data = await db.runQuery1("SELECT * FROM Trees");
  // console.log(data);
  
  return reply.send(data)
});




// fastify.get("/check", async (request, reply) => {
//   utils.send_email_text("nandhakumar2058@gmail.com","email subject", "email content stuff, hello!");
//   return reply.send("check");
// });

fastify.post("/checkinglocation", async (request, reply) => {
  
  // const entrance = {lat:10.901853212312897,lng: 76.89603899041079};
  const body = request.body;
  // console.log(body)
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
  
  // console.log(tree);
  
  const QuizArr = await db.runQuery1(`SELECT * FROM Quiz WHERE tree_name='${tree.tree_name}'`)
  
  // console.log(QuizArr)
  const index = Math.floor(Math.random() * QuizArr.length)
  const quiz = QuizArr[index]
  // console.log(quiz)
  
  const distance = utils.measureDistance(pos1.lat,pos1.lng, pos2.lat, pos2.lng);
  return reply.type("json").send({distance: distance, quiz_id: quiz.quiz_id , quiz: quiz.question , options: quiz.options });
});

fastify.post("/checkinganswer", async (request, reply) => {
  
    const userdata = request.session.user;
    const UserArr = await db.runQuery1(`SELECT username,points FROM Users WHERE uid=${userdata.uid}`);
    const user = UserArr[0];
  // const entrance = {lat:10.901853212312897,lng: 76.89603899041079};
  const body = request.body;
  const q = Number(body.q);
  const ans = body.ans.trim();
  console.log(q)
  console.log(ans)

  const QuizArr = await db.runQuery1(`SELECT * FROM Quiz WHERE quiz_id=${q}`)
  const quiz = QuizArr[0];
  
  let true_or_false = false;
  console.log(quiz);
  
  if( quiz.answer == ans ){
    true_or_false = true;
    const val = await db.runQuery1(`SELECT EXISTS(SELECT 1 FROM Inventory WHERE tree_name='${quiz.tree_name}');`)
    console.log(val);
    await db.runQuery2(`INSERT INTO Inventory (username, tree_name) VALUES ('${user.username}', '${quiz.tree_name}')`)
  }else{
    
  }
  
  return reply.type("json").send({"correct": true_or_false });
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
