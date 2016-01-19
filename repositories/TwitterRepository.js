'use strict';

const Twitter = require('../services/Twitter.js');
const _ = require('lodash');

var lookupRequest = function(token, secret, ids) {
  return new Promise((resolve, reject) => {
    var options = {
      user_id: ids.join(","),
      include_entities: false
    };

    Twitter.users("lookup", options, token, secret,
      (error, data, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
  });
}

module.exports = {
  lookupUserIds: function(user, ids) {
    return new Promise((resolve, reject) => {
      const token = user.twitter.accessToken;
      const secret = user.twitter.accessTokenSecret;

      var requests = [];
    	var numberOfRequests = Math.ceil( list.length / 100 );

      for (var i = 0; i < numberOfRequests; i++) {
        requests.push(lookupRequest(token, secret, ids.splice(100)));
      }

      Promise.all(requests).then((users) => {
        resolve(_.flatten(users));
      }, (error) => {
        reject(error);
      });
    });
  },
  getUserFollowersIds: function(user) {
    return new Promise((resolve, reject) => {
      const token = user.twitter.accessToken;
      const secret = user.twitter.accessTokenSecret;

      var result = [];
      var requestOptions = {
        count: 5000,
        cursor: -1
      };

      var iterate = () => {
        Twitter.followers('ids', requestOptions, token, secret,
          (error, data, response) => {
            if (error) {
              reject(error);
            } else {
              var ids = data.ids;
              cursor !== -1 && ids.shift();
              result = result.concat(ids);
              if (data.next_cursor === 0) {
                resolve(result);
              } else {
                requestOptions.cursor = data.next_cursor;
                iterate();
              }
            }
          });
      }

      iterate();
    });
  }
}
