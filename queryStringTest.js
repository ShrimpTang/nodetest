/**
 * Created by ShrimpTang on 2015/9/4.
 */
var querystring = require("querystring");
console.log(querystring.stringify({"name":"瞎子","qq":"4039303"}));
console.log(querystring.stringify({"name":"xiazi","qq":"4039303"},"-"));
console.log(querystring.stringify({"name":"xiazi","qq":"4039303"},"-","!"));
console.log(querystring.parse("name=xiazi&qq=4039303"));

