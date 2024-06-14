const mongoose = require("mongoose");

const otpSchema = mongoose.Schema(
  {
    email: String,
    code: String,
    expires: {
      type: Date,
      default: () => new Date(Date.now() +  10 * 60 * 1000), // Set the default value to current time + 10 minutes
      index: { expires: "600s" }, // Create a TTL index with a one-minute expiration
    },
  },
  {
    timestamps: true,
  }
);

const Otp = mongoose.model("Otp", otpSchema);

module.exports = Otp;