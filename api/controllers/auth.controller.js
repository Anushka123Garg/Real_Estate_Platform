import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body; //extracting user data
  const hashedPassword = bcrypt.hashSync(password, 10); //salt no.
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json("User created successfully");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password, recaptchaToken  } = req.body;
  try {
    const validUser = await User.findOne({ email }); //checking email
    if (!validUser) return next(errorHandler(404, "User not found!"));

    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credentials!"));

    //creating token (authentication)
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' }); //id, secret key
    const { password: pass, ...rest } = validUser._doc; //we don't to see password so destructuring it
    res
      .cookie("access_token", token, { httpOnly: true }) //save token as a cookie
      .status(200)
      .json(rest); // return all things except password
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      //sign in the user
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest); //send back the user data
    } else {
      //create the new user
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8); //16 char password
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10); //salt no.
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest); //send back the user data
    }
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return next(errorHandler(404, "User not found!"));

    const secret = process.env.JWT_SECRET + user.password;
    const token = jwt.sign({ email: user.email, id: user._id }, secret, {
      expiresIn: "5m",
    });
    const link = `http://localhost:5173/reset-password/${user._id}/${token}`;

    console.log("Generated reset link:", link);
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  const { id, token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return next(errorHandler(404, "User not found!"));

    const secret = process.env.JWT_SECRET + user.password;

    jwt.verify(token, secret, async (err) => {
      if (err) return next(errorHandler(400, "Invalid or expired token!"));

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      user.password = hashedPassword;
      await user.save();

      res
        .status(200)
        .json({ success: true, message: "Password reset successful." });
    });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been logged out");
  } catch (error) {
    console.error("Error in resetPassword:", error);
    next(error);
  }
};
