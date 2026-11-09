import "dotenv/config";
import app from "./app.js";
import { connectDatabase } from "./config/db.js";

const port = Number(process.env.PORT || 5000);

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is required.");
}

try {
  await connectDatabase();
  app.listen(port, () => {
    console.log(`Cozy Garden API listening on port ${port}`);
  });
} catch (error) {
  console.error("Unable to start Cozy Garden API:", error.message);
  process.exit(1);
}
