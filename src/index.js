import app from "./app.js";
import './database';

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🎧 Server listening on port ${PORT} 🌟`);
});
