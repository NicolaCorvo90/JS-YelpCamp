var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground");
var middleware = require("../middleware");

// CAMPGROUNDS ROUTES
router.get("/", function(req, res) {

    Campground.find({}, function(err, campgrounds) {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: campgrounds });
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res) {
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }

    var newCampground = { name: name, price: price, image: image, description: description, author: author };

    Campground.create(newCampground, function(err, campgroundCreated) {
        if(err) {
            console.log(err);
        } else {
            console.log(campgroundCreated);
            res.redirect("/campgrounds");
        }
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

router.get("/:id", function(req, res) {
    var id = req.params.id;

    Campground.findById(id).populate("comments").exec(function(err, foundCampground) {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
});

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    var id = req.params.id;

    Campground.findById(id, function(err, foundCampground) {
        res.render("campgrounds/edit", { campgrounds: foundCampground });
    });
});

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    var id = req.params.id;
    var campground = req.body.campground;

    Campground.findByIdAndUpdate(id, campground, function(err, foundCampground) {
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + id);
        }
    });
});

router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    var id = req.params.id;
    
    Campground.findByIdAndRemove(id, function(err, foundCampground) {
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;