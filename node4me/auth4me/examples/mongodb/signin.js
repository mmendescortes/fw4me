const sql4me = require("../../../sql4me/sql4me");
const sql4auth = require("../../../sql4auth/sql4auth");
const auth4me = require("../../auth4me");
const engine = new sql4me();
const provider = new sql4auth(engine);
const auth = new auth4me(provider);
auth.signin("the_username_or_email","the_user_password").then((r)=>{console.log(r)});