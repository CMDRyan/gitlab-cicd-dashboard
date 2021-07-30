const getJobs = require("./getJobs");
const getToken = require("./getToken")
const getCookie = require("./getCookie")
const express = require("express");
const app = express();
const config = require('./config');
const {host, port, AppID, APP_SECRET} = config;
// const port = 8081;
// const host = `http://localhost:${port}`
const path = require("path");
// const AppID = "7c0c8e717c744b103b263ef8b89d17cc429e6cfab0cddb8b3df21b66e21b45c1";
// const APP_SECRET = "1bb0b4cf625557ee3260a756dc63bbc8544247dacd0685513fd9cf87e7f66afb";

app.use(express.static(path.join(__dirname)));

app.set("view engine", "ejs");

app.get("/redirect/:id", (req, res) => {
  res.redirect(
    `https://gitlab.com/oauth/authorize?` +
      `&client_id=${AppID}` +
      `&redirect_uri=http://${host}:${port}/redirect` +
      `&response_type=code` +
      `&state=${req.params.id}` +
      `&scope=profile+read_api`
  );
});

app.get("/redirect", (req, res) => {
  code = req.query.code 
  state = req.query.state
  getToken.getToken(AppID, code, APP_SECRET)
  .then(response => {
    res.cookie(`access_token`, response.access_token, {maxAge: 86400000})
    res.redirect(`http://${host}:${port}/groups/${state}/jobs`)
  })
})

app.get("/groups/:id/jobs", function (req, res) {
  const Token = getCookie.getCookie(req)
  if(!Token){
    res.redirect(`http://${host}:${port}/redirect/${req.params.id}`)
  }
  else{
  getJobs.getJobs(req.params.id, Token).then((data) =>
    res.render("pages/index", {
      created: data.filter((data) => data.status === "created"),
      pending: data.filter((data) => data.status === "pending"),
      running: data.filter((data) => data.status === "running"),
    })
  );
  }
});

app.listen(port, () => {
  console.log(`listening at ${host}:${port}`);
});
