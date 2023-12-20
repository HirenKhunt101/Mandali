const jwt = require("jsonwebtoken");

let add_property = async function (req, res, next) {
  try {
    const token = await jwt.sign({ name: "Hiren" }, "This is my computer");
    console.log(token);

    const verification = await jwt.verify(token, "This is my computer");
    console.log(verification);

    res.cookie("Token", token, {
      maxAge: 2700000,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    return res.status(201).json({
      statusMessage: "Property Unit inserted successfully",
      data: [],
    });
  } catch (error) {
    console.log(`Error in catch : ${error}`);
    return res
      .status(501)
      .json({ statusMessage: "Error in add property unit", data: error });
  }
};

module.exports = {
  add_property: add_property,
};
