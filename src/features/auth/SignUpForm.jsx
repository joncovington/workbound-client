import React, { useState, createRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { clearErrors } from "features/auth/authSlice";
import { addMessage } from "features/messages/messagesSlice";
import workboundApi from "api/workboundApi";
import { signUpWithEmailAndPassword } from "features/auth/authSlice";
import { signInWithGoogle } from "firebase-utils/firebase";
import ReCAPTCHA from "react-google-recaptcha";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Button,
  Form,
  Modal,
  TransitionablePortal,
  Grid,
  Segment,
  Divider,
  Header,
  Dimmer,
  Loader,
  Label
} from "semantic-ui-react";

function SignUpForm(props) {
  const currentPath = useSelector(state => state.router.location.pathname)
  const recaptchaRef = createRef();
  const dispatch = useDispatch();
  const [modalDim, setModalDim] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");

  // const strongRegex = new RegExp(
  //   "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
  // );
  const mediumRegex = new RegExp(
    "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})"
  );

  const signUpSchema = Yup.object({
    email: Yup.string().email("Invalid Email").required("Valid Email Required"),
    password: Yup.string()
      .required("Password Required")
      .min(8, "Password must be a minimum of 8 characters")
      .matches(mediumRegex.source, "Please choose a stronger password."),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Passwords must match"
    ),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: ({email, password}) => {
      workboundApi
        .post("user/recaptcha/", { recaptcha: captchaToken })
        .then((res) => {
          signUpWithEmailAndPassword({email, password})
            .then((res) => {
              dispatch(addMessage({'message': 'Account created successfully. Please check your email for account verification', 'messageType': 'positive'}))
              dispatch(push("/"))
            })
            .catch((err) => {
              dispatch(addMessage({'message': 'Oh no! Something went wrong creating your account.', 'messageType': 'negative'}))
              console.log(err)
              dispatch(push("/"))
            });
          console.log(res)
        })
        .catch((err) => {
          dispatch(addMessage({'message': 'Oh no! Something went wrong creating your account.', 'messageType': 'negative'}))
          console.log(err)
          dispatch(push("/"))
        });
        document.getElementById("emailInput").focus();    
    },
    validationSchema: signUpSchema,
  });

  const onCaptchaChange = () => {
    setCaptchaToken(recaptchaRef.current.getValue());
  };

  const onCaptchaExpired = () => {
    setCaptchaToken("");
  };

  // configure error attribute for Semantic UI
  const errorConfig = (msg, pointing) => {
    return {
      content: msg,
      pointing: pointing,
    };
  };

  const closeModal = () => {
    dispatch(push("/"));
    formik.resetForm();
    dispatch(clearErrors());
  }

  return (
    <TransitionablePortal
      transition={{ animation: "fade up", duration: 500 }}
      open={currentPath === "/signUp"}
    >
      <Modal
        onClose={closeModal}
        open={true}
        onUnmount={() => {
          setModalDim(false)
          formik.resetForm()
        }}
      >
        <Dimmer.Dimmable as={Grid}>
          <Dimmer inverted active={modalDim}>
            <Loader inverted />
          </Dimmer>
        <Label floating circular content='x'color='red' style={{'cursor': 'pointer'}} onClick={closeModal}/>
          <Grid.Row columns={2} verticalAlign="middle">
            <Grid.Column mobile={16} tablet={8} widescreen={8} computer={8}>
              <Form className="attached fluid">
                <Segment basic>
                  <Grid>
                    <Grid.Row>
                      <Grid.Column>
                        <Header>Create Account</Header>
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
                          disabled={formik.isSubmitting}
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
                          disabled={formik.isSubmitting}
                        />
                        <Form.Input
                          name="confirmPassword"
                          type="password"
                          icon="lock"
                          iconPosition="left"
                          label="Confirm Password"
                          placeholder="Confirm Password"
                          required
                          value={formik.values.confirmPassword}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.errors.confirmPassword &&
                            formik.touched.confirmPassword
                              ? errorConfig(
                                  formik.errors.confirmPassword,
                                  "above"
                                )
                              : null
                          }
                          disabled={formik.isSubmitting}
                        />
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={1} centered>
                      <Grid.Column width={12}>
                        <ReCAPTCHA
                          ref={recaptchaRef}
                          sitekey={
                            process.env.REACT_APP_RECAPTCHA_SITE_KEY || ""
                          }
                          onChange={onCaptchaChange}
                          onExpired={onCaptchaExpired}
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
                    textAlign: "center",
                  }}
                >
                  <Button
                    fluid
                    labelPosition="left"
                    icon="mail"
                    primary
                    type="submit"
                    onClick={() => {
                      setModalDim(true)
                      formik.handleSubmit()
                    }}
                    disabled={
                      !formik.isValid || formik.isSubmitting || !captchaToken
                        ? true
                        : false
                    }
                    loading={formik.isSubmitting}
                    content="Sign Up With Email"
                  />
                  <Header
                    as="h5"
                    style={{ marginTop: "3px", fontSize: ".68rem" }}
                  >
                    Already have an account? Sign in{" "}
                    <span
                      onClick={() => console.log("sign in")}
                      style={{ color: "#1b7ec8", cursor: "pointer" }}
                    >
                      HERE
                    </span>
                    .
                  </Header>
                </div>
              </Form>
            </Grid.Column>
            <Grid.Column mobile={16} tablet={8} widescreen={8} computer={8}>
              <Grid>
                <Grid.Row only="mobile">
                  <Grid.Column textAlign="center">
                    <Header as="h5">OR</Header>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row className="googleButtonRow">
                  <Grid.Column width={16}>
                    <Segment basic className="googleButtonSegment">
                      <Button
                        color="red"
                        fluid
                        labelPosition="left"
                        icon="google"
                        content="Sign In With Google"
                        onClick={signInWithGoogle}
                        disabled={formik.isSubmitting}
                        loading={formik.isSubmitting}
                      />
                    </Segment>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>
        </Dimmer.Dimmable>
        <Divider className="signInDivider" vertical>
          OR
        </Divider>
      </Modal>
    </TransitionablePortal>
  );
}

export default SignUpForm;
