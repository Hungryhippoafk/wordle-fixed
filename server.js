const express = require("express");
const path = require("path");
const db = require("./db");
const apiRoutes = require("./routes/api");
const pageRoutes = require("./routes/pages");

const app = express();
const PORT = 5080;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", apiRoutes);
app.use("/", pageRoutes);

app.listen(PORT, () => {
  console.log("Server kör på http://localhost:" + PORT);
});
