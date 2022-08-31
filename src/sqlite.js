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
        
await db.run("CREATE TABLE Users (uid INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, emailverfied INTEGER, username TEXT, password TEXT, session_id TEXT, points INTEGER, collected INTEGER, lat REAL, long REAL)");
// await db.run("INSERT INTO Users (email,username,password,session_id,points,collected,lat,long) VALUES ('nandhakumar2058@gmail.com','Nandhu','pass1',null,400, 2,null,null)");
// await db.run("INSERT INTO Users (email,username,password,session_id,points,collected,lat,long) VALUES ('rishikunnath2002@gmail.com','Rishi','pass1',null,300, 3,null,null)");
// await db.run("INSERT INTO Users (email,username,password,session_id,points,collected,lat,long) VALUES ('shriramarvinth3012@gmail.com','Shriram','pass1',null,200, 1,null,null)");
// await db.run("INSERT INTO Users (email,username,password,session_id,points,collected,lat,long) VALUES ('rohithhtihor786@gmail.com','Rohith','pass1',null,100, 3,null,null)");
        
        // A-tree-Butes lol xD
        await db.run("CREATE TABLE aTREEbutes (tree_name TEXT PRIMARY KEY, value_points INTEGER, url TEXT)");
        await db.run("INSERT INTO aTREEbutes (tree_name,value_points,url) VALUES ('oak tree', 50, 'https://cdn.britannica.com/92/142292-004-459092B7.jpg'), ('neem tree', 50, 'https://5.imimg.com/data5/SELLER/Default/2021/5/RU/EL/LQ/76591799/neem-tree-500x500.jpg'), ('pine tree', 50, 'https://www.thetreecenter.com/c/uploads/2022/02/Slash_Pine_Tree_1-copy.jpg'), ('mango tree', 50, 'https://thumbs.dreamstime.com/b/mango-tree-isolate-white-background-mango-tree-isolate-white-108298705.jpg'), ('paradise tree', 100, 'https://1.bp.blogspot.com/-Xyjj17t6RbE/Tj_MlveMSCI/AAAAAAAAA6E/k2AqRAOpX-o/s1600/L1000264.JPG')");
        
        //actually found trees in campus
        await db.run("INSERT INTO aTREEbutes (tree_name,value_points,url) VALUES ('banyan tree',50,'https://cdn.discordapp.com/attachments/1014472011403239484/1014472226621378662/unknown.png')")
        
        // await db.run("")
        
        
        await db.run("CREATE TABLE Inventory (uid INTEGER, tree_name)");
        await db.run("INSERT INTO INVENTORY (uid,tree_name) VALUES (1,'oak tree'), (1,'neem tree'), (1,'pine tree')");
        
        
        await db.run("CREATE TABLE locations (lid INTEGER PRIMARY KEY AUTOINCREMENT, lat REAL, long REAL, description TEXT)")
        
        
        
        
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
