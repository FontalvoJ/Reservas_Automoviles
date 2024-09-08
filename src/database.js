const mongoose = require("mongoose");

mongoosev
  .connect(
    "mongodb+srv://fontalvomejiajosedavid54:CuVMgbpBmrBux2tW@api-node-aerofuel.uhm8jda.mongodb.net/?retryWrites=true&w=majority&appName=api-node-aerofuel"
  )

  //mongoose.connect("mongodb://0.0.0.0:27017/api-registro_vales")

  .then(() => console.log("🌟 Database is Connected"))
  .catch((err) => console.error("❌ Error connecting to the database:", err));
