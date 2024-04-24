import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.all("*", (req, res, next) => {
  throw new AppError("Can't find this route", 400);
});

app.use((error, req, res, next) => {
  const { status, message, stack } = error;
  res.status(status || 500).json({
    message,
    stack,
  });
});

app.listen(process.env.PORT, () => console.log(`Server running on port!`));
