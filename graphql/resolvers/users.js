const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const User = require("../../models/User");
const { jwtSecret } = require("../../config");
const { validateRegisterInput, validateLoginInput } = require("../../utils/validators");

function generateToken(user) {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            username: user.username,
        },
        jwtSecret,
        { expiresIn: "2h" }
    );
}

module.exports = {
    Mutation: {
        // login mutation
        async login(_, { username, password }) {
            //validate user data
            const { valid, errors } = validateLoginInput(username, password);
            if (!valid) {
                throw new UserInputError("Errors", { errors });
            }

            const user = await User.findOne({ username: username });
            if (!user) {
                errors.general = "User not found";
                throw new UserInputError("User not found", { errors });
            }

            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                errors.general = "Wrong credentials";
                throw new UserInputError("Wrong credentials", { errors });
            }

            const token = generateToken(user);

            return {
                ...user._doc,
                id: user._id,
                token,
            };
        },

        // register user
        async register(_, { registerInput: { username, password, email, confirmPassword } }) {
            //validate user data
            const { valid, errors } = validateRegisterInput(username, password, email, confirmPassword);
            if (!valid) {
                throw new UserInputError("Errors", { errors });
            }

            //make sure user doesn't already exist
            const user = await User.findOne({ username });

            if (user) {
                throw new UserInputError("Username is already in use", {
                    errors: {
                        username: "This username is taken",
                    },
                });
            }
            //hash pasword and create an auth token
            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                username,
                password,
                email,
                createdAt: new Date().toISOString(),
            });

            const res = await User.create(newUser);

            const token = generateToken(res);

            return {
                ...res._doc,
                id: res._id,
                token,
            };
        },
    },
};
