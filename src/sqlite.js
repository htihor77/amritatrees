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
        
await db.run("CREATE TABLE Users (uid INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, username TEXT, password TEXT, session_id TEXT, points INTEGER, collected INTEGER, lat REAL, long REAL)");
await db.run("INSERT INTO Users (email,username,password,session_id,points,collected,lat,long) VALUES ('nandhakumar2058@gmail.com','Nandhu','pass1',null,400, 2,null,null)");
await db.run("INSERT INTO Users (email,username,password,session_id,points,collected,lat,long) VALUES ('rishikunnath2002@gmail.com','Rishi','pass1',null,300, 3,null,null)");
await db.run("INSERT INTO Users (email,username,password,session_id,points,collected,lat,long) VALUES ('shriramarvinth3012@gmail.com','Shriram','pass1',null,200, 1,null,null)");
await db.run("INSERT INTO Users (email,username,password,session_id,points,collected,lat,long) VALUES ('rohithhtihor786@gmail.com','Rohith','pass1',null,100, 3,null,null)");
        
        await db.run("CREATE TABLE Inventory (uid INTEGER, tid INTEGER)");
        await db.run("INSERT INTO INVENTORY (uid,tid) VALUES (1,1), (1,2), (1,3)")
        
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
