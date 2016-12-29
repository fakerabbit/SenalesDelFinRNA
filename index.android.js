/**
 * SenalesDelFin React Native App for Android
 * https://github.com/facebook/react-native
 * @flow
 */

 'use strict';

 import React from 'react';
 const ReactNative = require('react-native');

 const ListViewFeed = require('./ListViewFeed');
 const AboutView = require('./AboutView');
 const GoldNavHeaderBackBtn = require('./GoldNavHeaderBackBtn');

const {
  Component,
  PropTypes,
} = React;

const {
  AppRegistry,
  NavigationExperimental,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  WebView,
} = ReactNative;

const {
  CardStack: NavigationCardStack,
  Header: NavigationHeader,
  PropTypes: NavigationPropTypes,
  StateUtils: NavigationStateUtils,
} = NavigationExperimental;

// First Step.
// Define what app navigation state will look like.
function createAppNavigationState(): Object {
  return  {
    // Three tabs.
    tabs: {
      index: 0,
      routes: [
        {key: 'noticias'},
        {key: 'estudios'},
        {key: 'lectura'},
        {key: 'acerca'},
      ],
    },
    // Scenes for the `Noticias` tab.
    noticias: {
      index: 0,
      routes: [{key: 'Señales Del Fin'}],
      feedUrl: 'http://www.senalesdelfin.com/rss/',
    },
    // Scenes for the `Estudios` tab.
    estudios: {
      index: 0,
      routes: [{key: 'Señales Del Fin'}],
      feedUrl: 'http://estudialabiblia.co/feed/',
    },
    // Scenes for the `Lectura` tab.
    lectura: {
      index: 0,
      routes: [{key: 'Señales Del Fin'}],
      feedUrl: 'http://www.leelabiblia.co/rss/',
    },
    // Scenes for the 'Acerca' tab.
    acerca: {
      index: 0,
      routes: [{key: 'Señales Del Fin'}],
      feedUrl: 'about',
    },
  };
}

// Next step.
// Define what app navigation state shall be updated.
function updateAppNavigationState(
  state: Object,
  action: Object,
): Object {
  let {type} = action;
  if (type === 'BackAction') {
    type = 'pop';
  }

  switch (type) {
    case 'push': {
      // Push a route into the scenes stack.
      const route: Object = action.route;
      const {tabs} = state;
      const tabKey = tabs.routes[tabs.index].key;
      const scenes = state[tabKey];
      const nextScenes = NavigationStateUtils.push(scenes, route);
      if (scenes !== nextScenes) {
        return {
          ...state,
          [tabKey]: nextScenes,
        };
      }
      break;
    }

    case 'pop': {
      // Pops a route from the scenes stack.
      const {tabs} = state;
      const tabKey = tabs.routes[tabs.index].key;
      const scenes = state[tabKey];
      const nextScenes = NavigationStateUtils.pop(scenes);
      if (scenes !== nextScenes) {
        return {
          ...state,
          [tabKey]: nextScenes,
        };
      }
      break;
    }

    case 'selectTab': {
      // Switches the tab.
      const tabKey: string = action.tabKey;
      const tabs = NavigationStateUtils.jumpTo(state.tabs, tabKey);
      if (tabs !== state.tabs) {
        return {
          ...state,
          tabs,
        };
      }
    }
  }
  return state;
}

// Next step.
// Defines a helper function that creates a HOC (higher-order-component)
// which provides a function `navigate` through component props. The
// `navigate` function will be used to invoke navigation changes.
// This serves a convenient way for a component to navigate.
function createAppNavigationContainer(ComponentClass) {
  const key = '_yourAppNavigationContainerNavigateCall';

  class Container extends Component {
    static contextTypes = {
      [key]: PropTypes.func,
    };

    static childContextTypes = {
      [key]: PropTypes.func.isRequired,
    };

    static propTypes = {
      navigate: PropTypes.func,
    };

    getChildContext(): Object {
      return {
        [key]: this.context[key] || this.props.navigate,
      };
    }

    render(): React.Element {
      const navigate = this.context[key] || this.props.navigate;
      return <ComponentClass {...this.props} navigate={navigate} />;
    }
  }

  return Container;
}

