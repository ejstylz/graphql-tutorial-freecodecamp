require("dotenv").config();

module.exports = {
    MONGODB: process.env.DATABASEURL,
    jwtSecret: process.env.JWT_SECRET,
};
