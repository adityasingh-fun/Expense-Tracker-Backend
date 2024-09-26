const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

const userController = {
  //! Register
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      //! Validate
      if (!username || !email || !password) {
        return res
          .status(409)
          .send({ status: false, message: "All fields are required" });
      }

      //! Check if user already exists
      const userExists = await userModel.findOne({ email });
      if (userExists) {
        return res
          .status(409)
          .json({ status: false, message: "User already exists" });
      }

      //! Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const createUser = await userModel.create({
        email,
        username,
        password: hashedPassword,
      });

      return res.json({
        username,
        email,
        id: createUser._id,
      });
    } catch (error) {
      return res.status(500).json({ status: false, message: error.message });
    }
  },
  //! Login
  login: async (req, res) => {
    try {
      //! Destructure email and password
      const { email, password } = req.body;
      console.log("Email", email, "password", password);

      //! Check if email is valid or not
      const user = await userModel.findOne({ email });
      console.log(user);
      if (!user) {
        return res
          .status(400)
          .json({ status: false, message: "Invalid login credentials" });
      }

      //! Compare the user password
      const comparePassword = await bcrypt.compare(password, user.password);
      console.log(comparePassword);
      if (!comparePassword) {
        return res
          .status(400)
          .json({ status: false, message: "Invalid login credentials" });
      }

      //! Generate token
      const token = jwt.sign(
        {
          name: "Aditya Singh",
          id: user._id,
        },
        "Secret Key"
      );

      console.log("Token", token);

      return res.status(200).json({
        message: "Login success",
        token,
        username: user.username,
        email: user.email,
      });
    } catch (error) {
      return res.status(500).json({ status: false, message: error.message });
    }
  },
  //! Profile
  profile: async (req, res) => {
    try {
      const user = await userModel.findById(req.userId);
      console.log(user);
      if (!user) {
        return res
          .status(404)
          .json({ status: false, message: "User not found" });
      }
      return res
        .status(200)
        .json({ username: user.username, email: user.email });
    } catch (error) {
      console.log(error.message);
    }
  },

  //! Change Password
  changePassword: async (req, res) => {
    try {
      //! Destructure newPassword form request body
      const { newPassword } = req.body;
      console.log("New password", newPassword);

      //!Find the user
      const user = await userModel.findById(req.userId);
      if (!user) {
        return res.status(404).json({ status: false, message: error.message });
      }
      console.log(user);

      //! Hash the password before saving
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      //! Setting new password
      user.password = hashedPassword;

      console.log("New user is", user);

      //! Save the document
      await user.save();

      return res
        .status(201)
        .json({ message: "API running successfully", user });
    } catch (error) {
      return res.status(500).json({ status: false, message: error.message });
    }
  },

  //! Update Profile
  updateProfile: async (req, res) => {
    try {
        //! Destructure email and username form request body
        const {email,username} = req.body;

        //! Find the user
        const user = await userModel.findById(req.userId);
        if(!user){
            return res.status(404).json({status:false,message:"User not found"});
        }

        //! Update the user
        const updatedUser = await userModel.findByIdAndUpdate(req.userId,{
            username,
            email
        },{new:true});

        return res.status(200).json({status:true,message:"User profile updated successfully",updatedUser});
    } catch (error) {
      return res.status({ status: false, message: error.message });
    }
  },
};

module.exports = userController;
