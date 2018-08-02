var e= require("Express"),bodyparser=require("body-parser"),mongoose=require("mongoose"),methodOverride=require("method-override");
var app=e();

mongoose.connect("mongodb://localhost/blog_app");
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
var Blog=mongoose.model("Blog",b);

app.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs){
		if(!err){
			res.render("blogs",{blogs:blogs});
		}
	});	
});
app.get("/",function(req,res){
	res.render("welcome_page");
})

app.get("/new_blog",function(req,res){
	res.render("new_blog");
})

app.post("/blogs",function(req,res){
	Blog.create(req.body.blog, function(err,New_blog){
		if(!err){
			res.redirect("/blogs");
		}
	})
})

app.get("/blogs/:blog_id/edit",function(req,res){
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


app.delete("/blogs/:id",function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err)
			res.redirect("/blogs/"+req.params.id);
		else
			res.redirect("/blogs");
	})
})

app.listen(3000,function(){
	console.log("Running");
});