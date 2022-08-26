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
        await db.run("CREATE TABLE Users (uid INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, user_id TEXT, password TEXT, session_id TEXT, points INTEGER, collected INTEGER, lat REAL, long REAL)");
        await db.run("INSERT INTO Users (email,username,password,session_id) VALUES ('nandhakumar2058@gmail.com','Nandhu','pass1',,400, 2, , )");
        await db.run("INSERT INTO Users (email,username,password,session_id) VALUES ('rishikunnath2002@gmail.com','Rishi','pass1',,300, 3, , )");
        await db.run("INSERT INTO Users (email,username,password,session_id) VALUES ('shriramarvinth3012@gmail.com','Shriram','pass1',,200, 1, , )");
        await db.run("INSERT INTO Users (email,username,password,session_id) VALUES ('rohithhtihor786@gmail.com','Rohith','pass1',,100, 3, , )");
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
