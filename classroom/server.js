const express = require("express");
const app = express();
const users = require("./routes/user.js");  
const posts = require("./routes/post.js");
//const cookieParser = require("cookie-parser");  //require cookie-parser package
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//Express session - storing and using info
const sessionOptions = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true 
  };

  app.use(session(sessionOptions));
  app.use(flash());

  //connect-flash
  //using res.locals - better than connect-flash
  app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");  //pass flash messages directly in middlewares
    res.locals.errorMsg = req.flash("error");      //pass flash messages directly in middlewares
    next();
  });

  app.get("/register", (req, res) => {
    let { name = "anonymous"} = req.query;
    req.session.name = name;
    // console.log(req.session.name);
    // res.send(name);
    if(name === "anonymous") {
      req.flash("error", "user not registered");
    } else {
      req.flash("success", "user registered successfully!");
    }
  
    res.redirect("/hello");
  });

  app.get("/hello", (req, res) => {
    //res.send(`hello, ${req.session.name}`);
    //console.log(req.flash("success"));
    // res.locals.successMsg = req.flash("success");      //when use res.locals, flash messages are no need to render in page.ejs, directly pass in page.ejs file
    // res.locals.errorMsg = req.flash("error");
    res.render("page.ejs", {name: req.session.name });   
  });

//Exploring Express Options
// app.use(
//   session({ 
//     secret: "mysupersecretstring",
//     resave: false,
//     saveUninitialized: true 
//   })
// );

// app.get("/reqcount", (req, res) => {
//     if(req.session.count) {
//         req.session.count++;
//     } else {
//         req.session.count = 1;
//     }
//     res.send(`You send a request ${req.session.count} times`);
// });

//Express Sessions
// app.get("/test", (req, res) => {
//     res.send("test successful");
// });

// app.use(cookieParser("secreatcode"));                          //using cookieParser package

// //sending signed Cookies
// app.get("/getsignedcookie", (req, res) => {
//     res.cookie("made-In", "India", { signed: true });        //send signed cookie to browser from our server
//     res.send("signed cookie sent");
// });

// //verify signed cookies
// app.get("/verify", (req, res) => {
//     console.log(req.signedCookies);                       
//     res.send("verified");
// });

// //sending cookies
// app.get("/getcookies", (req, res) => {
//     res.cookie("greet", "namaste");              //send cookie in the form of name: value pair in borwser from our server
//     res.cookie("madeIn", "India");
//     res.send("sent you some cookie");
// });

// //cookie parser
// app.get("/greet", (req, res) => {
//     let { name  = "anonymous" } = req.cookies;   //access name from req.cookies  
//     res.send(`Hi, ${name}`);
// });

// //cookie parser
// app.get("/", (req, res) => {
//     console.dir(req.cookies);                 //parse(read) cookies from another route(/getcookies)
//     res.send("Hi, I am root!");
// });

// app.use("/users", users);                //using all users route here //  /users is a common route in user.js of all routes  // when request coming on routes in user.js, then after, request match with this /users(in server.js)
// app.use("/posts", posts);                // using all posts route here

app.listen(3000, () => {
    console.log("server is listening to 3000");
});