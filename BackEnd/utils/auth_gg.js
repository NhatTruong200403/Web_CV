const passport = require("passport");
const userModel = require("../schemas/user");
const roleModel = require("../schemas/role");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const key = require("../config");
const { sendSuccess } = require("./responseHandler");

// Hàm tạo token
const generateToken = (user) => {
  const expireTime = Date.now() + 24 * 60 * 60 * 1000; // 1 ngày
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      expire: expireTime,
    },
    key.SECRET_KEY
  );
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_API_CLIENTID,
      clientSecret: process.env.GOOGLE_API_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google Profile:", profile);

        // Kiểm tra email
        if (!profile.emails || profile.emails.length === 0) {
          return done(new Error("Không thể lấy email từ Google profile"), null);
        }

        let user = await userModel.findOne({ email: profile.emails[0].value });
        let role = await roleModel.findOne({
          name: "User",
        });
        if (!user) {
          user = new userModel({
            username: profile.displayName,
            password: "passwordbasic",
            email: profile.emails[0].value,
            avatarUrl:
              profile.photos && profile.photos.length > 0
                ? profile.photos[0].value
                : null,
            role: role._id,
            authProvider: "google",
          });
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
const authGoogle = {
    authenticate: (req, res, next) => {
        const returnUrl = req.query.returnUrl || "http://default-frontend-url.com"; // URL mặc định nếu không có
        passport.authenticate("google", {
          scope: ["profile", "email"],
          state: returnUrl, // Truyền returnUrl vào state
        })(req, res, next);
      },
      handleCallback: [
        passport.authenticate("google", {
          session: false,
          failureRedirect: "/login",
        }),
        (req, res) => {
          const token = generateToken(req.user);
          const returnUrl = req.query.state || "http://default-frontend-url.com"; // Lấy returnUrl từ state
          console.log("Token:", token);
          console.log("Return URL:", returnUrl);
          sendSuccess(res, { token, returnUrl }, "Login successfully", 200); // Gửi cả token và returnUrl
        },
      ],
};

module.exports = authGoogle;
