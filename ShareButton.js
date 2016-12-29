/**
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

const React = require('react');
const ReactNative = require('react-native');

const {
  I18nManager,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
} = ReactNative;

type Props = {
  onPress: Function,
};

const ShareButton = (props: Props) => (
  <TouchableOpacity style={styles.buttonContainer} onPress={props.onPress}>
    <Image style={styles.button} source={require('./assets/images/share-icon@2x.png')} />
  </TouchableOpacity>
);

ShareButton.propTypes = {
  onPress: React.PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    height: 24,
    width: 24,
    margin: Platform.OS === 'ios' ? 10 : 16,
    resizeMode: 'contain',
    transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
  }
});

module.exports = ShareButton;
