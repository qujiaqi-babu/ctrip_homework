const UserInforPage = () => {
  return (
    <View style={sideMenuStyles.container}>
      <View
        style={{
          flex: 8,
          justifyContent: "flex-start",
          paddingLeft: 10,
          // backgroundColor: "#EAEDED",
        }}
      >
        <TouchableOpacity>
          <ListItem style={{ backgroundColor: "#E5E7E9" }}>
            <ListItem.Content style={sideMenuStyles.menuItem}>
              <Icon name="person-add-alt"></Icon>
              <ListItem.Title>发现好友</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </TouchableOpacity>
        <TouchableOpacity>
          <ListItem style={{ backgroundColor: "#E5E7E9" }}>
            <ListItem.Content style={sideMenuStyles.menuItem}>
              <Icon name="history"></Icon>
              <ListItem.Title>浏览记录</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </TouchableOpacity>
        <TouchableOpacity>
          <ListItem style={{ backgroundColor: "#E5E7E9" }}>
            <ListItem.Content style={sideMenuStyles.menuItem}>
              <Icon name="sim-card"></Icon>
              <ListItem.Title>免流量</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity>
          <ListItem style={{ backgroundColor: "#E5E7E9" }}>
            <ListItem.Content style={sideMenuStyles.menuItem}>
              <Icon name="eco"></Icon>
              <ListItem.Title>社区公约</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <TouchableOpacity>
          <View>
            <View
              style={{
                borderRadius: 100,
                backgroundColor: "#F8F9F9",
                padding: 5,
              }}
            >
              <Icon name="settings" color={"#2E4053"}></Icon>
            </View>
            <Text style={{ textAlign: "center" }}>设置</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View>
            <View
              style={{
                borderRadius: 100,
                backgroundColor: "#F8F9F9",
                padding: 5,
              }}
            >
              <Icon name="headset" color={"#2E4053"}></Icon>
            </View>
            <Text style={{ textAlign: "center" }}>帮助与客服</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View>
            <View
              style={{
                borderRadius: 100,
                backgroundColor: "#F8F9F9",
                padding: 5,
              }}
            >
              <Icon name="qr-code-scanner" color={"#2E4053"}></Icon>
            </View>
            <Text style={{ textAlign: "center" }}>扫一扫</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default UserInforPage;
