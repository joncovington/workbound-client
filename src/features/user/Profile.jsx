import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Tab, Segment, Header, Message, Transition } from "semantic-ui-react";
import ProfilePane from "features/user/ProfilePane";
import PermissionList from "features/user/PermissionList";

function Profile(props) {
  const { open } = props;
  const user = useSelector((state) => state.user);
  const [successVisible, setSuccessVisible] = useState(false);

  const panes = [
    {
      menuItem: "Details",
      render: () => (
        <Tab.Pane as="div">
          <ProfilePane setSuccessVisible={setSuccessVisible} user={user} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Permissions",
      render: () => (
        <Tab.Pane as="div">
          <PermissionList user={user} />
        </Tab.Pane>
      ),
    },
  ];

  return (
    <div>
      <Transition
        visible={open}
        animation="fade down"
        duration={{ hide: 0, show: 500 }}
      >
        <Segment attached style={{ backgroundColor: "#5fa5d9" }}>
          <Header inverted as="h4">
            My Profile
          </Header>
        </Segment>
      </Transition>
      {successVisible ? (
        <Message
          attached
          positive
          onDismiss={() => setSuccessVisible(false)}
          header="Success"
          content="Profile updated."
        />
      ) : null}
      <Transition
        visible={open}
        animation="slide left"
        duration={{ hide: 0, show: 500 }}
      >
        <Tab menu={{ pointing: true }} panes={panes} />
      </Transition>
    </div>
  );
}

export default Profile;
