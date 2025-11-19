import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateToken, generateRefreshToken } from "../../utils/token.js";
import dotenv from "dotenv"; // here we import that
dotenv.config(); // here we call the config method to acess the .env file
import { Op } from "sequelize";

const SECRET_KEY = process.env.JWT_SECRET; /// this file take the value form the .env file to acess the dotenv file frist u need to import the dot env package and call the config 
// for now you dont focus on.env i will create that later means you need to use like this
// const SECRET_KEY = process.env.JWT_SECRET || 'your_fallback_secret';// use like this if dont enc dont have the value it take the second value 

const userService = {
  //  Create new user
  async createUser({ username, email, password, phone, role, created_by }) {
    const exists = await User.findOne({ where: { email } });
    if (exists) throw new Error("Email already exists");

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashed,
      phone,
      role,
      created_by,
    });
    return user;
  },

  //  Get all active users
  async getUsers({
    page = 1,
    limit = 10,
    orderBy = "desc",
    is_active,
    includeInactive = false,
    startDate = null,
    endDate = null,
  }) {
    const where = {};

    // Date range filter
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        const nextDay = new Date(endDate);
        nextDay.setDate(nextDay.getDate() + 1);
        where.createdAt[Op.lt] = nextDay;
      }
    }

    // Active / inactive filter
    if (typeof is_active === "boolean") {
      where.is_active = is_active;
    } else if (!includeInactive) {
      where.is_active = true;
    }

    const offset = (page - 1) * limit;

    const { rows: users, count: total } = await User.findAndCountAll({
      where,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: [["createdAt", orderBy.toLowerCase() === "asc" ? "ASC" : "DESC"]],
      attributes: [
        "id",
        "username",
        "email",
        "phone",
        "is_active",
        "createdAt",
      ],
    });

    const totalPages = Math.ceil(total / limit);
    return { total, totalPages, currentPage: page, users };
  },

  //  Get user by ID
  async getUserById(id) {
    const user = await User.findByPk(id);
    if (!user) throw new Error("User not found");
    return user;
  },

  // Get current user (by token payload)
  async getMe(id) {
    const user = await User.findByPk(id, {
      attributes: [
        "id",
        "username",
        "email",
        "phone",
        "role",
        "is_active",
        "createdAt"
      ],
    });
    if (!user) throw new Error("User not found");
    return user;
  },

  // Login user (email or phone)
  async loginUser({ identifier, password }) {
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: identifier }, { phone: identifier }],
      },
    });

    if (!user) throw new Error("Invalid email/phone or password");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid email/phone or password");

    if (!user.is_active)
      throw new Error("Your account is inactive. Please contact Admin.");

    const accessToken = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      is_active: user.is_active,
    });

    const refreshToken = generateRefreshToken({ id: user.id });

    await user.update({ token: accessToken, refresh_token: refreshToken });

    return {
      user,
      accessToken,
      refreshToken,
    };
  },

  // Update user by ID
  async updateUserById(id, updateData, updated_by) {
    const user = await User.findByPk(id);
    if (!user) throw new Error("User not found");
    await user.update({ ...updateData, updated_by });
    return user;
  },

  // Soft delete user
  async softDeleteUser(id, deleted_by) {
    const user = await User.findByPk(id);
    if (!user) throw new Error("User not found");
    await user.update({ is_active: false, deleted_by });
    return user;
  },

  // Restore user
  async restoreUser(id) {
    const user = await User.findByPk(id);
    if (!user) throw new Error("User not found");
    await user.update({ is_active: true, deleted_by: null });
    return user;
  },

  // Refresh access token
  async refreshAccessToken(userId) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error("User not found");

    const newToken = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      SECRET_KEY,
      { expiresIn: "7d" }
    );

    await user.update({ token: newToken });
    return newToken;
  },

  // Logout user (clear token)
  async logoutUser(userId) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error("User not found");
    await user.update({ token: null });
    return true;
  },

  //  Send OTP token (dummy for now)
  async sendOtpToken(identifier) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // here you can save OTP in DB/Redis and send via email/SMS
    return otp;
  },



  //  Check if user already exists
  async userAlreadyExists(email) {
    const user = await User.findOne({ where: { email } });
    return !!user;
  },

  //  Change password
  async changePassword(userId, oldPassword, newPassword) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new Error("Old password is incorrect");

    const hashed = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashed });
    return true;
  },
};

export default userService;
