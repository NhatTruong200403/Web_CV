const mongoose = require("mongoose");
let bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    avatarUrl: { type: String, default: "" },
    cvFile: { type: String, default: "" },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
    phonenumber: { type: String, trim: true },
    authProvider: { type: String, trim: true },
    appliJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    status: { type: String, trim: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const allowFields = ["email", "username", "avatarUrl", "cvFile", "phonenumber"];

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    let salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
  }
  next();
});

userSchema.methods.updateAllowedFields = async function (newData) {
  for (let field of allowFields) {
    if (newData[field] !== undefined) {
      // Nếu là password thì hash trước khi lưu
        this[field] = newData[field];
    }
  }
};

userSchema.methods.updatePassword = async function (newPassword) {
  let salt = bcrypt.genSaltSync(10);
  this[field] = bcrypt.hashSync(newData[field], salt);
};

userSchema.methods.applyForJob = async function(jobId) {
  if (!this.applyForJob.includes(jobId)) {
    this.applyForJob.push(jobId);
    await this.save();
  }
};

const User = mongoose.model("User", userSchema);
module.exports = User;
