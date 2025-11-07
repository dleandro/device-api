import express from "express";

export const app = express();

app.get("/devices", (req, res) => {
  res.json([]).status(200);
});
