const bcrypt = require("bcryptjs");

module.exports = {
  register: async (req, res) => {
    const { username, password, isAdmin } = req.body;
    const db = req.app.get("db");
    const result = await db.get_user([username]);
    const existingUser = result[0];
    if (existingUser) {
      return res.status(409).send("Username taken");
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const registeredUser = await db.register_user([isAdmin, username, hash]);
    const user = registeredUser[0];
    req.session.user = {
      isAdmin: user.is_admin,
      username: user.username,
      id: user.id
    };
    return res.status(201).send(req.session.user);
  },

  login: async (req, res) => {
    const { username, password } = req.body;
    const foundUser = await req.app.get("db").get_user([username]);
    const user = foundUser[0];
    if (!user) {
      return res
        .status(401)
        .send(
          "User  not found. Please register as a new user before logging in."
        );
    }
    const isAuthenticated = bcrypt.compareSync(password, user.hash);
    if (!isAuthenticated) {
      return res.status(403).send("Incorrect password");
    }
    req.session.user = {
      isAdmin: user.is_admin,
      id: user.id,
      username: user.username
    };
    return res.send(req.session.user);
  },
  logout: (req, res) => {
    req.session.destroy();
    return res.sendStatus(200);
  }
};

// function register(req,res) {
//     // console.log(req);
//     const {username, password, isAdmin} = req.body
//     const db = req.app.get("db");

//     db.get_user(username)
//         .then(async result => {
//            // console.log(result[0]);
//             //console.log(isAdmin);
//             let existingUser = result[0];

//             if(result[0].count == 0){
//             // const salt = bcrypt.genSaltSync(10);
//             const hash = await bcrypt.hash(password, 10);
//             let registeredUser = [];
//             registeredUser = await db.register_user(isAdmin, username, hash);
//             let user = registeredUser[0];
//             req.session.user = {isAdmin:user.is_admin, id:user.id, username:user.username}
//             //console.log(req.session.user);
//             res.status(201).json(req.session.user);
//             }else {
//                 res.status(409).json("username taken. choose another");
//             }
//     })
// }

// module.exports={
//     register,
//     login
// }
