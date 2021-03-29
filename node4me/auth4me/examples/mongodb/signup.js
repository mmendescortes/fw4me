const mongo4me = require("../../../mongo4me/mongo4me");
const mongo4auth = require("../../../mongo4auth/mongo4auth");
const auth4me = require("../../auth4me");
const engine = new mongo4me();
const provider = new mongo4auth(engine);
const auth = new auth4me(provider);
auth.signup("the_username","the_user_password","the_user_email_is_optional_you_can_delete_this_argument_if_you_want").then((r)=>{console.log(r)});