export default class SenalesDelFinRNA extends Component {
  static propTypes = {
    onExampleExit: PropTypes.func,
  };

  // This sets up the initial navigation state.
  constructor(props, context) {
    super(props, context);
    // This sets up the initial navigation state.
    this.state = createAppNavigationState();
    this._navigate = this._navigate.bind(this);
  }

  render(): React.Element {
    // User your own navigator (see next step).
    return (
      <YourNavigator
        appNavigationState={this.state}
        navigate={this._navigate}
      />
    );
  }

  // This public method is optional. If exists, the UI explorer will call it
  // the "back button" is pressed. Normally this is the cases for Android only.
  handleBackAction(): boolean {
    return this._navigate({type: 'pop'});
  }

  // This handles the navigation state changes. You're free and responsible
  // to define the API that changes that navigation state. In this exmaple,
  // we'd simply use a `updateAppNavigationState` to update the navigation
  // state.
  _navigate(action: Object): void {
    if (action.type === 'exit') {
      // Exits the example. `this.props.onExampleExit` is provided
      // by the UI Explorer.
      this.props.onExampleExit && this.props.onExampleExit();
      return;
    }

    const state = updateAppNavigationState(
      this.state,
      action,
    );

    // `updateAppNavigationState` (which uses NavigationStateUtils) gives you
    // back the same `state` if nothing has changed. You could use
    // that to avoid redundant re-rendering.
    if (this.state !== state) {
      this.setState(state);
    }
  }
}

// Next step.
// Define your own controlled navigator.
const YourNavigator = createAppNavigationContainer(class extends Component {
  static propTypes = {
    appNavigationState: PropTypes.shape({
      noticias: NavigationPropTypes.navigationState.isRequired,
      estudios: NavigationPropTypes.navigationState.isRequired,
      lectura: NavigationPropTypes.navigationState.isRequired,
      acerca: NavigationPropTypes.navigationState.isRequired,
      tabs: NavigationPropTypes.navigationState.isRequired,
    }),
    navigate: PropTypes.func.isRequired,
  };

  // This sets up the methods (e.g. Pop, Push) for navigation.
  constructor(props: any, context: any) {
    super(props, context);
    this._back = this._back.bind(this);
    this._renderHeader = this._renderHeader.bind(this);
    this._renderScene = this._renderScene.bind(this);
  }

  // Now use the `NavigationCardStack` to render the scenes.
  render(): React.Element {
    const {appNavigationState} = this.props;
    const {tabs} = appNavigationState;
    const tabKey = tabs.routes[tabs.index].key;
    const scenes = appNavigationState[tabKey];

    return (
      <View style={styles.navigator}>
        <NavigationCardStack
          key={'stack_' + tabKey}
          onNavigateBack={this._back}
          navigationState={scenes}
          renderHeader={this._renderHeader}
          renderScene={this._renderScene}
          style={styles.navigatorCardStack}
        />
        <YourTabs
          navigationState={tabs}
        />
      </View>
    );
  }

  // Render the header.
  // The detailed spec of `sceneProps` is defined at `NavigationTypeDefinition`
  // as type `NavigationSceneRendererProps`.
  _renderHeader(sceneProps: Object): React.Element {
    return (
      <YourHeader
        {...sceneProps}
      />
    );
  }

  // Render a scene for route.
  // The detailed spec of `sceneProps` is defined at `NavigationTypeDefinition`
  // as type `NavigationSceneRendererProps`.
  _renderScene(sceneProps: Object): React.Element {
    const {appNavigationState} = this.props;
    const {tabs} = appNavigationState;
    const tabKey = tabs.routes[tabs.index].key;
    const scenes = appNavigationState[tabKey];
    const isAbout = scenes.feedUrl == 'about'? true : false;
    if (isAbout) {
      return (
        <AboutScene
          {...sceneProps}
        />
      );
    }
    else {
      return (
        <YourScene
          {...sceneProps}
          feedUrl={scenes.feedUrl}
        />
      );
    }
  }

  _back() {
    this.props.navigate({type: 'pop'});
  }
});

