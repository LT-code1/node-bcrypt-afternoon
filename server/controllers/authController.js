
const bcrypt = require("bcryptjs");

function register(req,res) {
    // console.log(req);
    const {username, password, isAdmin} = req.body
    const db = req.app.get("db");

    db.get_user(username)
        .then(async result => {
           // console.log(result[0]);
            //console.log(isAdmin);
            let existingUser = result[0];

            if(result[0].count == 0){
            // const salt = bcrypt.genSaltSync(10);
            const hash = await bcrypt.hash(password, 10);
            let registeredUser = [];
            registeredUser = await db.register_user(isAdmin, username, hash);
            let user = registeredUser[0];
            req.session.user = {isAdmin:user.is_admin, id:user.id, username:user.username}
            //console.log(req.session.user);
            res.status(201).json(req.session.user);
            }else {
                res.status(409).json("username taken. choose another");
            }
    })
}


module.exports={
    register
}