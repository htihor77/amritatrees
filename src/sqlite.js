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
        await db.run("INSERT INTO aTREEbutes (tree_name,value_points,url) VALUES ('oak tree', 50, 'https://cdn.britannica.com/92/142292-004-459092B7.jpg')");
        await db.run("INSERT INTO aTREEbutes (tree_name,value_points,url) VALUES ('neem tree', 50, 'https://5.imimg.com/data5/SELLER/Default/2021/5/RU/EL/LQ/76591799/neem-tree-500x500.jpg')");
        await db.run("INSERT INTO aTREEbutes (tree_name,value_points,url) VALUES ('pine tree', 50, 'https://www.thetreecenter.com/c/uploads/2022/02/Slash_Pine_Tree_1-copy.jpg')");
        await db.run("INSERT INTO aTREEbutes (tree_name,value_points,url) VALUES ('mango tree', 50, 'https://thumbs.dreamstime.com/b/mango-tree-isolate-white-background-mango-tree-isolate-white-108298705.jpg')");
        await db.run("INSERT INTO aTREEbutes (tree_name,value_points,url) VALUES ('paradise tree', 100, 'https://1.bp.blogspot.com/-Xyjj17t6RbE/Tj_MlveMSCI/AAAAAAAAA6E/k2AqRAOpX-o/s1600/L1000264.JPG')");
                     
        //actually found trees in campus
        // await db.run("INSERT INTO aTREEbutes (tree_name,value_points,url) VALUES ('',50,'')");
        await db.run("INSERT INTO aTREEbutes (tree_name,value_points,url) VALUES ('banyan tree',50,'https://cdn.discordapp.com/attachments/1014472011403239484/1014472226621378662/unknown.png')")
        await db.run("INSERT INTO aTREEbutes (tree_name,value_points,url) VALUES ('ficus elastica',50,'https://cdn.discordapp.com/attachments/1014472011403239484/1014501942363430952/unknown.png')");
        await db.run("INSERT INTO aTREEbutes (tree_name,value_points,url) VALUES ('weeping fig',50,'')");
        // await db.run("INSERT INTO aTREEbutes (tree_name,value_points,url) VALUES ('',50,'')");
        // await db.run("INSERT INTO aTREEbutes (tree_name,value_points,url) VALUES ('',50,'')");
      
        
        
        await db.run("CREATE TABLE Trees (lid INTEGER PRIMARY KEY AUTOINCREMENT, tree_name TEXT, lat REAL, long REAL, radius INTEGER)")
        await db.run("INSERT INTO Trees (lid,tree_name,lat,long,radius) VALUES ('banyan tree',10.899701, 76.903252, 1)")
        await db.run("INSERT INTO Trees (lid,tree_name,lat,long,radius) VALUES ('banyan tree',10.899701, 76.903252, 1)")
        
        
        await db.run("CREATE TABLE Inventory (uid INTEGER, tree_name)");
        await db.run("INSERT INTO INVENTORY (uid,tree_name) VALUES (1,'oak tree'), (1,'neem tree'), (1,'pine tree')");
        
        
        
        
        
        
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
