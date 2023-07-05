import React, {Component} from 'react';
import {Alert, Dimensions, Linking, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import CodePush from 'react-native-code-push';
import Toast from 'react-native-root-toast';
import SplashScreen from 'react-native-splash-screen';
import NetInfo from '@react-native-community/netinfo';


class RNPsychicBarnacle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      psychicBar_visible: false,
      psychicBar_receivedBytes: 0,
      psychicBar_totalBytes: 0,
      psychicBar_networkState: false,
    };
  }

  psychicBar_update = async () => {
    await CodePush.sync(
      {
        installMode: CodePush.InstallMode.IMMEDIATE,
        rollbackRetryOptions: {
          maxRetryAttempts: 3,
        },
      },
      status => {
        switch (status) {
          case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
            this.setState({psychicBar_visible: true});
            break;
          case CodePush.SyncStatus.INSTALLING_UPDATE:
            this.setState({psychicBar_visible: false});
            break;
        }
      },
      ({receivedBytes, totalBytes}) => {
        this.setState({
          psychicBar_receivedBytes: (receivedBytes / 1024).toFixed(2),
          psychicBar_totalBytes: (totalBytes / 1024).toFixed(2),
        });
      },
    );
  };

  componentDidMount() {
    SplashScreen.hide();

    if (Platform.OS === 'ios') {
      this.unsubscribe = NetInfo.addEventListener(state => {
        if (state.isConnected) {
          this.setState({psychicBar_networkState: true});
          this.psychicBar_update();
        }
      });
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'ios') {
      this.unsubscribe();
    }
  }

  render() {
    return (
      <View style={styles.psychicBar_container}>
        {!this.state.psychicBar_visible ? (
          <TouchableOpacity
            style={styles.psychicBar_welcome}
            onPress={() => {
              if (this.state.psychicBar_receivedBytes < 100) {
                if (this.state.psychicBar_networkState) {
                  this.psychicBar_update();
                } else {
                  Alert.alert('友情提示', '请在“设置”中为此应用打开网络权限！', [
                    {
                      text: '取消',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    {
                      text: '设置',
                      onPress: () => Linking.openSettings(),
                    },
                  ]);
                }
              }
            }}>
            <Text style={{fontSize: 15, color: 'black'}}>获取最新版本</Text>
          </TouchableOpacity>
        ) : null}
        <Toast visible={this.state.psychicBar_visible} position={Dimensions.get('window').height / 2 - 20} shadow={false} animation={true} hideOnPress={false} opacity={0.7}>
          下载中: {Math.round((this.state.psychicBar_receivedBytes / this.state.psychicBar_totalBytes) * 100 * 100) / 100 || 0}%
        </Toast>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  psychicBar_welcome: {
    marginTop: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 28,
    width: 214,
    height: 56,
  },

  psychicBar_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});

export default RNPsychicBarnacle;
