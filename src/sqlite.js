const fs = require("fs");

// Initialize the database
const dbFile = "./.data/amritatrees.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const dbWrapper = require("sqlite");
let db;

dbWrapper
  .open({
    filename: dbFile,
    driver: sqlite3.Database
  })
  .then(async dBase => {
    db = dBase;
    try {
      if (!exists) {
        console.log("db DOES NOT EXIST!");
        
        const rawUsers = fs.readFileSync("./___users.json");
        const rawtrees = fs.readFileSync("./___trees.json");
        const rawtreeProps = fs.readFileSync("./___treeProps.json");
        const rawQuiz = fs.readFileSync("./___quiz.json");
        const rawInventory = fs.readFileSync("./___inventory.json");
        
        const users = JSON.parse(rawUsers);
        const trees = JSON.parse(rawtrees);
        const treeProps = JSON.parse(rawtreeProps);
        const quiz = JSON.parse(rawQuiz);
        const inventory = JSON.parse(rawInventory);
        
    
        await db.run("CREATE TABLE Users (uid INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, verified INTEGER, username TEXT, password TEXT, session_id TEXT, points INTEGER, collected INTEGER, lat REAL, lng REAL)");
        await db.run("CREATE TABLE Trees (lid INTEGER PRIMARY KEY AUTOINCREMENT, scientific_name TEXT, coords TEXT)")
        await db.run("CREATE TABLE A_TREE_butes (tree_name TEXT PRIMARY KEY, scientific_name TEXT UNIQUE, origin INTEGER, link TEXT, properties TEXT, points INTEGER DEFAULT 10, url TEXT DEFAULT 'https://cdn.discordapp.com/attachments/1027927070191403189/1039165618617860146/betterTree.png')");
        await db.run("CREATE TABLE Quiz(quiz_id INTEGER PRIMARY KEY, scientific_name TEXT, question TEXT, options TEXT, answer TEXT)");
        await db.run("CREATE TABLE Inventory(username TEXT, scientific_name TEXT)");
        
        
        users.forEach(item => {db.run(`INSERT INTO Users (email,verified,username,password,session_id,points,collected,lat,lng) VALUES ('${item.email}', ${item.verified}, '${item.username}', '${item.password}','${item.session_id}',${item.points},${item.collected},${item.lat},${item.lng})`)});
        trees.forEach(item => {db.run(`INSERT INTO Trees (scientific_name,coords) VALUES ('${item.scientific_name}', '${item.coords}')`)});
        treeProps.forEach(item => {db.run(`INSERT INTO A_TREE_butes (tree_name,scientific_name,origin,link,properties) VALUES ('${item.name}', '${item.scientific_name}', '${item.origin}', '${item.wikipedia_link}', '${item.properties}')`)});
        quiz.forEach(item => {db.run(`INSERT INTO Quiz (quiz_id,scientific_name,question,options,answer) VALUES (${item.quiz_id},'${item.scientific_name}', '${item.question}', '${item.options}', '${item.answer}')`)});
        inventory.forEach(item => {db.run(`INSERT INTO Inventory (username,scientific_name) VALUES ('${item.username}','${item.scientific_name}')`)});
        
      } else {
        console.log("db exists!");
        
        // console.log(await db.all("SELECT * FROM Users"));
        // console.log(await db.all("SELECT * FROM Trees"));
        // console.log(await db.all("SELECT * FROM A_TREE_butes"));
        // console.log(await db.all("SELECT * FROM Quiz"));
        
      }
    } catch (dbError) {
      console.error(dbError);
    }
  });

// Our server script will call these methods to connect to the db
module.exports = {
  runQuery1: async (q) => {
    try {
      return await db.all(q);
    } catch (dbError) {
      console.error(dbError);
    }
  },  
  runQuery2: async (q) => {
    try {
      return await db.run(q);
    } catch (dbError) {
      console.error(dbError);
    }
  },
};
