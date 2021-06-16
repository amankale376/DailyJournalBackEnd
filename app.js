const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const { v4: uuidv4 } = require('uuid');

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://aman:Test@123@cluster0.5lgy3.mongodb.net/DailyJournal", { useNewUrlParser: true,  useUnifiedTopology: true });

//login to admin below
const userSchema = new mongoose.Schema({
    username:String,
    password:String
});

const User  = mongoose.model("admin",userSchema);
app.get("/",(req,res)=>{
    res.send("it is working");
    });


app.post("/login", (req,res)=>{

    const user = req.body.username;
    const pass = req.body.password;


 User.find({username:user},(err,data)=>{
    if(err){
        console.log(err);
    }
        if(data.length > 0){
        data.forEach((d)=>{
            if(pass=== d.password){
              res.send(d.username);
            }else{
                res.send("password did not match");
            }
        });
    }
});

});

// get blogs below
    const blogSchema ={
        title:String,
        content:String,
        date:String,
        id:String
    }
        const Blog = mongoose.model("blog",blogSchema);


app.get("/getBlog", (req, res)=>{
Blog.find({},(err, data)=>{
if(err){
    console.log(err);
}
    res.send(data);

});
});

//post a blog below 
app.post("/postBlog",(req, res)=>{
    const date = new Date();
    const [month, day, year] = [date.getMonth(), date.getDate(), date.getFullYear()];
    const title = req.body.title;
    const content = req.body.content;
    const dateCurrent = day+"/"+(month+1)+"/"+year;
    const id = uuidv4(); 
    
    const blogSave = new Blog({
        title: title,
        content:content,
        date:dateCurrent,
        id:id
    });

    blogSave.save((err)=>{
        if(err){
            res.send(err);
        }else{
            res.send("ok");
        }
    
       });
;
});

//delete a blog

app.post("/deleteBlog",(req,res)=>{
    const id = req.body.id;
    Blog.deleteOne({id:id},(err)=>{
        if(err){ res.send(err);}
        else{res.send("ok");} 
    });
});

app.listen(process.env.PORT ||3001,()=>{
console.log("server started at 3001");
});