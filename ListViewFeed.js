/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * The examples provided by Facebook are for non-commercial testing and
 * evaluation purposes only.
 *
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @flow
 */
'use strict';

var DOMParser = require('xmldom').DOMParser;
var React = require('react');
var ReactNative = require('react-native');
var {
  Image,
  ListView,
  TouchableHighlight,
  StyleSheet,
  RecyclerViewBackedScrollView,
  Text,
  View,
  ActivityIndicator,
} = ReactNative;

var RSSFeedApi = require('./api/RssFeedApi');

var ListViewFeed = React.createClass({

  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds,
      feedSource: '',
      pushRow: '',
    };
  },

  _data: [],
  _isLoading: false,
  _isAnimating: false,

  _loadFeed: function() {
    //console.log('LOAD FEED');
    this._isLoading = true;
    this._isAnimating = true;
    this._onLoading();
    fetch(this.props.feedSource).then((res) => {
      res.text().then((res) => {
        console.log('res: ', res);
        if (res) {
          try {
            this._isLoading = false;
            this._isAnimating = false;
            var doc = new DOMParser().parseFromString(res, 'text/xml');
            //console.log(doc.getElementsByTagName("title")[0].firstChild.nodeValue);
            var items = doc.getElementsByTagName('item');
            var titles = doc.getElementsByTagName('title');
            var links = doc.getElementsByTagName('link');
            var mediaThumbnail = doc.getElementsByTagName('media:thumbnail');
            var mediaContent = doc.getElementsByTagName('media:content');
            var objs = [];
            for (var i=1; i < titles.length; i++) {
              var title = titles[i].firstChild.nodeValue;
              if (title != "Estudia La Biblia" && title != "SEÑALES DEL FIN" && title != "Lee La Biblia") {
                objs.push({
                  title: titles[i].firstChild.nodeValue,
                  link: links[i].firstChild.nodeValue,
                  image: mediaThumbnail[i-1] 
                    ? mediaThumbnail[i-1].getAttribute('url') 
                    : mediaContent[i-2] 
                      ? mediaContent[i-2].getAttribute('url')
                      : mediaContent[i] 
                        ? mediaContent[i].getAttribute('url')
                        : null
                })
              }
            }
            this._onDataArrived(objs);
          }
          catch (e) {
            console.error('Error in parsing the feed: ', e);
          }
        } else {
            console.log('FAILED FEED');
            console.log(res.responseDetails);
            this._isAnimating = false;
            this._onError();
          }
      }).catch((error) => console.error('Error in fetching the RSS feed: ', error))
    }).catch((error) => console.error('Error in fetching the website: ', error));
  },

  _onDataArrived(newData) {
    this._data = this._data.concat(newData);
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this._data)
    });
  },

  _onLoading() {
    const data = {
      title: '...'
    };
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(data)
    });
  },

  _onNoData() {
    const data = {
      title: 'Error. Verifique que está conectado al internet.'
    };
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(data)
    });
  },

  _onError() {
    const data = {
      title: 'Hubo un error tratando de conectarse al servidor. Por favor intente más tarde.'
    };
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(data)
    });
  },

  componentWillMount: function() {
    this._loadFeed();
  },

  render: function() {
    if (this._isLoading) {
      return (
        <ListView
          style={styles.list}
          dataSource={this.state.dataSource}
          renderRow={this._renderRowAlternate}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
        />
      );
    }
    else {
      return (
        <ListView
          style={styles.list}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
        />
      );
    }
  },

  _renderRow: function(rowData: {}, sectionID: number, rowID: number, highlightRow: (sectionID: number, rowID: number) => void) {
    var title = rowData ? rowData.title : "title";
    var imgSource = rowData ? (rowData.image ? {uri: rowData.image} : require('./assets/images/feed-placeholder@2x.png')) : require('./assets/images/feed-placeholder@2x.png');
    var rowUrl = rowData ? (rowData.link ? rowData.link : 0) : 0;
    return (
      <TouchableHighlight onPress={() => {
          this._pressRow(title, rowUrl);
        }}>
        <View>
          <View style={styles.row}>
            <Image style={styles.thumb} source={imgSource}>
              <Image style={styles.shadow} source={require('./assets/images/feed-shadow@2x.png')} resizeMode='cover'>
                <Text style={styles.text}>
                  {title}
                </Text>
              </Image>
            </Image>
          </View>
        </View>
      </TouchableHighlight>
    );
  },

  _pressRow: function(title: string, rowUrl: string) {
    this.props.pushRow(title, rowUrl);
  },

  _renderRowAlternate: function(rowData: {}, sectionID: number, rowID: number, highlightRow: (sectionID: number, rowID: number) => void) {
    var title = rowData ? rowData : "title";
    return (
      <View>
        <View style={styles.loadingRow}>
          <ActivityIndicator
            size="large"
            color="#f0bf09"
            animating={this._isAnimating}
            style={styles.loadingIndicator}
          />
          <Text style={styles.loadingText}>
            {title}
          </Text>
        </View>
      </View>
    );
  },

});

var styles = StyleSheet.create({
  list: {
    backgroundColor: '#4b4a4a',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 5,
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: '#4b4a4a',
    height: 160,
  },
  thumb: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  shadow: {
    flex: 1,
    flexDirection: 'row',
  },
  text: {
    flex: 1,
    color: '#f0bf09',
    padding: 5,
    alignSelf: 'flex-end',
    fontSize: 18,
  },
  loadingRow: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#4b4a4a',
    height: 150,
  },
  loadingIndicator: {
    flex: 1,
    padding: 10,
  },
  loadingText: {
    flex: 2,
    color: '#f0bf09',
    fontSize: 18,
    padding: 10,
  },
});

module.exports = ListViewFeed;
