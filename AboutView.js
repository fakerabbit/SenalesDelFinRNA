'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
  Image,
  ScrollView,
  TouchableHighlight,
  StyleSheet,
  Text,
  View,
  Linking,
} = ReactNative;

var AboutView = React.createClass({

  getInitialState: function() {
    return {
      ds: [
        {
          title: 'Para mayor información:',
        },
        {
          title: 'EstudiaLaBiblia.co',
          url: 'https://estudialabiblia.co',
          img: 0,
        },
        {
          title: 'LeeLaBiblia.co',
          url: 'https://leelabiblia.co',
          img: 1,
        },
        {
          title: 'SenalesDelFin.com',
          url: 'https://www.senalesdelfin.com',
          img: 2,
        },
        {
          title: 'Otros estudios importantes:',
        },
        {
          title: 'Estudio del Santuario',
          url: 'https://estudiosadventistas.files.wordpress.com/2016/05/ministeriosacerdotalcelestialcristo.pdf',
          img: 3,
        },
        {
          title: 'Estudio de Daniel',
          url: 'https://estudialabiblia.co/2015/12/11/estudio-completo-del-libro-de-daniel/',
          img: 4,
        },
        {
          title: 'La ley ceremonial',
          url: 'https://estudialabiblia.co/2015/09/19/estudio-completo-de-las-fiestas-y-los-sabados-ceremoniales/',
          img: 5,
        },
      ],
    };
  },

  componentWillMount: function() {
  },

  render: function() {
    const {ds} = this.state;
    return (
      <ScrollView style={styles.scroll}>
        {ds.map(this._renderRow)}
      </ScrollView>
    );
  },

  _renderRow: function(data: {}, i: number) {
    const hasData = data.url ? true : false;
    if (hasData) {
      let imgSource = './assets/images/estudiosadv-icon@2x.jpg';
      switch (data.img) {
        case 0:
          imgSource = require('./assets/images/estudiosadv-icon@2x.jpg');
          break;
        case 1:
          imgSource = require('./assets/images/lee-icon@2x.jpg');
          break;
        case 2:
          imgSource = require('./assets/images/fin-icon@2x.png');
          break;
        case 3:
          imgSource = require('./assets/images/santuario-icon@2x.png');
          break;
        case 4:
          imgSource = require('./assets/images/daniel-icon@2x.png');
          break;
        case 5:
          imgSource = require('./assets/images/fiestas-icon@2x.png');
          break;
        default:
          imgSource = require('./assets/images/estudiosadv-icon@2x.jpg');
      }
      return (
        <TouchableHighlight key={i} onPress={() => {
            this._pressRow(data.url);
          }}>
          <View style={styles.row}>
            <Image style={styles.thumb} source={imgSource} />
            <Text style={styles.text}>{data.title}</Text>
          </View>
        </TouchableHighlight>
      );
    }
    else {
      return (
        <View key={i} style={styles.header}>
          <Text style={styles.title}>{data.title}</Text>
        </View>
      );
    }
  },

  _pressRow: function(dataUrl: string) {
    Linking.openURL(dataUrl).catch(err => console.error('An error occurred opening About url.', err));
  }

});

var styles = StyleSheet.create({
  scroll: {
    backgroundColor: '#4b4a4a',
  },
  header: {
    height: 60,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingTop: 5,
    paddingLeft: 5,
    paddingRight: 5,
    height: 100,
    overflow: 'hidden',
  },
  thumb: {
    height: 100,
    width: 100,
    overflow: 'hidden',
    padding: 5
  },
  text: {
    flex: 2,
    color: '#f0bf09',
    alignSelf: 'center',
    fontSize: 18,
    paddingLeft: 10,
  },
  title: {
    color: '#f0bf09',
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center'
  },
});

module.exports = AboutView;
