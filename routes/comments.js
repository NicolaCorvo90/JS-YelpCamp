var express = require("express");
var router = express.Router({ mergeParams: true });
var middleware = require("../middleware");

var Campground = require("../models/campground");
var Comment = require("../models/comment");

// COMMENTS ROUTES
router.get("/new", middleware.isLoggedIn, function(req, res) {
    var id = req.params.id;

    Campground.findById(id, function(err, foundCampground) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground: foundCampground });
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res) {
    var id = req.params.id;
    var comment = req.body.comment;

    Campground.findById(id, function(err, foundCampground) {
        if(err) {
            console.log(err);
            redirect("/campgrounds");
        } else {
            Comment.create(comment, function(err, comment) {
                if(err) {
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else {

                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();

                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    req.flash("success", "Sucessfully added comment");
                    res.redirect("/campgrounds/" + foundCampground._id);
                }
            })
        }
    });
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    var id = req.params.id;
    var comment_id = req.params.comment_id;

    Comment.findById(comment_id, function(err, foundComment) {
        if(err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", { campground_id: id, comment: foundComment })
        }
    });
});

router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    var id = req.params.id;
    var comment_id = req.params.comment_id;
    var comment = req.body.comment;

    Comment.findByIdAndUpdate(comment_id, comment, function(err, updatedComment) {
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + id);
        }
    });
});

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    var id = req.params.id;
    var comment_id = req.params.comment_id;

    Comment.findByIdAndRemove(comment_id, function(err, updatedComment) {
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/" + id);
        }
    });
});

module.exports = router;