const mongoose = require("mongoose");

//mongoose
//.connect(
//"mongodb+srv://fontalvomejiajosedavid54:dtA9aiNDKmhytlOL@api-node-rentify.omp8p.mongodb.net/"
//)

mongoose
  .connect("mongodb://0.0.0.0:27017/api-reservas")

  .then(() => console.log("🌟 Database is Connected"))
  .catch((err) => console.error("❌ Error connecting to the database:", err));