// Next step.
// Define your own header.
const YourHeader = createAppNavigationContainer(class extends Component {
  static propTypes = {
    ...NavigationPropTypes.SceneRendererProps,
    navigate: PropTypes.func.isRequired,
  };

  constructor(props: Object, context: any) {
    super(props, context);
    this._back = this._back.bind(this);
    this._renderTitleComponent = this._renderTitleComponent.bind(this);
    this._renderBackButtonComponent = this._renderBackButtonComponent.bind(this);
  }

  render(): React.Element {
    return (
      <NavigationHeader
        {...this.props}
        renderTitleComponent={this._renderTitleComponent}
        onNavigateBack={this._back}
        style={styles.header}
        renderLeftComponent={this._renderBackButtonComponent}
      />
    );
  }

  _back(): void {
    this.props.navigate({type: 'pop'});
  }

  _renderTitleComponent(props: Object): React.Element {
    return (
      <NavigationHeader.Title textStyle={styles.headerText}>
        {props.scene.route.key}
      </NavigationHeader.Title>
    );
  }

  _renderBackButtonComponent(props: Object): React.Element {
    if (props.scene.index === 0) {
        return null;
    }
    return (
        <GoldNavHeaderBackBtn
          onPress={this._back}
        />
      );
  }

});

// Next step.
// Define your own scene.
const YourScene = createAppNavigationContainer(class extends Component {
  static propTypes = {
    ...NavigationPropTypes.SceneRendererProps,
    navigate: PropTypes.func.isRequired,
  };

  constructor(props: Object, context: any) {
    super(props, context);
    this._exit = this._exit.bind(this);
    this._popRoute = this._popRoute.bind(this);
    this._pushRoute = this._pushRoute.bind(this);
    this.feedUrl = props.feedUrl;
  }

  render(): React.Element {
    const {navigationState} = this.props;
    const isListView = navigationState.index == 0;
    console.log(navigationState);
    if (isListView) {
      return (
        <ListViewFeed
          feedSource={this.feedUrl}
          pushRow={this._pushRoute}
        />
      );
    }
    else {
      const route = navigationState.routes[navigationState.index];
      const url = route.url ? route.url : '';
      return (
        <WebView
          source={{uri: url}}
          scalesPageToFit={true}
        />
      );
    }
  }

  renderIf(condition, content): void {
    if (condition) {
        return content;
    } else {
        return null;
    }
  }

  _pushRoute(title: string, rowUrl: string): void {
    // Just push a route with a new unique key.
    const route = {key: title, url: rowUrl}; //{key: '[' + this.props.scenes.length + ']-' + Date.now()};
    this.props.navigate({type: 'push', route});
  }

  _popRoute(): void {
    this.props.navigate({type: 'pop'});
  }

  _exit(): void {
    this.props.navigate({type: 'exit'});
  }
});

// Next step.
// Define your own tabs.
const YourTabs = createAppNavigationContainer(class extends Component {
  static propTypes = {
    navigationState: NavigationPropTypes.navigationState.isRequired,
    navigate: PropTypes.func.isRequired,
  };

  constructor(props: Object, context: any) {
    super(props, context);
  }

  render(): React.Element {
    return (
      <View style={styles.tabs}>
        {this.props.navigationState.routes.map(this._renderTab, this)}
      </View>
    );
  }

  _renderTab(route: Object, index: number): React.Element {
    return (
      <YourTab
        key={route.key}
        route={route}
        selected={this.props.navigationState.index === index}
      />
    );
  }
});

