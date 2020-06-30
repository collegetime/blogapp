const http = require('http');
var express = require("express"),
app = express(),
methodOverride= require("method-override"),
mongoose = require("mongoose");
bodyParser= require("body-parser");
var bodyParser= require("body-parser");
  const url = process.env.DB_URL;
//app.use(require('connect').bodyParser());
 //mongoose.set('useNewUrlParser', true);
//mongoose.connect("mongodb+srv://collegetime:Password@collegetime-bm1uh.gcp.mongodb.net/blog?retryWrites=true&w=majority",{ useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true });
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
//mongoose.connect(uri, { useNewUrlParser: true });
//mongoose.createConnection(uri, { useNewUrlParser: true });
app.use(bodyParser.json());
app.use(methodOverride("_method"));  ///wen can anything insted of method

var blogSchema = new mongoose.Schema({
	title:String,
	image:String,
	body: String,
	date :{type:Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

//>>>>>>>>>>>this was sample data collection<<<<<<<<<<<<<<<<<<<<<

// Blog.create({
// 	title: "My first blog",
// 	image:"https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg",
// 	body:"ther ei sno description"
// });


//********************ROUTES****************************

//>>>>>>>>>>INDEX<<<<<<<<<<<<<

app.get("/",function(req,res){
	res.redirect("/blogs");
})
app.get("/blogs",function(req,res){
	Blog.find({}, function(err, blogs){
		if(err){
			console.log("there is an error");
		}else{
			res.render("index", {blogs:blogs});
		}
	})

})

//***************fro new blog********************
app.get("/blogs/new" ,function(req,res){
	res.render("new");
});

app.post("/blogs" , function(req,res){
	var formData = req.body.blog;
	Blog.create(formData, function(err, newBlog){
		// console.log(newBlog);
		if (err){

			res.render("new");
			console.log("error in the system");
		} else{
			res.redirect("/blogs");
		}
	})
	// console.log(req.body);
});

//@****************for showing the post***********************
app.get("/blogs/:id" ,function(req,res){
	Blog.findById(req.params.id,function(err, foundBlog){
		if(err){
			res.redirect("/blogs")
		}else{
			res.render("show" , {blog:foundBlog});
		}
	})


});

//********************for editing*****************
app.get("/blogs/:id/edit" , function(req,res){
	Blog.findById(req.params.id ,function(err, editBlog){
		if(err){
			res.redirect("/blogs")
		}else{
			res.render("edit" , {blog:editBlog});
		}
	})
});

////*****************updating app using put************************
app.put("/blogs/:id" , function(req,res){
	Blog.findByIdAndUpdate(req.params.id ,req.body.blog , function(err, updateBlog){
		if(err){
			res.redirect("/blogs/");
		}else{
			 res.redirect("/blogs/" + req.params.id);
		}
	})


});

app.delete("/blogs/:id" ,function(req,res){
	Blog.findById(req.params.id, function(err,blog){
		if (err){
			console.log(err);
		}
		else{
			 blog.remove();
			res.redirect("/blogs")
		}
	})
});



//for launching app
app.listen(process.env.PORT || 80, function(){
	console.log("server is running");
})







// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   //res.setHeader('Content-Type', 'text/plain');
//   //res.end('Hello World');
// });
//
// server.listen(process.env.PORT || 3000, () => {
//   console.log(`Server running at`);
// });
