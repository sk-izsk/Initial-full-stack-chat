let express = require("express");
let cors = require("cors");
let multer = require("multer");
let upload = multer({
  dest: __dirname + "/uploads/"
});
let app = express();
let cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000"
  })
);
app.use("/images", express.static(__dirname + "/uploads"));

let passwords = {
  admin: "admin"
};
let sessions = {};
let messages = [];
let activeUser = [];
let bannedUser = {};

app.get("/messages", function(req, res) {
  res.send(JSON.stringify(messages));
});
app.get("/active", function(req, res) {
  res.send(JSON.stringify(activeUser));
});

app.post("/logout", function(req, res) {
  let userN = sessions[req.cookies["sid"]];
  let index = activeUser.findIndex(u => u.name === userN);

  activeUser.splice(index, 1);
});

app.post("/deleteuser", upload.none(), function(req, res) {
  let username = req.body.del;

  console.log("delete user", username);
  bannedUser[username] = true;
  messages.filter(x => {
    if (x.username) {
      return delete x.username;
    }
  });
  activeUser.filter(x => {
    if (x.name === username) {
      return delete x.name;
    }
  });
  delete passwords.username;
  delete sessions.sessionss;
  console.log("sessions : ", sessions);
  console.log("messages : ", messages);
  console.log("activeUser : ", activeUser);
  console.log("passwords : ", passwords);
});

app.post("/newmessage", upload.single("image"), (req, res) => {
  console.log("*** inside new message");
  console.log("body", req.body);

  let sessionId = req.cookies.sid;
  let username = sessions[sessionId];
  if (bannedUser[username]) {
    return res.send("banned");
  }
  if (!sessionId || !username) {
    return res.send("<p>get a life</p>");
  }
  console.log("username", username);
  let msg = req.body.msg;
  let newMsg = {
    username: username,
    message: msg,
    time: new Date().getSeconds()
  };
  console.log("new message", newMsg);
  if (req.file) {
    newMsg.imgPath = "http://localhost:4000/images/" + req.file.filename;
  }
  messages = messages.concat(newMsg);
  messages = messages.slice(-20);
  console.log("updated messages", messages);
  res.send(
    JSON.stringify({
      success: true
    })
  );
});

app.post("/login", upload.none(), (req, res) => {
  console.log("**** I'm in the login endpoint");
  console.log("this is the parsed body", req.body);
  let username = req.body.username;
  let enteredPassword = req.body.password;
  let expectedPassword = passwords[username];
  console.log("expected password", expectedPassword);
  if (bannedUser[username]) {
    return res.send("banned");
  }

  if (enteredPassword === expectedPassword) {
    console.log("password matches");
    // let sessionId = generateId();
    // console.log("generated id", sessionId);
    // sessions[sessionId] = username;
    // res.cookie("sid", sessionId);

    res.send(
      JSON.stringify({
        success: true,
        admin: username === "admin"
      })
    );
    let userActive = {
      name: username
      //time: (new Date()).getSeconds()
    };
    activeUser.push(userActive);
    console.log("active", activeUser);
    return;
  }

  res.send(
    JSON.stringify({
      success: false
    })
  );
});

app.post("/delete", upload.none(), (req, res) => {
  //let value = false
  // let del = true
  // if (del) {
  //   value = true;
  //   messages = [];
  // }
  let username = sessions[req.cookies.sid];
  messages = messages.filter(msg => msg.username !== username);
  res.send(
    JSON.stringify({
      success: true
    })
  );
});

let generateId = () => {
  return "" + Math.floor(Math.random() * 100000000);
};

app.post("/signup", upload.none(), (req, res) => {
  console.log("**** I'm in the signup endpoint");
  console.log("this is the body", req.body);
  let username = req.body.username;
  let enteredPassword = req.body.password;
  let sessionId = generateId();
  console.log("generated id", sessionId);
  sessions[sessionId] = username;
  res.cookie("sid", sessionId);
  if (passwords[username]) {
    return res.send(
      JSON.stringify({
        success: false
      })
    );
  }

  passwords[username] = enteredPassword;
  console.log("passwords object", passwords);
  let userActive = {
    name: username
    //time: (new Date()).getSeconds()
  };
  activeUser.push(userActive);
  res.send(
    JSON.stringify({
      success: true
    })
  );
});

app.get("/check-login", (req, res) => {
  let sessionId = req.cookies.sid; // 22
  let username = sessions[sessionId]; // 22
  if (username !== undefined) {
    res.send(JSON.stringify({ success: true }));
    return;
  }
  res.send(JSON.stringify({ success: false }));
});

app.listen(4000);

// hello