// Next step.
// Define your own Tab
const YourTab = createAppNavigationContainer(class extends Component {

  static propTypes = {
    navigate: PropTypes.func.isRequired,
    route: NavigationPropTypes.navigationRoute.isRequired,
    selected: PropTypes.bool.isRequired,
  };

  constructor(props: Object, context: any) {
    super(props, context);
    this._onPress = this._onPress.bind(this);
  }

  render(): React.Element {
    const style = [styles.tabText];
    let img = '';
    if (this.props.selected) {
      style.push(styles.tabSelected);
    }
    if (this.props.selected) {
      switch (this.props.route.key) {
        case 'noticias':
          img = require('./assets/images/news-icon@3x.png');
          break;
        case 'estudios':
          img = require('./assets/images/study-icon@3x.png');
          break;
        case 'lectura':
          img = require('./assets/images/read-icon@3x.png');
          break;
        case 'acerca':
          img = require('./assets/images/info-icon@3x.png');
          break;
        default:
          img = require('./assets/images/news-icon@3x.png');
      }
    }
    else {
      switch (this.props.route.key) {
        case 'noticias':
          img = require('./assets/images/news-icon-off@3x.png');
          break;
        case 'estudios':
          img = require('./assets/images/study-icon-off@3x.png');
          break;
        case 'lectura':
          img = require('./assets/images/read-icon-off@3x.png');
          break;
        case 'acerca':
          img = require('./assets/images/info-icon-off@3x.png');
          break;
        default:
          img = require('./assets/images/news-icon-off@3x.png');
      }
    }
    return (
      <TouchableOpacity style={styles.tab} onPress={this._onPress}>
        <Image source={img}  style={styles.tabImage} />
        <Text style={style}>
          {this.props.route.key}
        </Text>
      </TouchableOpacity>
    );
  }

  _onPress() {
    this.props.navigate({type: 'selectTab', tabKey: this.props.route.key});
  }
});

//
// About View Scene
//
const AboutScene = createAppNavigationContainer(class extends Component {
  static propTypes = {
    ...NavigationPropTypes.SceneRendererProps,
    navigate: PropTypes.func.isRequired,
  };

  constructor(props: Object, context: any) {
    super(props, context);
    this._exit = this._exit.bind(this);
    this._popRoute = this._popRoute.bind(this);
    this._pushRoute = this._pushRoute.bind(this);
  }

  render(): React.Element {
    return (
      <AboutView/>
    );
  }

  renderIf(condition, content): void {
    if (condition) {
        return content;
    } else {
        return null;
    }
  }

  _pushRoute(title: string, rowUrl: string): void {
    // Just push a route with a new unique key.
    const route = {key: title, url: rowUrl}; //{key: '[' + this.props.scenes.length + ']-' + Date.now()};
    this.props.navigate({type: 'push', route});
  }

  _popRoute(): void {
    this.props.navigate({type: 'pop'});
  }

  _exit(): void {
    this.props.navigate({type: 'exit'});
  }
});

const styles = StyleSheet.create({
  navigator: {
    flex: 1,
  },
  navigatorCardStack: {
    flex: 20,
  },
  tabs: {
    flex: 2,
    flexDirection: 'row',
  },
  tab: {
    alignItems: 'center',
    backgroundColor: '#333333',
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  tabText: {
    flex: 1,
    color: '#929292',
    fontWeight: '500',
  },
  tabSelected: {
    color: '#f0bf09',
  },
  tabImage: {
    height: 20,
    width: 20,
    marginTop: 8
  },
  header: {
    backgroundColor: '#333333',
  },
  headerText: {
    color: '#f0bf09',
    fontSize: 20,
    height: 30,
  },
});

AppRegistry.registerComponent('SenalesDelFinRNA', () => SenalesDelFinRNA);
