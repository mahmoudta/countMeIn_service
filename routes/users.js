const express = require("express"),
  router = require("express-promise-router")();
const passport = require("passport");
const passportConf = require("../passport");
const { validateBody, schemas } = require("../helpers/routerHelpers");
const userCtl = require("../controllers/users.ctl");
const passportSignIn = passport.authenticate("local", { session: false });
const passportJWT = passport.authenticate("jwt", { session: false });
const passportGoogle = passport.authenticate("googleToken", { session: false });

router.route("/signup").post(validateBody(schemas.authSchema), userCtl.signUp);
router
  .route("/signin")
  .post(validateBody(schemas.authSchema), passportSignIn, userCtl.signIn);
router.route("oauth/google").post(passportGoogle, userCtl.googleOAuth);
router.route("/secret").get(passportJWT, userCtl.secret);
router.route("/test").get(userCtl.test);
router.route("/booktest").get(userCtl.booktest);
router.route("/databasetest").get(userCtl.databasetest);
router.route("/getbusinesses").get(userCtl.getAllBusinesses);
router
  .route("/getUpcommingAppointments")
  .get(passportJWT, userCtl.getUpcommingAppointments);
router
  .route("/getFallowedBusinesses")
  .get(passportJWT, userCtl.getFallowedBusinesses);
module.exports = router;
