const categoryModel = require("../models/categoryModel");
const transactionModel = require("../models/transactionModel");

const categoryController = {
  //! add
  create: async (req, res) => {
    try {
      //! category has a user, name(uncategorized) and type([income,expense])
      //! Destructure name and type from request body
      const { name, type } = req.body;
      //! Vaildate if both name and type are present or not
      if (!name || !type) {
        return res
          .status(400)
          .json({ status: false, message: "Both name and type are required" });
      }

      const normailizedName = name.toLowerCase();
      console.log("Normalized name", normailizedName);

      const validTypes = ["income", "expense"];
      if (!validTypes.includes(type.toLowerCase())) {
        return res
          .status(400)
          .json({ status: false, message: "Invalid category type", type });
      }

      //! Check if category already exists on the user
      const categoryExists = await categoryModel.findOne({
        name: normailizedName,
        user: req.userId,
      });
      if (categoryExists) {
        return res.status(400).json({
          status: false,
          message: `Category ${categoryExists.name} already exists in the database`,
        });
      }

      //! create category
      const createCategory = await categoryModel.create({
        user: req.userId,
        name: normailizedName,
        type: type.toLowerCase(),
      });

      console.log("Category created", createCategory);
      return res.status(201).json(createCategory);
    } catch (error) {
      return res.status(500).json({ status: false, message: error.message });
    }
  },
  //! Lists
  lists: async (req, res) => {
    try {
      //! get the list of categories for a user
      const categoryList = await categoryModel.find({ user: req.userId });
      console.log(categoryList);
      return res.status(200).json(categoryList);
    } catch (error) {
      return res.status(500).json({ status: false, message: error.message });
    }
  },
  //! Update Category
  update: async (req, res) => {
    try {
      const { name, type } = req.body;
      const category = await categoryModel.findById(req.params.id);
      console.log(category);

      if (category && category.user.toString() === req.userId.toString()) {
        const oldName = category.name;
        category.name = name || category.name;
        category.type = type || category.type;
        const updatedCategory = await category.save();
        //! Update affected transaction
        if (oldName !== updatedCategory.name) {
          await transactionModel.updateMany(
            {
              user: req.userId,
              category: oldName,
            },
            {
              $set: {
                category: updatedCategory.name,
                type: updatedCategory.type,
              },
            }
          );
        }
        return res.status(200).json(updatedCategory);
      } else {
        return res.status(400).json({
          status: false,
          message: "Category not found or user not authorized",
        });
      }
    } catch (error) {
      return res.status(500).json({ status: false, message: error.message });
    }
  },

  //! delete category
  delete : async (req,res) => {
    try{
        const category = await categoryModel.findById(req.params.id);
        console.log(category);

        if(category && category.user.toString() === req.userId.toString()){
            console.log("category is obviously present along with user is authorized")
            await categoryModel.findByIdAndDelete(req.params.id);
            //! After deleting the category change the category name in transaction to Uncategorized
            await transactionModel.updateMany({
                user:req.userId,
                category:category.name
            },
        {
            $set : {category: "Uncategorized"}
        })
        return res.status(200).json({message:"Category deleted successfully"});
        }
        else{
            return res.status(400).json({message:"Category not found or user not authorized"})
        }
        return res.status(200).json({message:"API delete"})
    }
    catch(error){
        return res.status(500).send({status:false,message:error.message});
    }
  }
};

module.exports = categoryController;
