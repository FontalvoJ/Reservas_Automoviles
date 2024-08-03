const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://fontalvomejiajosedavid54:CuVMgbpBmrBux2tW@api-node-aerofuel.uhm8jda.mongodb.net/?retryWrites=true&w=majority&appName=api-node-aerofuel"
  )
  .then(() => console.log("🌟 Database is Connected"))
  .catch((err) => console.error("❌ Error connecting to the database:", err));
