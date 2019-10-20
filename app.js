// NPM Packages initialization
var express = require('express'),
    request = require('request'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Campground = require('./models/campground'),
    Comment = require("./models/comment")
    SeedDB = require("./seed")
var app = express();

//seeding database with dummy datas
SeedDB();
mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true })

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));

// Landing Page
app.get("/",function(req, res){
    res.render("landing");
});

// Campground Page to see all the list of camps
app.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, campgrounds){
        if(err){
            res.render(err)
        }else{
            res.render("campgrounds/index", {campgrounds: campgrounds})
        }
    })
});

// Logic to add camps on campground page
app.post("/campgrounds", function(req, res){
    Campground.create({
        name: req.body.campName,
        image: req.body.image,
        description: req.body.CampDesc
    }, function(err, campground){
        if(err){
            console.log("something went wrong");
            console.log(err)
        }else{
            res.redirect("/campgrounds");
        }
    })
});

// Campground new Page to add new camps in the campground page
app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new");
});

//see particular campground
app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
        if(err){
            console.log(err)
        }else{
            res.render("campgrounds/show", {camp:foundCamp})
        }
    });
})

//create a form page for comments
app.get("/campgrounds/:id/comments/new", function(req, res){
    Campground.findById(req.params.id, function(err, campData){
        if(err){
            console.log("not loaded properly")
        }else{
            res.render("comments/new",{camp:campData})
        }
    })
});

//uppar vala link a submit click kariya pacchi ahiya avey and andar nu logic perform karey
app.post("/campgrounds/:id/comments", function(req, res){
    Campground.findById(req.params.id, function(err, campData){
        if(err){
            console.log(err);
            res.redirect("/campgrounds")
        }else{
            Comment.create(req.body.comment, function(err,comment){
                if (err){
                    console.log(err)
                }else{
                    console.log(campData)
                    campData.comments.push(comment)
                    campData.save();
                    res.redirect("/campgrounds/"+ campData._id)
                }
            })
        }
    })       
});
app.listen("3000",function(req, res){
    console.log("Yelp camp server has started!!");
});