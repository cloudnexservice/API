const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "https://delightful-fulfillment-production.up.railway.app"
}));

const PORT = process.env.PORT || 8080;

app.get("/user", (req, res) => {
  res.status(200).send({ op: "Success" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
});
