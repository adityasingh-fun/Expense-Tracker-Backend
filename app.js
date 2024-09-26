const express = require("express");
const userRouter = require("./routes/userRouter");
const mongoose = require("mongoose");
const cors = require("cors");
const categoryRouter = require("./routes/categoryRouter");
const transactionRouter = require("./routes/transactionRouter");

const app = express();

mongoose
  .connect(
    "mongodb+srv://chaudharyaditya41:KmmFJdFigMuBADii@mernexpensetracker-clus.nkzk1.mongodb.net/"
  )
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => console.log(error.message));

const corsOption = {
  origin: ["https://expense-tracker-frontend-gilt.vercel.app"],
  methods:["POST","GET","PUT","DELETE"],
  credentials: true
};
app.use(cors(corsOption));

app.use(express.json());

app.use("/", userRouter);
app.use("/", categoryRouter);
app.use("/", transactionRouter);

const PORT = 3000;

app.listen(PORT, () => {
  console.log("Server App running on PORT", PORT);
});
