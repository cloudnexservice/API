const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

const PORT = process.env.PORT || 8080;

app.get("/user", (req, res) => {
  res.status(200).send({ op: "Success" });
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
