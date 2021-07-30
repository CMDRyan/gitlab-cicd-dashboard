const fetch = require("node-fetch");
var request = require('request');
const fs = require('fs')

exports.getToken = function getToken(clientId, code, clientSecret) {

var params = {
  method: 'POST',
  headers: {
     "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
  },
};
return fetch(
        `https://gitlab.com/oauth/token?` +
        `&client_id=${clientId}` +
        `&grant_type=authorization_code` +
        `&code=${code}` +
        `&client_secret=${clientSecret}` +
        `&redirect_uri=http://localhost:8081/redirect`, params )
  .then(response => response.json())
//   .then(result => {
//       return result
//  })
  .catch(error => console.log('error', error));
}
