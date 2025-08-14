import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import ConnectionRequest from "../models/connections.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import cloudinary from "../config/cloudinary.js";
import axios from "axios";

const convertUserDataTOPDF = async (userData) => {
  return new Promise(async (resolve, reject) => {
    const doc = new PDFDocument();
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(chunks);
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: "resumes",
          public_id: `resume_${userData.userId.username}_${Date.now()}`,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );
      uploadStream.end(pdfBuffer);
    });

    let imageBuffer = null;
    if (userData.userId.profilePicture) {
      const response = await axios.get(userData.userId.profilePicture, {
        responseType: "arraybuffer",
      });
      imageBuffer = Buffer.from(response.data, "binary");
    }

    if (imageBuffer) {
      doc.image(imageBuffer, {
        align: "center",
        width: 100,
        height: 100,
      });
      doc.moveDown(1);
    } else {
      doc.text("No Profile Picture", { align: "center" });
      doc.moveDown(1);
    }

    doc
      .fillColor("#000")
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("Name:", { continued: true })
      .font("Helvetica")
      .text(` ${userData.userId.name}`);

    doc
      .font("Helvetica-Bold")
      .text("Username:", { continued: true })
      .font("Helvetica")
      .text(` ${userData.userId.username}`);

    doc
      .font("Helvetica-Bold")
      .text("Email:", { continued: true })
      .font("Helvetica")
      .text(` ${userData.userId.email}`);

    doc
      .font("Helvetica-Bold")
      .text("Bio:", { continued: true })
      .font("Helvetica")
      .text(` ${userData.bio}`);

    doc
      .font("Helvetica-Bold")
      .text("Current Position:", { continued: true })
      .font("Helvetica")
      .text(` ${userData.currentPost}`);

    doc.moveDown(1);

    doc
      .fontSize(14)
      .fillColor("#2563eb")
      .font("Helvetica-Bold")
      .text("Past Work:");

    userData.pastWork.forEach((work) => {
      doc.moveDown(0.5);
      doc
        .fillColor("#000")
        .font("Helvetica-Bold")
        .text("Company Name:", { continued: true })
        .font("Helvetica")
        .text(` ${work.company}`);
      doc
        .font("Helvetica-Bold")
        .text("Position:", { continued: true })
        .font("Helvetica")
        .text(` ${work.position}`);
      doc
        .font("Helvetica-Bold")
        .text("Years:", { continued: true })
        .font("Helvetica")
        .text(` ${work.years}`);
    });

    doc.end();
  });
};
export const register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    if (!name || !email || !password || !username) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      username,
    });

    await newUser.save();

    const profile = new Profile({ userId: newUser._id });
    await profile.save();

    return res
      .status(200)
      .json({ message: "Registration successfull ! Please Sign In." });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        message: `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } already exists`,
      });
    }

    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User does not exist" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid password" });

    const token = crypto.randomBytes(32).toString("hex");
    await User.updateOne({ _id: user._id }, { token });

    return res.status(200).json({
      message: "User logged in successfully",
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const uploadProfilePicture = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }
    user.profilePicture = req.file.path;

    await user.save();
    return res
      .status(200)
      .json({ message: "Profile picture uploaded successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { token, ...newUserData } = req.body;
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const { username, email } = newUserData;
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      if (existingUser || String(existingUser._id) !== String(user._id)) {
        return res
          .status(400)
          .json({ message: "Username or email already exists" });
      }
    }

    Object.assign(user, newUserData);
    await user.save();

    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUserAndProfile = async (req, res) => {
  try {
    const { token } = req.query;
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name email username profilePicture"
    );

    return res.status(200).json({ userProfile });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateProfileData = async (req, res) => {
  try {
    const { token, ...newProfileData } = req.body;
    const userProfile = await User.findOne({ token: token });

    if (!userProfile) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const profile_to_update = await Profile.findOne({
      userId: userProfile._id,
    });

    Object.assign(profile_to_update, newProfileData);
    await profile_to_update.save();

    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllUserProfile = async (req, res) => {
  try {
    const profiles = await Profile.find().populate(
      "userId",
      "name username email profilePicture"
    );

    return res.status(200).json({ profiles });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const downloadProfile = async (req, res) => {
  const user_id = req.query._id;
  try {
    const userProfile = await Profile.findOne({ userId: user_id }).populate(
      "userId",
      "name username email profilePicture"
    );

    const pdfUrl = await convertUserDataTOPDF(userProfile);
    return res.status(200).json({ message: pdfUrl });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const sendConnectionRequest = async (req, res) => {
  const { token, connectionId } = req.body;

  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const connectionUser = await User.findById(connectionId);
    if (!connectionUser) {
      return res.status(404).json({ message: "Connection user not found" });
    }

    const existingRequest = await ConnectionRequest.findOne({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "Connection request already sent" });
    }

    const request = new ConnectionRequest({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    await request.save();

    return res
      .status(200)
      .json({ message: "Connection request sent successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMyConnectionsRequests = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const connections = await ConnectionRequest.find({
      userId: user._id,
    }).populate("connectionId", "name username email profilePicture");

    return res.status(200).json({ connections });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const whatAreMyConnections = async (req, res) => {
  const { token } = req.query;
  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const connections = await ConnectionRequest.find({
      connectionId: user._id,
    }).populate("userId", "name username email profilePicture");

    return res.status(200).json({
      connections,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const acceptConnectionRequest = async (req, res) => {
  const { token, requestId, action_type } = req.body;

  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const connection = await ConnectionRequest.findOne({ _id: requestId });

    if (!connection) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    if (action_type === "accept") {
      connection.status_accepted = true;
    } else {
      connection.status_accepted = false;
    }

    await connection.save();

    return res.status(200).json({ message: "Connection request accepted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUserProfileAndUserBaseOnUsername = async (req, res) => {
  const { username } = req.query;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name username email profilePicture"
    );

    return res.status(200).json({ userProfile });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMyNetwork = async (req, res) => {
  const { token } = req.query;
  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const connections = await ConnectionRequest.find({
      $or: [
        { userId: user._id, status_accepted: true },
        { connectionId: user._id, status_accepted: true },
      ],
    })
      .populate("userId", "name username email profilePicture")
      .populate("connectionId", "name username email profilePicture");

    const network = connections.map((conn) => {
      return String(conn.userId._id) === String(user._id)
        ? conn.connectionId
        : conn.userId;
    });

    return res.status(200).json({ network });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const rejectConnectionRequest = async (req, res) => {
  const { token, requestId } = req.body;

  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const connection = await ConnectionRequest.findOneAndDelete({
      _id: requestId,
      connectionId: user._id,
    });

    if (!connection) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    return res.status(200).json({ message: "Connection request rejected" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const disconnectConnection = async (req, res) => {
  const { token, connectionId } = req.body;

  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const connection = await ConnectionRequest.findOneAndDelete({
      $or: [
        { userId: user._id, connectionId: connectionId, status_accepted: true },
        { userId: connectionId, connectionId: user._id, status_accepted: true },
      ],
    });

    if (!connection) {
      return res
        .status(404)
        .json({ message: "Connection not found or already disconnected" });
    }

    return res.status(200).json({ message: "Disconnected successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
