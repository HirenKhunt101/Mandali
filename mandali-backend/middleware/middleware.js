let mongo = require("../database/database.service");
let schema = require("../database/database.schema");
let jwt = require("jsonwebtoken");

let User = schema.user;

let user_authentication = async function (req, res, next) {
  let body = req.body;
  if (!req.cookies.Token) {
    return res.status(401).json({
      statusMessage: "Authentication token expired, please login again",
    });
  }
  jwt.verify(req.cookies.Token, "mandali", async (err, decode) => {
    if (!err) {
      req.body.ClientId = decode.ClientId;
      let token = jwt.sign(
        { Email: decode.Email, ClientId: decode.ClientId },
        "mandali"
      );

      res.cookie("Token", token, {
        maxAge: 2700000,
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

      User.updateOne(
        { _id: decode.ClientId },
        { "AuthToken.UpdatedAt": Date.now() },
        (err, res) => {}
      );
      next();
    } else {
      if (err.name == "JsonWebTokenError") {
        return res.status(400).json({
          statusMessage: "Authentication token not valid",
          data: { err },
        });
      } else {
        return res.status(401).json({
          statusMessage: "Authentication token expired, please login again",
          data: { err },
        });
      }
    }
  });
};

module.exports = {
  user_authentication: user_authentication,
};
