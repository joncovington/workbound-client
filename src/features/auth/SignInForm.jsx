import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors } from "features/auth/authSlice";
import {
  signInWithEmailAndPassword,
  signInWithGoogle,
} from "firebase-utils/firebase";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Button,
  Form,
  Message,
  Modal,
  TransitionablePortal,
  Grid,
  Segment,
  Divider,
  Header,
} from "semantic-ui-react";

import "./SignInForm.styles.css";

function SignInForm(props) {
  const { setOpen } = props;
  const { isSignedIn, error: authError } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [showError, setShowError] = useState(false);
  const [signInError, setSignInError] = useState("");

  const signInSchema = Yup.object().shape({
    email: Yup.string().email("Invalid Email").required("Valid Email Required"),
    password: Yup.string().required("Password Required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      signInWithEmailAndPassword(values);
      document.getElementById("emailInput").focus();
      formik.resetForm();
    },
    validationSchema: signInSchema,
  });

  // configure error attribute for Semantic UI
  const errorConfig = (msg, pointing) => {
    return {
      content: msg,
      pointing: pointing,
    };
  };

  useEffect(() => {
    if (authError.signIn) {
      setSignInError(authError?.signIn);
      setShowError(true);
    } else {
      setSignInError("");
      setShowError(false);
    }
  }, [authError, signInError, formik]);

  useEffect(() => {
    if (isSignedIn) {
      setOpen(false);
    }
  }, [isSignedIn, setOpen]);

  return (
    <TransitionablePortal
      transition={{ animation: "fade up", duration: 500 }}
      open={props.open}
    >
      <Modal
        onClose={() => {
          setOpen(false);
          formik.resetForm();
          dispatch(clearErrors());
        }}
        open={true}
        dimmer="blurring"
      >
        {" "}
        {showError ? (
          <Message attached negative>
            <Message.Header>
              There were some errors with your submission
            </Message.Header>
            <Message.List>
              <Message.Item>{signInError}</Message.Item>
            </Message.List>
          </Message>
        ) : null}
        <Grid>
          <Grid.Row columns={2} verticalAlign="middle">
            <Grid.Column mobile={16} tablet={8} widescreen={8} computer={8}>
              <Form className="attached fluid">
                <Segment basic>
                  <Grid>
                    <Grid.Row>
                      <Grid.Column>
                        <Header>Sign In</Header>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Column width={16}>
                        <Form.Input
                          id="emailInput"
                          name="email"
                          icon="envelope"
                          iconPosition="left"
                          label="Email"
                          placeholder="Email Address"
                          required
                          value={formik.values.email}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.errors.email && formik.touched.email
                              ? errorConfig(formik.errors.email, "below")
                              : null
                          }
                        />
                        <Form.Input
                          name="password"
                          type="password"
                          icon="lock"
                          iconPosition="left"
                          label="Password"
                          placeholder="Password"
                          required
                          value={formik.values.password}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.errors.password && formik.touched.password
                              ? errorConfig(formik.errors.password, "above")
                              : null
                          }
                        />
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Segment>
                <div
                  style={{
                    paddingRight: "4em",
                    paddingLeft: "4em",
                    paddingBottom: "1em",
                  }}
                >
                  <Button
                    fluid
                    labelPosition="left"
                    icon="mail"
                    primary
                    type="submit"
                    onClick={formik.handleSubmit}
                    disabled={
                      !formik.isValid || formik.isSubmitting ? true : false
                    }
                    loading={formik.isSubmitting ? true : false}
                  content='Sign In With Email'
                  />
                </div>
              </Form>
            </Grid.Column>
            <Grid.Column mobile={16} tablet={8} widescreen={8} computer={8}>
              <Grid>
                <Grid.Row only="mobile">
                  <Grid.Column textAlign="center">
                    <Header as='h5'>OR</Header>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row className='googleButtonRow'>
                  <Grid.Column width={16}>
                    <Segment
                      basic
                      className='googleButtonSegment'
                    >
                      <Button
                        color="red"
                        fluid
                        labelPosition="left"
                        icon="google"
                        content="Sign In With Google"
                        onClick={signInWithGoogle}
                      />
                    </Segment>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Divider className="signInDivider" vertical>
          OR
        </Divider>
      </Modal>
    </TransitionablePortal>
  );
}

export default SignInForm;
