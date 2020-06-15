const sql4me = require("../../providers/sql4me");
const auth4me = require("../../auth4me");
let provider = new sql4me();
let auth = new auth4me(provider);
auth.signin("the_username_or_email","the_user_password").then((r)=>{console.log(r)});
