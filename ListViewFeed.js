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
} = ReactNative;

var RSSFeedApi = require('./api/RssFeedApi');

var ListViewFeed = React.createClass({

  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds,
      feedSource: 'https://news.google.com/?output=rss',
    };
  },

  _data: [],

  _loadFeed: function() {
    console.log('LOAD FEED');
    //let {entries} = this.state;
    RSSFeedApi.fetchRss(this.props.feedSource).then((res) => {
          if (res.responseStatus == 200) {
            let entries = res.responseData.feed;
            //console.log(entries);
            this._onDataArrived(entries.entries);
          } else {
            console.log('FAILED FEED');
            console.log(res.responseDetails);
          }
        });
  },

  _onDataArrived(newData) {
    this._data = this._data.concat(newData);
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this._data)
    });
  },

  componentWillMount: function() {
    this._pressData = {};
    this._loadFeed();
  },

  render: function() {
    return (
      <ListView
        style={styles.list}
        dataSource={this.state.dataSource}
        renderRow={this._renderRow}
        renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
      />
    );
  },

  _renderRow: function(rowData: {}, sectionID: number, rowID: number, highlightRow: (sectionID: number, rowID: number) => void) {
    var title = rowData ? rowData.title : "no entry";
    var imgSource = rowData ? (rowData.mediaGroups[0].contents[0].medium == 'image' ? {uri: rowData.mediaGroups[0].contents[0].url} : require('./assets/images/feed-placeholder@2x.png')) : require('./assets/images/feed-placeholder@2x.png');
    return (
      <TouchableHighlight onPress={() => {
          this._pressRow(rowID);
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

  _pressRow: function(rowID: number) {
    /*this._pressData[rowID] = !this._pressData[rowID];
    this.setState({dataSource: this.state.dataSource.cloneWithRows(
      this._genRows(this._pressData)
    )});*/
  }

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
});

module.exports = ListViewFeed;
