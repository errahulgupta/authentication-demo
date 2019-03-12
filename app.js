var express = require("express");
var mongoose = require("mongoose");
var passport = require("passport");
var bodyparser = require("body-parser");
var User = require("./models/users");
var localstrategy = require("passport-local");
var passportlocalmongoose = require("passport-local-mongoose");

mongoose.connect('mongodb://localhost:27017/auth_demo', { useNewUrlParser: true }); 
var app = express();
app.set("view engine","ejs");

app.use(bodyparser.urlencoded({extended:true}));
app.use(require("express-session")({
   secret :"pizza is favourite",
   resave : false,
   saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Routes
app.get("/",function(req,res){
   res.render("home"); 
});

app.get("/secret",isLoggedIn,function(req,res){
   res.render("secret"); 
});

//auth routes

//signup route
app.get("/register",function(req,res) {
    res.render("register");
});
app.post("/register",function(req,res){
    req.body.username
    req.body.password
    User.register(new User({username : req.body.username}), req.body.password, function(err,user){
       if(err){
           console.log("error");
       } 
        passport.authenticate("local")(req,res,function(){
            res.redirect("/secret");
         });
    });
});
//login route
app.get("/login",function(req, res) {
   res.render("login"); 
});

//middleware
app.post("/login", passport.authenticate("local",{
    successRedirect : "/secret",
    failureRedirect : "/login"
}), function(req,res){
});

//logout route
app.get("/logout",function(req, res) {
   req.logout(); 
   res.redirect("/");
});
//middleware function for secret page
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
      return next();
  }  
  res.redirect("/login");
}

app.listen(process.env.PORT,process.env.IP,function(){
   console.log("server started"); 
});