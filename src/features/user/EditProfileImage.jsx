import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { Grid, Image, Button, Form, Placeholder } from "semantic-ui-react";
import { updateProfile } from "features/user/userSlice";

const EditProfileForm = (props) => {
  const dispatch = useDispatch();
  const user = props.user;
  const [previewImage, setPreviewImage] = useState(user.profile.image);
  const [allowSubmit, setAllowSubmit] = useState(false);
  const setOpen = props.setOpen;

  const displayPreviewImage = (event) => {
    setPreviewImage(URL.createObjectURL(event.target.files[0]));
    setAllowSubmit(true);
  };

  const fileInputRef = useRef();

  const submit = (event) => {
    event.preventDefault();
    if (fileInputRef.current.files[0]) {
      var bodyFormData = new FormData();
      bodyFormData.append("image", fileInputRef.current.files[0]);
      dispatch(updateProfile(bodyFormData));
      props.setSuccessVisible(true);
      setOpen(false);
    }
  };

  return (
    <Form onSubmit={submit}>
      <Grid centered columns={2}>
        <Grid.Column>
          {previewImage ? (
            <Image size="medium" src={previewImage} />
          ) : (
            <Placeholder fluid>
              <Placeholder.Image square />
            </Placeholder>
          )}
        </Grid.Column>
        <Grid.Row>
          <Grid.Column textAlign="center">
            {" "}
            <Form.Field>
              <input
                ref={fileInputRef}
                onChange={displayPreviewImage}
                type="file"
                hidden
              />
            </Form.Field>
            <style>
              {`
                                        .chooseimg:hover {
                                            color: white !important;
                                            background-color: #2185d0 !important;
                                        }
                                        `}
            </style>
            <Button
              inverted
              className="chooseimg"
              content="Choose Image"
              labelPosition="left"
              icon="image"
              onClick={() => {
                fileInputRef.current.click();
              }}
              style={{ backgroundColor: " #5fa5d9" }}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16} textAlign="right">
            <Button
              type="submit"
              content="Set New Image"
              labelPosition="right"
              icon="check"
              positive
              onClick={submit}
              disabled={!allowSubmit}
            />
            <Button
              content="Cancel"
              labelPosition="right"
              icon="ban"
              onClick={() => setOpen(false)}
              negative
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Form.Group></Form.Group>
    </Form>
  );
};

export default EditProfileForm;
