const mongo4me = require("../../../mongo4me/mongo4me");
const mongo4auth = require("../../../mongo4auth/mongo4auth");
const auth4me = require("../../auth4me");
const engine = new mongo4me();
const provider = new mongo4auth(engine);
const auth = new auth4me(provider);
auth.signin("the_username_or_email","the_user_password").then((r)=>{console.log(r)});
