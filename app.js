// INIT
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var localStrategy = require('passport-local');
var methodOverride = require('method-override');
var flash = require("connect-flash");

// MODELS
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");

// ROUTES
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use(methodOverride("_method"));

app.use(flash());

// MONGODB CONNECTION
mongoose.connect("mongodb://localhost/yelp_camp", {
    useMongoClient: true
});

var seedDB = require("./seeds");
//seedDB();

// PASSPORT CONFIGURATION
app.use(require('express-session')({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//LISTEN
/*app.listen(process.env.PORT, process.env.IP, function() {
    console.log("YelpCamp server started!");
});*/

app.listen("3000", "localhost", function() {
    console.log("YelpCamp server has started!");
});