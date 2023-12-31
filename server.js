const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyparser = require("body-parser");
const path = require("path");
const userRoutes = require("./routes/userAuth");
const cors = require("cors");

const connectDB = require("./database/connection");

const app = express();

dotenv.config({ path: ".env" });
const PORT = process.env.PORT || 8080;

app.use(cors())

// log requests
app.use(morgan("tiny"));

// mongodb connection
connectDB();

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(
	express.urlencoded({
		extended: true,
	})
);

//using user route
app.use(userRoutes);

// parse request to body-parser
app.use(bodyparser.urlencoded({ extended: true }));

// set view engine
app.set("view engine", "ejs");
//app.set("views", path.resolve(__dirname, "views/ejs"))

// load assets
app.use("/css", express.static(path.resolve(__dirname, "assets/css")));
app.use("/img", express.static(path.resolve(__dirname, "assets/img")));
app.use("/js", express.static(path.resolve(__dirname, "assets/js")));

// load routers
app.use("/", require("./routes/router"));

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
