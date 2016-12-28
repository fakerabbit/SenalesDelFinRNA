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
  statics: {
    description: 'Performant, scrollable list of data.'
  },

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
        dataSource={this.state.dataSource}
        renderRow={this._renderRow}
        renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
        renderSeparator={this._renderSeparator}
      />
    );
  },

  _renderRow: function(rowData: {}, sectionID: number, rowID: number, highlightRow: (sectionID: number, rowID: number) => void) {
    var title = rowData ? rowData.title : "no entry";
    var imgSource = rowData ? (rowData.mediaGroups[0].contents[0].medium == 'image' ? {uri: rowData.mediaGroups[0].contents[0].url} : 0) : 0;
    return (
      <TouchableHighlight onPress={() => {
          this._pressRow(rowID);
          //highlightRow(sectionID, rowID);
        }}>
        <View>
          <View style={styles.row}>
            <Image style={styles.thumb} source={imgSource} />
            <Text style={styles.text}>
              {title}
            </Text>
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
  },

  _renderSeparator: function(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={{
          height: adjacentRowHighlighted ? 4 : 1,
          backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC',
        }}
      />
    );
  }
});

var styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#F6F6F6',
  },
  thumb: {
    width: 64,
    height: 64,
  },
  text: {
    flex: 1,
  },
  wrapper: {
    paddingTop: 20,
    paddingBottom: 15,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e9e9e9',
  },
  title: {
    paddingTop: 2,
    paddingBottom: 3,
    paddingRight: 15,
    fontWeight: 'bold',
    fontSize: 16,
  },
  description: {
    color: "#B4AEAE",
    fontSize: 12,
    marginBottom: 5,
  },
});

module.exports = ListViewFeed;
