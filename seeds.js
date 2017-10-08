var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comment');

var data = [
    { 
        name: "Cloud's Rest", 
        image: "https://images.pexels.com/photos/45241/tent-camp-night-star-45241.jpeg?h=350&auto=compress&cs=tinysrgb",
        description: "Lorem Ipsum è considerato il testo segnaposto standard sin dal sedicesimo secolo, quando un anonimo tipografo prese una cassetta di caratteri e li assemblò per preparare un testo campione."
    },
    { 
        name: "Desert Mesa", 
        image: "https://images.pexels.com/photos/116104/pexels-photo-116104.jpeg?h=350&auto=compress&cs=tinysrgb",
        description: "È universalmente riconosciuto che un lettore che osserva il layout di una pagina viene distratto dal contenuto testuale se questo è leggibile."
    },
    { 
        name: "Big Map", 
        image: "https://images.pexels.com/photos/297642/pexels-photo-297642.jpeg?h=350&auto=compress&cs=tinysrgb",
        description: "Esistono innumerevoli variazioni dei passaggi del Lorem Ipsum, ma la maggior parte hanno subito delle variazioni del tempo, a causa dell’inserimento di passaggi ironici, o di sequenze casuali di caratteri palesemente poco verosimili."
    }
];

function seedDB() {
    // Remove all campgrounds
    Campground.remove({}, function(err) {
        if(err) {
            console.log(err)
        } else {

            // Add a few campgrounds
            data.forEach(function(seed) {
                Campground.create(seed, function(err, campground) {
                    if(err) {
                        console.log(err);
                    } else {

                        // Create a comment
                        Comment.create(
                            {
                                text: "This place is great, but i wish there was internet",
                                author: "Homer"
                            }, function(err, comment) {
                                if(err) {
                                    console.log(err);
                                } else {
                                    campground.comments.push(comment);
                                    campground.save();
                                }
                            }
                        );

                    }
                })
            });
        }
    });
}

module.exports = seedDB;