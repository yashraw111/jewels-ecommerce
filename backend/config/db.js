const { default: mongoose } = require("mongoose");

exports.main = () => {
  mongoose
    .connect(process.env.DB_URL, { dbName: "blogmernwebsite" })
    .then(() => {
      console.log("Database connected..");
    })
    .catch((err) => console.log(err));

};
