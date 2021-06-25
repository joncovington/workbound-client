import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchToken } from 'features/auth/authSlice';

import { Button, Form, Message, Modal, TransitionablePortal } from 'semantic-ui-react';
import { useForm } from 'hooks'
import { validate } from 'validation'

function SignInForm(props) {
    const isSignedIn = useSelector(state => state.auth.isSignedIn);
    const authError = useSelector(state => state.auth.error);
    
    // initialize custom useForm hook
    const { inputs,
            setInputs,
            handleInputChange,
            handleSubmit,
            handleBlur,
            errors,
            isSubmitting } = useForm(submit, validate)

    const dispatch = useDispatch();

    const [showError, setShowError] = useState(false)
    const [allowSubmit, setAllowSubmit] = useState(false)
    
    // disable submit button and show auth errors
    useEffect(() => {
        if (authError || errors) {
            setShowError(true) 
            setAllowSubmit(false)
        } else {
            setShowError(false)
        }
    }, [authError, errors]);

    // redirect to root after successful sign in
    useEffect(() => {
        if (isSignedIn === true) {
            props.setOpen(false)
        }
        
    }, [isSignedIn, props])

    // Only allow submit if input values are defined and no errors exist
    useEffect(() => {
        if (
            inputs.email !== undefined
            && inputs.password !== undefined
            && Object.keys(errors).length === 0
            ) { 
                const { email, password } = inputs
                if(email.value && password.value) {
                    setAllowSubmit(true)
                } else {
                    setAllowSubmit(false)
                }
            };
    }, [inputs, setAllowSubmit, errors])

    // callback given to useForm handlechange
    function submit() {
        const emailVal = inputs.email.value
        const passwordVal = inputs.password.value
        setInputs({ email: {touched: false, value: ''}, password: {touched: false, value: ''}})
        dispatch(fetchToken({
        email: emailVal,
        password: passwordVal
        }));
         
    }

    // configure error attribute for Semantic UI
    const errorConfig = (msg, pointing) => {
        return {
            content: msg,
            pointing: pointing,
          }
    }

    // render Semantic UI components after auth fail
    const renderAuthError = () => {
        if (authError) {
            return (
            <Message error floating>
                <Message.Header>There were some errors with your submission</Message.Header>
                <Message.List>
                    <Message.Item>{authError.detail}</Message.Item>
                </Message.List>
            </Message>
            )
        }
        return null
    }

    return (
        <TransitionablePortal
            transition={{animation:'fade up', duration: 500}}
            open={props.open}
        >
        <Modal
            onClose={() => props.setOpen(false)}
            onOpen={() => props.setOpen(true)}
            open={true}
            dimmer='blurring'
      >
            {showError ? renderAuthError() : null}
            <Message attached>
                <Message.Header>Sign In</Message.Header>
            </Message>
            <Form className="attached fluid segment" >        
                <Form.Input
                    name='email'
                    icon='envelope'
                    iconPosition='left'
                    label='Email'
                    placeholder='Email Address'
                    required
                    value={
                        inputs.email
                        ? inputs.email.value
                        : ''}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    error={
                        errors.email && errors.email.touched
                        ? errorConfig(errors.email, 'below')
                        : null
                    }
                />
                <Form.Input
                    name='password'
                    type='password'
                    icon='lock'
                    iconPosition='left'
                    label='Password'
                    placeholder='Password'
                    required
                    value={
                        inputs.password
                        ? inputs.password.value
                        : ''}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    error={
                        errors.password
                        ? errorConfig(errors.password, 'above')
                        : null
                    }
                />
                <Button
                    primary 
                    onClick={handleSubmit}
                    disabled={ !allowSubmit ? true : false}
                    loading={ isSubmitting ? true : false}
                >Sign In</Button>
            </Form>
        </Modal>
        </TransitionablePortal>
    );
}

export default SignInForm;