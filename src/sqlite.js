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
        
        const rawUsers = fs.readFileSync("./__users.json");
        const rawtrees = fs.readFileSync("./__trees.json");
        const rawtreeProps = fs.readFileSync("./__treeProps.json");
        
        const users = JSON.parse(rawUsers);
        const trees = JSON.parse(rawtrees);
        const treeProps = JSON.parse(rawtreeProps);
        
        // treeProps.forEach(item => {db.run(`INSERT INTO tbl (id,stuff) VALUES (${item.id}, '${item.text}')`)})
        
        
        await db.run("CREATE TABLE Users (uid INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, verfied INTEGER, username TEXT, password TEXT, session_id TEXT, points INTEGER, collected INTEGER, lat REAL, lng REAL)");
        await db.run("CREATE TABLE A_TREE_butes (tree_name TEXT PRIMARY KEY, value_points INTEGER, url TEXT)");
        await db.run("CREATE TABLE Trees (lid INTEGER PRIMARY KEY AUTOINCREMENT, tree_name TEXT, lat REAL, long REAL, radius INTEGER)")
        
        await db.run("CREATE TABLE Inventory (uid INTEGER, tree_name)");
        
        // A-tree-Butes lol xD
                     
        
        
        
      } else {
        console.log("db exists!")
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
