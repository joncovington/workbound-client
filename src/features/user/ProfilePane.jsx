import React, { Fragment, useState } from "react";
import {
  Grid,
  Image,
  Button,
  Divider,
  TransitionablePortal,
  Placeholder,
  Modal,
} from "semantic-ui-react";

import EditProfileForm from "features/user/EditProfileImage";
import ProfileDetail from "features/user/ProfileDetail";

const ProfilePane = (props) => {
  const user = props.user;
  const [open, setOpen] = useState(false);

  return (
    <Fragment>
      <Grid celled="internally">
        <Grid.Row>
          <Grid.Column width={6} textAlign="center">
            {user.profile.image ? (
              <Image fluid src={user.profile.image} />
            ) : (
              <Fragment>
                <Placeholder fluid>
                  <small>Profile image not available.</small>
                  <Placeholder.Image square />
                  <small>
                    Click "<strong>Edit Image</strong>" below to upload your
                    profile image.
                  </small>
                </Placeholder>
              </Fragment>
            )}
            <Divider />
            <Button
              onClick={() => {
                setOpen(true);
              }}
              size="tiny"
            >
              Edit Image
            </Button>
          </Grid.Column>
          <Grid.Column width={10}>
            <ProfileDetail user={user} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <TransitionablePortal
        transition={{ animation: "fade up", duration: 500 }}
        open={open}
      >
        <Modal
          closeIcon
          size="tiny"
          open={true}
          dimmer="blurring"
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
        >
          <Modal.Header>Edit Image</Modal.Header>
          <Modal.Content>
            <EditProfileForm
              user={user}
              setOpen={setOpen}
            />
          </Modal.Content>
        </Modal>
      </TransitionablePortal>
    </Fragment>
  );
};

export default ProfilePane;
