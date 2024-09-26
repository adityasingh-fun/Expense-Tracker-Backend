const transactionModel = require("../models/transactionModel");

const transactionController = {
  //! add transaction
  create: async (req, res) => {
    try {
      const { type, category, amount, date, description } = req.body;
      console.log(req.body);
      if (!type || !date || !amount) {
        return res
          .status(400)
          .json({ message: "Type, amount and date are required" });
      }
      //! create transaction
      const transaction = await transactionModel.create({
        user: req.userId,
        type: type.toLowerCase(),
        category: category.toLowerCase(),
        amount,
        description,
      });

      console.log("Transaction", transaction);
      return res.status(201).json(transaction);
    } catch (error) {
      return res.status(500).json({ status: false, message: error.message });
    }
  },
  //! List all tranactions of a user
  lists: async (req, res) => {
    try {
      //! Destructure data from query params
      const { startDate, endDate, type, category } = req.query;

      //! Create a filter
      const filter = { user: req.userId };

      //! check if start date is present or not
      if (startDate) {
        filter.date = { ...filter.date, $gte: new Date(startDate) };
      }
      if (endDate) {
        filter.date = { ...filter.date, $lte: new Date(endDate) };
      }
      if (type) {
        filter.type = type;
      }

      if (category) {
        if (category === "All") {
          //! No category filter needed when filtering all
        } else if (category === "Uncategorized") {
          filter.category = "Uncategorized";
        } else {
          filter.category = category;
        }
      }

      console.log("Filtered Data", filter);

      //! Get list of all the transactions of a user
      const transactionList = await transactionModel
        .find(filter)
        .sort({ date: -1 });
      return res.status(200).json(transactionList);
    } catch (error) {
      return res.status(500).json({ status: false, message: error.message });
    }
  },
  //! Update transaction
  update: async (req, res) => {
    try {
      //! Find transaction
      const transaction = await transactionModel.findById(req.params.id);
      console.log("Transaction", transaction);

      if (
        transaction &&
        transaction.user.toString() === req.userId.toString()
      ) {
        transaction.type = req.body.type || transaction.type;
        transaction.category = req.body.category || transaction.category;
        transaction.amount = req.body.amount || transaction.amount;
        transaction.description =
          req.body.description || transaction.description;
        transaction.date = req.body.date || transaction.date;
      }

      const updatedTransaction = await transaction.save();
      console.log(updatedTransaction);

      return res.status(200).json(updatedTransaction);
    } catch (error) {
      return res.status(500).json({ status: false, message: error.message });
    }
  },
  //! delete
  delete : async (req,res) => {
    try{
        //! Find transaction
        const transaction = await transactionModel.findById(req.params.id);
        console.log(transaction);
        if(transaction && transaction.user.toString() === req.userId.toString()){
            console.log("Truthy value");
            await transactionModel.findByIdAndDelete(req.params.id);
        }
        return res.status(200).json({message:"Transaction deleted successfully"});
    }
    catch(error){
        return res.status(500).json({status:false,message:error.message});
    }
  }
};

module.exports = transactionController;
