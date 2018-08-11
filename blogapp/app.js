var e= require("Express"),bodyparser=require("body-parser"),mongoose=require("mongoose"),methodOverride=require("method-override");
var app=e();
var passport= require("passport"),LocalStrategy= require("passport-local"),passportLocalMongoose= require("passport-local-mongoose");
var User= require("./models/user");

mongoose.connect("mongodb://localhost:27017/blog_app", { useNewUrlParser: true });
app.set("view engine","ejs");
app.use(e.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());
app.use(methodOverride("_method"));
var b=new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	date: {
		type:Date,
		default: Date.now
	}
});

app.use(require("express-session")({
	secret: "I,Deepansh Nagaria am the best developer in IIT Roorkee and I made this site for ARIES IITR",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

var m=new mongoose.Schema({
	topic: String,
	name: String,
	body: String,
	date: {
		type:Date,
		default: Date.now
	}
});
var Blog=mongoose.model("Blog",b);
var Message=mongoose.model("Message",m);
app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	next();
})

app.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs){
		if(!err){
			res.render("blogs",{blogs:blogs});
		}
	});	
});
app.get("/",function(req,res){
	res.render("welcome_page",{currentUser:req.user});
})
app.get("/secret", isLoggedIn,function(req,res){
	res.send("I,Deepansh Nagaria am the best developer in IIT Roorkee and I made this site for ARIES IITR");
})

app.get("/new_blog",isLoggedIn,function(req,res){
	res.render("new_blog");
})

app.post("/blogs",function(req,res){
	Blog.create(req.body.blog, function(err,New_blog){
		if(!err){
			res.redirect("/blogs");
		}
	})
})

app.get("/blogs/:blog_id/edit",isLoggedIn,function(req,res){
	Blog.findById(req.params.blog_id,function(err,foundblog){
		if(!err&&foundblog)
			res.render("Editing_blog",{foundblog:foundblog});
		else
			res.redirect("/blogs");
	});
})

app.put("/blogs/:_id",function(req,res){
	Blog.findByIdAndUpdate(req.params._id,req.body.blog,function(err,model){
		if(err)
			res.redirect("/blogs/"+req.params._id+"/edit");
		else
			res.redirect("/blogs/"+model._id);
	});
})

app.get("/blogs/:_id",function(req,res){
	Blog.findById(req.params._id,function(err,foundblog){
		res.render("blog_post",{blog:foundblog});
	})
})


app.delete("/blogs/:id",isLoggedIn,function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err)
			res.redirect("/blogs/"+req.params.id);
		else
			res.redirect("/blogs");
	})
})

app.post("/messages",function(req,res){
	//res.send(req.body.message);
	Message.create(req.body.message,function(err,newblog){
		res.redirect("/thanks");
	})
})

app.get("/messages",isLoggedIn,function(req,res){
	Message.find({},function(err,messages){
		res.render("message_dis",{messages:messages});
	})
})
app.get("/thanks",function(req,res){
	res.render("thanks");
})


app.get("/new_messages",function(req,res){
	res.render("message");
})

//========================================================
//========================================================
//Auth
//========================================================
//========================================================
app.get("/register",function(req,res){
	res.render("register");
})
app.post("/register",function(req,res){
	User.register(new User({username:req.body.username}),req.body.password,function(err,user){
		if(err){
			console.log(err);
			//console.log(req.body.username);
			return res.render('register');
		}
		passport.authenticate("local")(req,res,function(){
			res.redirect("/blogs");
		})
	})
})
app.get("/login", function(req,res){
	res.render("login");
})
app.post("/login",passport.authenticate("local",{
	successRedirect:"/blogs",
	failureRedirect:"/login"}),function(req,res){

})
app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/blogs");
})
function isLoggedIn(req,res,next){
	//console.log(req.isAuthenticated());
	if(req.isAuthenticated()){
		return next();
	}
	else
		res.redirect("/login");
}

app.listen(3000,function(){
	console.log("Running");
});