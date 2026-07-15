const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Models
const User = require("./models/User");
const Property = require("./models/Property");
const Message = require("./models/Message");

// Middleware
const auth = require("./middleware/auth");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "estateflow_secret_key_123";

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1/mernapp")
  .then(() => console.log("MongoDB Connected to 'mernapp'"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    console.log("Please ensure MongoDB is running locally on mongodb://127.0.0.1/mernapp");
  });

// Base Route
app.get("/", (req, res) => {
  res.send("EstateFlow Backend API is running.");
});

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

// Register User
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server registration error", error: err.message });
  }
});

// Login User
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server login error", error: err.message });
  }
});

// Get logged-in user profile
app.get("/api/auth/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching profile" });
  }
});

// ==========================================
// PROPERTY ROUTES
// ==========================================

// Get all properties with filters
app.get("/api/properties", async (req, res) => {
  try {
    const { search, type, status, minPrice, maxPrice, bedrooms } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }
    if (type && type !== "all") {
      query.type = type;
    }
    if (status && status !== "all") {
      query.status = status;
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (bedrooms && bedrooms !== "all") {
      query.bedrooms = Number(bedrooms);
    }

    const properties = await Property.find(query)
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.json(properties);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching properties", error: err.message });
  }
});

// Get a single property by ID
app.get("/api/properties/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate("owner", "name email");
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.json(property);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching property detail", error: err.message });
  }
});

// Create a new property listing
app.post("/api/properties", auth, async (req, res) => {
  try {
    const { title, description, price, location, type, status, bedrooms, bathrooms, area, images } = req.body;
    
    if (!title || !description || !price || !location || !type || !status || !bedrooms || !bathrooms || !area) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    const newProperty = new Property({
      title,
      description,
      price,
      location,
      type,
      status,
      bedrooms,
      bathrooms,
      area,
      images: images && images.length > 0 ? images : ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"],
      owner: req.user.id,
    });

    const savedProperty = await newProperty.save();
    res.status(201).json(savedProperty);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error creating property", error: err.message });
  }
});

// Update a property
app.put("/api/properties/:id", auth, async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Verify ownership
    if (property.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized to update this listing" });
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(property);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error updating property", error: err.message });
  }
});

// Delete a property
app.delete("/api/properties/:id", auth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Verify ownership
    if (property.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized to delete this listing" });
    }

    await Property.findByIdAndDelete(req.params.id);
    
    // Clean up messages associated with this property
    await Message.deleteMany({ property: req.params.id });

    res.json({ message: "Property and associated inquiries deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error deleting property", error: err.message });
  }
});

// ==========================================
// MESSAGE / INQUIRY ROUTES
// ==========================================

// Send a contact message for a property
app.post("/api/properties/:id/contact", async (req, res) => {
  try {
    const { senderName, senderEmail, senderPhone, message } = req.body;
    if (!senderName || !senderEmail || !message) {
      return res.status(400).json({ message: "Please fill in all required fields (Name, Email, Message)" });
    }

    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const newMessage = new Message({
      property: property._id,
      senderName,
      senderEmail,
      senderPhone: senderPhone || "",
      message,
      receiver: property.owner,
    });

    await newMessage.save();
    res.status(201).json({ message: "Your message has been sent to the property owner/agent successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error sending message", error: err.message });
  }
});

// Get all messages for the current user (receiver)
app.get("/api/messages", auth, async (req, res) => {
  try {
    const messages = await Message.find({ receiver: req.user.id })
      .populate("property", "title price location images")
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching messages", error: err.message });
  }
});

// Delete a message
app.delete("/api/messages/:id", auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Verify ownership (receiver must be the logged-in user)
    if (message.receiver.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized to delete this message" });
    }

    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: "Inquiry message deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error deleting message", error: err.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});