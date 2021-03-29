const mongo4me = require("../../../mongo4me/mongo4me");
const mongo4auth = require("../../../mongo4auth/mongo4auth");
const auth4me = require("../../auth4me");
const engine = new mongo4me();
const provider = new mongo4auth(engine);
const auth = new auth4me(provider);
auth.email("the_user_id","the_user_email").then((r)=>{console.log(r)});
