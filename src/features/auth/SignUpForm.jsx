import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearErrors } from "features/auth/authSlice";
// import {
//   signInWithEmailAndPassword,
//   signInWithGoogle,
// } from "firebase-utils/firebase";
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
  Label,
} from "semantic-ui-react";

function SignUpForm(props) {
  const { setOpen } = props;
  const dispatch = useDispatch();
  const [showError, setShowError] = useState(false);

  const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
  const mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");

  const signUpSchema = Yup.object({
    email: Yup.string().email("Invalid Email").required("Valid Email Required"),
    password: Yup.string().required("Password Required").min(8, 'Password must be a minimum of 8 characters').matches(mediumRegex.source, 'Please choose a stronger password.'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
    firstName: Yup.string().required('First Name Required'),
    lastName: Yup.string().required('Last Name Required')
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      // signInWithEmailAndPassword(values);
      document.getElementById("emailInput").focus();
      formik.resetForm();
    },
    validationSchema: signUpSchema,
  });
  
  // configure error attribute for Semantic UI
  const errorConfig = (msg, pointing) => {
    return {
      content: msg,
      pointing: pointing,
    };
  };

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
        <Grid>
          <Grid.Row columns={2} verticalAlign="middle">
            <Grid.Column mobile={16} tablet={8} widescreen={8} computer={8}>
              <Form className="attached fluid">
                <Segment basic>
                  <Grid>
                    <Grid.Row>
                      <Grid.Column>
                        <Header>Sign Up</Header>
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
                    content="Sign Up With Email"
                  />
                </div>
              </Form>
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

export default SignUpForm;