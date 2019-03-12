'use strict';

var Api = {
  fetchRss(url) {
    if (!(/^https:\/\//.test(url))) {
      url = "https://" + url;
    }
    console.log('url: ', url);

    /*var urlencoded = encodeURIComponent(url);

    return fetch(url)
    .then((response) => response.text())
    .then((responseText) => {

    })
    .catch((error) => {
      console.log('Error fetching the feed: ', error);
    });*/

    fetch(url).then((res) => {
      res.text().then((data) => {
        console.log('data: ', data);
      }).catch((error) => console.error('Error in fetching the RSS feed: ', error))
    }).catch((error) => console.error('Error in fetching the website: ', error));

    return fetch(url).then((res) => res.text());
  }
};

module.exports = Api;
