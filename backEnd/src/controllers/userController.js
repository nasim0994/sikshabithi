const fs = require("fs");
const bcrypt = require("bcrypt");
const { createJsonWebToken } = require("../utils/jsonWebToken");
const User = require("../models/userModel");
const Profile = require("../models/profileModel");
const { emailSend, verifyEmailSend } = require("../utils/emailSend");
const jwt = require("jsonwebtoken");
const { pick } = require("../utils/pick");
const { calculatePagination } = require("../utils/calculatePagination");
const frontendURL = process.env.FRONTEND_URL;

// exports.registerUser = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     const user = await User.create({ email, password });

//     if (user?._id) {
//       let useId = user._id;

//       const profile = await Profile.create({ name, user: useId });

//       if (profile?._id) {
//         await User.findByIdAndUpdate(useId, { profile: profile._id });

//         res.status(200).json({
//           success: true,
//           message: "Register Success",
//         });
//       } else {
//         await User.findByIdAndDelete(useId);
//         res.status(400).json({
//           success: false,
//           message: "Profile creation failed, user deleted",
//         });
//       }
//     }
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       error: error.message,
//     });
//   }
// };

exports.getAll = async (req, res) => {
  const paginationOptions = pick(req?.query, ["page", "limit"]);
  const { page, limit, skip } = calculatePagination(paginationOptions);

  try {
    const result = await User.find({}, { password: 0 })
      .populate("profile", "name")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments({});
    const pages = Math.ceil(parseInt(total) / parseInt(limit));

    res.status(200).json({
      success: true,
      message: "User get success",
      meta: {
        total,
        pages,
        page,
        limit,
      },
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

exports.gettAllUsers = async (req, res) => {
  const paginationOptions = pick(req?.query, ["page", "limit"]);
  const { page, limit, skip } = calculatePagination(paginationOptions);
  const { search } = req?.query;

  try {
    let query = {};
    query.role = "user";

    if (search && search !== "undefined" && search !== null) {
      query.$or = [{ email: { $regex: search, $options: "i" } }];
    }

    const result = await User.find(query, { password: 0 })
      .populate({
        path: "package.package",
        model: "Package",
      })
      .populate({
        path: "profile",
        model: "Profile",
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);
    const pages = Math.ceil(parseInt(total) / parseInt(limit));

    res.status(200).json({
      success: true,
      message: "User get success",
      meta: {
        total,
        pages,
        page,
        limit,
      },
      data: result,
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.message,
    });
  }
};

exports.processRegister = async (req, res) => {
  try {
    const newUser = req.body;
    const isExisted = await User.exists({ email: newUser.email });

    if (isExisted) {
      return res.status(400).json({
        success: false,
        message: "User already exist. please login",
      });
    }

    const userMail = newUser.email;
    const userName = newUser.name;
    const token = createJsonWebToken(newUser, "10m");

    verifyEmailSend(userMail, token, userName);

    res.send({
      success:
        "Verification email sent to your email. Please check your inbox.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.registerUser = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(404).json({
        success: false,
        message: "Token not found",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "unable to verify user",
      });
    }

    let { name, email, password } = decoded;

    const isExisted = await User.exists({ email: decoded.email });
    if (isExisted) {
      return res.status(400).json({
        success: false,
        message: "User already exist. please login",
      });
    }

    const user = await User.create({ email, password });

    if (user?._id) {
      let useId = user._id;

      const profile = await Profile.create({ name, user: useId });

      if (profile?._id) {
        await User.findByIdAndUpdate(useId, { profile: profile._id });

        res.redirect(`${frontendURL}/login`);
      } else {
        await User.findByIdAndDelete(useId);
        res.status(400).json({
          success: false,
          message: "Profile creation failed, user deleted",
        });
      }
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 2. Load User
    const user = await User.findOne({ email: email }).populate("profile");

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "User not found",
      });
    }

    if (user.status === "ban") {
      return res.status(401).json({
        success: false,
        error: "Your account has been banned. Please contact admin",
      });
    }

    // 3. Match Password
    const isMatch = await bcrypt.compare(password, user?.password);

    if (!isMatch) {
      return res.status(404).json({
        success: false,
        error: "Email or password is incorrect",
      });
    }

    // 5. generate token
    let accessToken = "";
    if (user?.role === "admin") {
      accessToken = createJsonWebToken({ email, password }, "12h");
    } else {
      accessToken = createJsonWebToken({ email, password }, "7d");
    }

    res.status(200).json({
      success: true,
      message: "Login Success",
      token: accessToken,
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email })
      .populate({
        path: "package.package",
        model: "Package",
      })
      .populate({
        path: "profile",
        model: "Profile",
      });

    if (user) {
      res.status(200).json({
        success: true,
        data: user,
      });
    } else {
      res.status(404).json({
        success: false,
        error: "user not found",
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.send({ error: "User not found" });
    }

    const token = createJsonWebToken({ email }, "10m");

    // Send OTP via email
    emailSend(email, token);

    res.send({
      success: "OTP sent to your email. Please check your inbox.",
    });
  } catch (err) {
    res.send({
      error: `OTP SEND FAILED ${err.message}`,
    });
  }
};

exports.recoverPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: "unable to verify user",
    });
  }

  let { email } = decoded;

  const user = await User.findOne({ email });
  if (!user) {
    return res.send({ error: "User not found" });
  }

  user.password = newPassword;
  await user.save();

  res.send({ success: "Password reset successfully" });
};

// update downlaodhandnote
exports.downloadHandnote = async (req, res) => {
  const userId = req.user._id;
  console.log(userId);

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    user.downloadhandnotes += 1;
    await user.save();

    res.json({
      success: true,
      message: "Download handnote success",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.updateUserStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    user.status = user.status === "active" ? "ban" : "active";

    await user.save();

    res.json({
      success: true,
      message: "User status updated",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
