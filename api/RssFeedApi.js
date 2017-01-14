'use strict';

var Api = {
  fetchRss(url) {
    if (!(/^http:\/\//.test(url))) {
      url = "http://" + url;
    }

    /*var urlencoded = encodeURIComponent(url);

    return fetch(url)
    .then((response) => response.text())
    .then((responseText) => {

    })
    .catch((error) => {
      console.log('Error fetching the feed: ', error);
    });*/

    return fetch(url).then((res) => res.text());
  }
};

module.exports = Api;
