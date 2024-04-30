const passport = require("passport");
const local = require("passport-local");
const { createHash, isValidPassword } = require("../utils");
const userModel = require("../dao/models/users");
const GithubStrategy = require("passport-github2");
const { usersService, cartsService } = require("../repositories/index");

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: "Iv1.08f45f226692a7b6",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
        clientSecret: "414e92114f93adc8d7d1888ad6b23e2da47c248a",
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const user = await userModel.findOne({ email: profile._json.email });

          if (!user) {
            const newUser = {
              first_name: profile._json.name,
              last_name: "",
              age: 0,
              email: profile._json.email,
            };
            const result = await userModel.create(newUser);
            return done(null, result);
          } else {
            return done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
        passwordField: "password",
      },
      async (req, email, password, done) => {
        let existingUser;
        existingUser = await usersService.getByProperty("email", email);

        try {
          const { first_name, last_name, email, age } = req.body;

          if (!first_name || !last_name || !email || !age) {
            return done(null, false, { message: "All fields are required" });
          }

          if (existingUser) {
            return done(null, false, { message: "User already exists" });
          }

          const cart = await cartsService.create();
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            cart: cart._id,
          };
          const result = await usersService.create(newUser);
          console.log(newUser);
          return done(null, result);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        try {
          const user = await usersService.getByProperty("email", email);
          if (!user) {
            return done(null, false, { message: "User not found" });
          }
          if (!isValidPassword(user, password)) {
            return done(null, false, { message: "Invalid password" });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await userModel.findById(id);
  done(null, user);
});

module.exports = initializePassport;
