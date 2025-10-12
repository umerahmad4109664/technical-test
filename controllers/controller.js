const { Subtask, Task, User } = require("../model");
const db = require("../model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const userResponse = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
    };

    return res.status(201).json({
      message: "User registered successfully",
      user: userResponse,
    });

  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required." });

    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password." });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user.id;

    if (!title)
      return res.status(400).json({ message: "Title is required." });

    const newTask = await Task.create({
      title,
      userId,
    });

    return res.status(201).json({
      message: "Task created successfully",
      task: newTask,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const tasks = await Task.findAll({
      where: { userId },
      include: [{ model: Subtask }],
      order: [["createdAt", "ASC"]],
    });
    return res.status(200).json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


exports.createSubtask = async (req, res) => {
  try {
    const { taskId, text } = req.body;
    const userId = req.user.id;

    if (!taskId || !text)
      return res.status(400).json({ message: "Task Id and text is required." });

    const newSubtask = await Subtask.create({
      text,
      taskId,
      userId,
      isChecked: false,
    });

    return res.status(201).json({
      message: "Subtask created successfully",
      subtask: newSubtask,
    });
  } catch (error) {
    console.error("Error creating subtask:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.toggleSubtask = async (req, res) => {
  try {
    const { subtaskId } = req.body;

    if (!subtaskId)
      return res.status(400).json({ message: "Subtask Id is required." });

    const subtask = await Subtask.findOne({ where: { id: subtaskId } });
    if (!subtask)
      return res.status(400).json({ message: "Invalid task Id or subtask Id." });

    subtask.isChecked = !subtask.isChecked;
    await subtask.save();

    return res.status(200).json({
      message: "Subtask toggled successfully",
      subtask,
    });
  } catch (error) {
    console.error("Error toggling subtask:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
