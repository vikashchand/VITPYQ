// const mongoose = require('mongoose');

// mongoose.connect(process.env.MONGODB_URI ,{ 
//   dbName: "MISPYQ",
  
//   useNewUrlParser: true, useUnifiedTopology: true });

// const dbCon = mongoose.connection;
// dbCon.on("error", console.error.bind(console, "connection error: "));
// dbCon.once("open", function () {
//   console.log("Connected successfully");
// });





const mongoose = require('mongoose');

// Set the poolSize to control the number of connections in the pool
 // You can adjust this based on your needs

mongoose.connect(process.env.MONGODB_URI, {
  dbName: "MISPYQ",
  maxPoolSize:50,
  wtimeoutMS:2500,
  useNewUrlParser:true, // Correct option name
});

const dbCon = mongoose.connection;
dbCon.on("error", console.error.bind(console, "connection error: "));
dbCon.once("open", function () {
  console.log("Connected successfully");
});

// Optionally, you can handle events like disconnects and reconnects
dbCon.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

dbCon.on("reconnected", () => {
  console.log("MongoDB reconnected");
});

// If your application is running in a production environment,
// you may also want to handle SIGINT and SIGTERM signals to gracefully close the connection pool
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await mongoose.connection.close();
  process.exit(0);
});
