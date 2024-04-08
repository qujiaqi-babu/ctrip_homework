import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Overlay,
  TextInput,
} from "react-native";
// import CheckBox from "@react-native-community/checkbox";
import { Button, Icon, Text, Image } from "@rneui/themed";
// import { CheckBox } from "@rneui/base";
import { useNavigation } from "@react-navigation/native";

import {
  api,
  storeDataToAS,
  removeValueFromAS,
  getItemFromAS,
} from "../../util";

const Toast = Overlay.Toast;

const Login = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [checked, setChecked] = useState(false);

  const handleInputUsername = (text) => {
    setUsername(text);
  };
  const handleInputPassword = (text) => {
    setPassword(text);
  };
  const handleCheck = () => {
    if (username == null) {
      setErrorMessage("用户名不能为空");
    } else if (username == null) {
      setErrorMessage("密码");
    } else if (checked == false) {
      setErrorMessage("请先阅读并勾选用户协议");
    } else {
      setErrorMessage("");
      return true;
    }
    return false;
  };
  const handleLogin = async () => {
    // console.log("处理登录");
    if (handleCheck()) {
      await api
        .post(
          "/login/login", // 虚拟机不能使用localhost
          {
            username: username,
            password: password,
          }
        )
        .then(async (res) => {
          // console.log("提交成功:", res.data.message);
          console.log(res.data.data.token);
          console.log(res.data.data.userInfo);
          await storeDataToAS("token", res.data.data.token);
          await storeDataToAS(
            "userInfo",
            JSON.stringify(res.data.data.userInfo)
          );
          api.interceptors.request.use(
            (config) => {
              config.interceptors = "AddAuthorizationToken";
              const token = res.data.data.token;
              if (token) {
                config.headers.Authorization = `${token}`;
              }
              return config;
            },
            (error) => {
              return Promise.reject(error);
            }
          );
          navigation.navigate("Home");
        })
        .catch((err) => {
          // console.log(username);
          // console.log(password);
          console.log(err);
          console.log("提交失败:", err.response.data.message);
          setErrorMessage(err.response.data.message);
        });
    }
  };

  // const [checked, setChecked] = React.useState(true);
  // const toggleCheckbox = () => setChecked(!checked);
  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        alignItems: "stretch",
        justifyContent: "flex-start",
      }}
    >
      <View style={styles.inputContainer}>
        <Icon name="perm-identity" size={25}></Icon>
        <TextInput
          value={username}
          onChangeText={handleInputUsername}
          style={styles.inputStyle}
          placeholder="请输入用户名"
        />
        <TouchableOpacity
          onPress={() => {
            setUsername("");
          }}
        >
          <Icon name="close"></Icon>
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock-outline" size={25}></Icon>
        <TextInput
          value={password}
          style={styles.inputStyle}
          placeholder="请输入密码"
          onChangeText={handleInputPassword}
          secureTextEntry={true}
        />
        <TouchableOpacity
          onPress={() => {
            setPassword("");
          }}
        >
          <Icon name="close"></Icon>
        </TouchableOpacity>
      </View>
      <View style={{ alignItems: "center" }}>
        <Text style={{ color: "red" }}>{errorMessage}</Text>
      </View>
      <View style={{ width: "100%", alignItems: "center" }}>
        <Button
          title="微信登录"
          loading={false}
          loadingProps={{ size: "small", color: "white" }}
          buttonStyle={{
            backgroundColor: "#1874CD",
            borderRadius: 30,
            // flex: 1,
          }}
          titleStyle={{ fontWeight: "bold", fontSize: 23 }}
          containerStyle={{
            marginHorizontal: 50,
            height: 50,
            width: "100%",
            marginVertical: 10,
          }}
          onPress={handleLogin}
        >
          <Text style={{ fontSize: 18, color: "#FFF" }}>登录</Text>
        </Button>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <Text
          style={{
            textAlign: "center",
            fontSize: 16,
            color: "midnightblue",
          }}
        >
          其他登录方式
        </Text>
        <Icon name="chevron-right" color="#000" />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setChecked(!checked);
          }}
        >
          {checked ? (
            <Icon containerStyle={{}} name="check-box" color="red" />
          ) : (
            <Icon
              containerStyle={{}}
              name="check-box-outline-blank"
              color="#000"
            />
          )}
        </TouchableOpacity>

        <Text style={{ color: "#778899" }}>我已阅读并同意</Text>
        <TouchableOpacity>
          <Text>《用户协议》</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const Register = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [secondPassword, setSecondPassword] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [checked, setChecked] = useState(false);
  const handleInputUsername = (text) => {
    setUsername(text);
  };
  const handleInputPassword = (text) => {
    setPassword(text);
  };
  const handleInputSecondPassword = (text) => {
    setSecondPassword(text);
  };
  const handleTotalCheck = () => {
    if (username == null) {
      setErrorMessage("用户名不能为空");
    } else if (password == null) {
      setErrorMessage("密码不能为空");
    } else if (secondPassword != password) {
      setErrorMessage("两次输入的密码不一致");
    } else if (checked == false) {
      setErrorMessage("请先阅读并勾选用户协议");
    } else {
      setErrorMessage("");
      return true;
    }
    return false;
  };
  const handleCheck = () => {
    if (secondPassword == password) {
      setErrorMessage("");
    } else {
      setErrorMessage("两次输入的密码不一致");
    }
  };
  const handleReigster = async () => {
    if (handleTotalCheck()) {
      await api
        .post(
          "/login/register", // 虚拟机不能使用localhost
          {
            username: username,
            password: password,
          }
        )
        .then((res) => {
          console.log("提交成功:", res.data.message);
          // 提交成功后跳转到我的游记页面，并刷新
          navigation.navigate("Login");
        })
        .catch((err) => {
          console.log("提交失败:", err.response.data.message);
          setErrorMessage(err.response.data.message);
        });
    }
  };

  // const [checked, setChecked] = React.useState(true);
  // const toggleCheckbox = () => setChecked(!checked);
  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        alignItems: "stretch",
        justifyContent: "flex-start",
      }}
    >
      <View style={styles.inputContainer}>
        <Icon name="perm-identity" size={25}></Icon>
        <TextInput
          value={username}
          style={styles.inputStyle}
          placeholder="请输入用户名"
          onChangeText={handleInputUsername}
        />
        <TouchableOpacity
          onPress={() => {
            setUsername("");
          }}
        >
          <Icon name="close"></Icon>
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock-outline" size={25}></Icon>
        <TextInput
          value={password}
          style={styles.inputStyle}
          placeholder="请输入密码"
          onChangeText={handleInputPassword}
          secureTextEntry={true}
        />
        <TouchableOpacity
          onPress={() => {
            setPassword("");
          }}
        >
          <Icon name="close"></Icon>
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock-outline" size={25}></Icon>
        <TextInput
          value={secondPassword}
          style={styles.inputStyle}
          placeholder="请再次输入密码"
          onChangeText={handleInputSecondPassword}
          onBlur={handleCheck}
          secureTextEntry={true}
        />
        <TouchableOpacity
          onPress={() => {
            setSecondPassword("");
          }}
        >
          <Icon name="close"></Icon>
        </TouchableOpacity>
      </View>
      <View style={{ alignItems: "center" }}>
        <Text style={{ color: "red" }}>{errorMessage}</Text>
      </View>

      <View
        style={{
          width: "100%",
          alignItems: "center",
        }}
      >
        <Button
          title="微信登录"
          loading={false}
          loadingProps={{ size: "small", color: "white" }}
          buttonStyle={{
            backgroundColor: "#1874CD",
            borderRadius: 30,
            // flex: 1,
          }}
          titleStyle={{ fontWeight: "bold", fontSize: 23 }}
          containerStyle={{
            marginHorizontal: 50,
            height: 60,
            width: "100%",
            marginVertical: 10,
          }}
          onPress={handleReigster}
        >
          <Text style={{ textAlign: "center", fontSize: 18, color: "#FFF" }}>
            注册
          </Text>
        </Button>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setChecked(!checked);
          }}
        >
          {checked ? (
            <Icon containerStyle={{}} name="check-box" color="red" />
          ) : (
            <Icon
              containerStyle={{}}
              name="check-box-outline-blank"
              color="#000"
            />
          )}
        </TouchableOpacity>

        <Text style={{ color: "#778899" }}>我已阅读并同意</Text>
        <TouchableOpacity>
          <Text>《用户协议》</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function RegisterScreen({ route }) {
  const { type } = route.params;
  return (
    <View style={{ flex: 1 }}>
      {type === "register" ? <Register /> : <Login />}
    </View>
  );
}
const styles = StyleSheet.create({
  image: {
    width: 250,
    height: 250,
    resizeMode: "contain", // 控制图片的缩放模式
  },
  inputContainer: {
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    padding: 10,
    backgroundColor: "#EEE",
  },
  inputStyle: { height: 40, width: "80%", marginLeft: 5, fontSize: 20 },
});
