//import the require dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
app.set('view engine', 'ejs');

//use cors to allow cross origin resource sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
//use cookie parser to parse request headers
app.use(cookieParser());
//use express session to maintain session data
app.use(session({
    secret              : 'cmpe_273_secure_string',
    resave              : false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized   : false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration            : 60 * 60 * 1000,    // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration      :  5 * 60 * 1000
}));

// app.use(bodyParser.urlencoded({
//     extended: true
//   }));
app.use(bodyParser.json());

//Allow Access Control
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
  });

  //Only user allowed is admin
var validUsers = [{
    "username" : "admin",
    "password" : "admin"
}];

var users = []

//Route to handle login Post Request Call
app.post('/login',function(req,res){
    console.log("Inside Login Post Request");
    console.log("Req Body : ",req.body);
    validUsers.filter(function(user){
        if(user.username === req.body.username && user.password === req.body.password){
            res.cookie('cookie',"admin",{maxAge: 900000, httpOnly: false, path : '/'});
            req.session.user = user;
            console.log("Session data", req.session.user);
            console.log("Successful");
            res.writeHead(200,{
                'Content-Type' : 'text/plain'
            })
            res.end("Successful Login");
        } else {
            console.log("Unsuccessful");
            res.writeHead(400,{
                'Content-Type' : 'text/plain'
            })
            res.end("UnSuccessful Login");
        }
    })
});

//Route to add Users
app.post('/create',function(req,res){
    console.log("In Create Post");
    if(req.session.user){
        console.log("Req Body : ", req.body);
        var newUser = {Name: req.body.Name, StudentID: req.body.StudentID, Department : req.body.Department};
        users.push(newUser);
        console.log("User Added Successfully!!!!");
        res.writeHead(200,{
            'Content-Type' : 'text/plain'
        })
        res.end("User Added");
    } else {
        console.log("Session Invalid");
        res.writeHead(400,{
            'Content-Type' : 'text/plain'
        })
        res.end("Session Invalid");
    }
});

//Route to get All users when user visits the Report Page
app.get('/list', function(req,res){
    console.log("Inside list users Login");    
    console.log("users list: ",JSON.stringify(users));
        res.writeHead(200,{
            'Content-Type' : 'text/plain'
        })
        res.end(JSON.stringify(users));
})

//Route to delete an user
app.delete('/delete/:id',function(req,res){
    console.log("In Delete Post");
    console.log("The user to be deleted is ", req.params.id);
    // The user to be deleted
    var id = req.params.id;
    var index = -1;
    // iterate over each element in the users array
    for (var i = 0; i < users.length; i++){
        // look for the entry with a matching user ID
        if (users[i].StudentID == id){
            //we found it
            index = i;
            break;
        }
    }
     
    if(index == -1){
        console.log("User Not Found");
        res.writeHead(400,{
            'Content-Type' : 'text/plain'
        })
        res.end("User not found");
    } else {
        users.splice(index, 1);
        console.log("User ID " + id + " was removed successfully");
        res.writeHead(200,{
            'Content-Type' : 'text/plain'
        })
        res.end(JSON.stringify(users));
    }
});

//start your server on port 5000
app.listen(5000);
console.log("Server Listening on port 5000");