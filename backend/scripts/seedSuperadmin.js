require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const SUPERADMIN = {
  name:     "Super Admin",
  email:    process.env.SUPERADMIN_EMAIL    || "superadmin@taskflow.com",
  password: process.env.SUPERADMIN_PASSWORD || "SuperSecret@2024!",
  role:     "superadmin",
  isActive: true,
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // --- Singleton check ---
    const existing = await User.findOne({ role: "superadmin" });
    if (existing) {
      console.log(`⚠️  Superadmin already exists: ${existing.email}`);
      console.log("   Seed skipped — only one superadmin is allowed.");
      process.exit(0);
    }

    const superadmin = await User.create(SUPERADMIN);
    console.log(`✅ Superadmin created successfully!`);
    console.log(`   Email:    ${superadmin.email}`);
    console.log(`   Name:     ${superadmin.name}`);
    console.log(`   Role:     ${superadmin.role}`);
    console.log(`\n⚠️  IMPORTANT: Change the password immediately after first login.`);
    process.exit(0);

  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
};

seed();
