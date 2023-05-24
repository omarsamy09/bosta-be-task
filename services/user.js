const User = require("../models/user");
const { v4: uuidv4 } = require("uuid");
const { sendVerificationEmail } = require("../util/email");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signUp = async (req, res) => {
  try {
    // Check if the user is already registered
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });

    if (existingUser) {
       return res.status(409).json({
        message:
          "User with this email or username already exists try using different one",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = uuidv4();
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      verificationToken: verificationToken,
    });

    const verificationLink = `http:localhost:8080/users/verify/${verificationToken}`;
    sendVerificationEmail(newUser.email, verificationLink);

    res.status(201).json({
      message:
        "Account was created, but you need to verify it in order to login. We have sent you an email with the steps required to verify, please verify and login.",
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const verify = async (req, res) => {
  const verificationToken = req.params.token;
  const user = await User.findOne({ verificationToken: verificationToken });
  if (!user) {
    throw new Error("Invalid verification token");
  }
  if (user.isVerified) {
    throw new Error("User was already verified");
  }
  user.isVerified = true;
  await user.save();
  res.status(200).json("user verified");
};

const logIn = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Authentication failed. Invalid credentials." });
    }
    if (!user.isVerified) {
      return res.status(401).json({
        message:
          "Account is not verified, we have sent you a verification email try verifying and login again",
      });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "Authentication failed. Invalid credentials." });
    }

    const token = jwt.sign({ userId: user.id }, "verryyyysecretkey", {
      expiresIn: "12h",
    });

    res.status(200).json({ token });
  } catch (error) {}
};

module.exports = {
  signUp,
  verify,
  logIn,
};
