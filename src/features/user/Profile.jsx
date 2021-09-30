import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Tab, Segment, Header, Transition } from "semantic-ui-react";
import ProfilePane from "features/user/ProfilePane";
import PermissionList from "features/user/PermissionList";

function Profile(props) {
  const user = useSelector((state) => state.user);
  const currentPath = useSelector((state) => state.router.location.pathname);
  const isPermFetched = useSelector((state) => state.user.isPermFetched);

  const panes = [
    {
      menuItem: "Details",
      render: () => (
        <Tab.Pane as="div">
          <ProfilePane user={user} />
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
        visible={currentPath === "/profile" && isPermFetched}
        animation="fade down"
        duration={{ hide: 0, show: 500 }}
      >
        <Segment attached style={{ backgroundColor: "#5fa5d9" }}>
          <Header inverted as="h4">
            My Profile
          </Header>
        </Segment>
      </Transition>
      <Transition
        visible={currentPath === "/profile" && isPermFetched}
        animation="fade down"
        duration={{ hide: 0, show: 500 }}
      >
        <Tab menu={{ pointing: true }} panes={panes} />
      </Transition>
    </div>
  );
}

export default Profile;
