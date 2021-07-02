import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Container, Label, Grid, Segment } from 'semantic-ui-react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

import { updateProfile } from './userSlice';

import { useForm } from 'hooks';
import { validateProfile } from 'validation';


const ProfileDetail = (props) => {
    const {first_name, last_name, phone} = props.user.profile;
    const firstName = first_name;
    const lastName = last_name;
    const initialPhoneValue = phone;
    const [phoneValue, setPhoneValue] = useState()
    const [phoneError, setPhoneError] = useState(false)

    const { inputs,
        setInputs,
        handleInputChange,
        handleSubmit,
        handleBlur,
        errors,
        isSubmitting } = useForm(submit, validateProfile)

    const dispatch = useDispatch();

    const [allowSubmit, setAllowSubmit] = useState(false)
    
    function submit() {
        var bodyFormData = new FormData()
        if (inputs.firstName.touched && inputs.firstName.value !== first_name) {
            bodyFormData.append('first_name', inputs.firstName.value)
        }
        if (inputs.lastName.touched && inputs.lastName.value !== last_name) {
            bodyFormData.append('first_name', inputs.lastName.value)
        }
        if (inputs.phone.touched && inputs.phone.value !== phone) {
            bodyFormData.append('phone', inputs.phone.value)
        }
        dispatch(updateProfile(bodyFormData))
        props.setSuccessVisible(true)
        
    }

    const errorConfig = (msg, pointing) => {
        return {
            content: msg,
            pointing: pointing,
          }
    }

    useEffect(() => {
        // Set initial 
        if(firstName || lastName) {
            setInputs(inputs => ({ ...inputs, firstName: {touched: false, value: firstName}, lastName: {touched: false, value: lastName} }))
        }
        if(initialPhoneValue !== null && initialPhoneValue !== undefined) {
            setPhoneValue(initialPhoneValue)
        }
        setAllowSubmit(false)
    }, [firstName, lastName, initialPhoneValue, setPhoneValue, setInputs])

    useEffect(() => {

    })

    useEffect(() => {
        if (phoneValue !== undefined && phoneValue !== null) {
            if (!isValidPhoneNumber(phoneValue)) {
                setPhoneError(true)
            } else {
                setPhoneError(false)
                setInputs(inputs => ({ ...inputs, phone: {touched: false, value: phoneValue} }))
            }
        }
        if (initialPhoneValue !== phoneValue) {
            setInputs(inputs => ({ ...inputs, phone: {touched: true, value: phoneValue} }))
        }
    }, [initialPhoneValue, phoneValue, setPhoneError, setInputs])

    useEffect(() => {
        if(Object.values(inputs).length > 0){
            if(
                (inputs.firstName.touched
                || inputs.lastName.touched
                || inputs.phone.touched)
                && Object.keys(errors).length === 0
            ) {
                setAllowSubmit(true)
            } else {
                setAllowSubmit(false)
            }
        }
    }, [inputs, errors])

    return (
        <Container fluid>
            <Form>
                <Form.Group>
                    <Form.Input
                        size='small'
                        width={8}
                        name='firstName'
                        label='First Name'
                        value={
                            inputs.firstName
                            ? inputs.firstName.value
                            : ''}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        error={
                            errors.firstName && inputs.firstName.touched
                            ? errorConfig(errors.firstName, 'above')
                            : null
                        }
                    />
                    <Form.Input
                        size='small'
                        width={8}
                        name='lastName'
                        label='Last Name'
                        value={
                            inputs.lastName
                            ? inputs.lastName.value
                            : ''}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        error={
                            errors.lastName && inputs.lastName.touched
                            ? errorConfig(errors.lastName, 'above')
                            : null
                        }
                    />
                </Form.Group>
                    <Grid>
                        <Grid.Column width={16} stretched>
                            <Segment basic>
                                <Form.Field error={phoneError}>
                                    <PhoneInput
                                        name='phone'
                                        defaultCountry="US"
                                        placeholder='Enter Phone Number'
                                        value={phoneValue}
                                        onChange={setPhoneValue}
                                        onBlur={handleBlur}
                                    />
                                    {phoneError
                                        ? <Label prompt pointing>
                                        Please enter a valid phone number
                                        </Label>
                                        : null}
                                </Form.Field>
                            </Segment>
                        </Grid.Column>
                    </Grid>
                <Form.Button
                    onClick={handleSubmit}
                    loading={ isSubmitting ? true : false}
                    size='tiny'
                    disabled={!allowSubmit}
                    floated='right'
                    content='Update Profile'
                />
            </Form>
        </Container>
    )
}

export default ProfileDetail;