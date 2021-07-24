import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Header,
         Transition,
         Grid,
         Segment,
         Radio,
         Form,
         Button,
         Confirm } from 'semantic-ui-react';

import { openMenu, setReference, openForm, openTemplate } from 'features/builder/builderSlice';

export const BuilderInfoForm = ({ open }) => {
    const dispatch = useDispatch();
    const state = useSelector(state => state.builder);
    const { dialogPage } = state;
    const [ showExtraFields, setShowExtraFields ] = useState('')
    const [ resetConfirm, setResetConfirm ] = useState(false)

    const handleRadioChange = (e, { value }) => setShowExtraFields(value)

    useEffect(() => {
        if( dialogPage === 'menu') {
            setShowExtraFields('')
        }
    }, [dialogPage])

    return (
        <Transition visible={open && state.dialogPage === 'infoForm'} duration={{hide: 0, show: 500}}>
            <div style={{height: '100%'}}> 
            <Segment attached='top' style={{height: '100%'}}>
            <Grid columns={1}>
                <Grid.Column textAlign='left'>
                    <Header as='h4' className='builderHeader'>Please provide some basic information:</Header>
                </Grid.Column>
            </Grid>
            <Segment basic>
                <Form>
                    
                    <Grid columns={2}>
                        <Grid.Row>
                            <Grid.Column textAlign='right'>
                                <Form.Field>
                                    <label>Would you like to add a reference ID to your portfolio?</label>
                                </Form.Field>
                            </Grid.Column>
                            <Grid.Column>
                                <Form.Field>
                                    <Radio 
                                        label='No'
                                        name='radioGroup'
                                        value='no'
                                        checked={showExtraFields === 'no'}
                                        onChange={handleRadioChange} />
                                    
                                </Form.Field>
                                <Form.Field>
                                    <Radio 
                                        label='Yes'
                                        name='radioGroup'
                                        value='yes'
                                        checked={showExtraFields === 'yes'}
                                        onChange={handleRadioChange} />
                                </Form.Field>
                            </Grid.Column>
                        </Grid.Row>
                        <Transition visible={showExtraFields === 'yes'}
                        unmountOnHide
                        onHide={() => dispatch(setReference({referenceId: ''}))}>
                        <Grid.Row>
                            <Grid.Column textAlign='right'>
                                <Form.Field>
                                    <label>Reference ID:</label>
                                </Form.Field>
                            </Grid.Column>
                            <Grid.Column>
                                <Form.Input
                                    fluid
                                    type='text'
                                    name='referenceId'
                                    value={state.referenceId}
                                    onChange={(e, {value}) => dispatch(setReference({referenceId: value}))}
                                />
                            </Grid.Column>
                        </Grid.Row>
                        </Transition>
                    </Grid>
                </Form>
            </Segment>
            </Segment>
            <Segment attached>
                <Grid columns={2} >
                    <Grid.Column textAlign='left'>
                        <Button 
                            labelPosition='right'
                            content='Start Over'
                            icon='arrow left'
                            onClick={() => setResetConfirm(true)}
                            />
                            <Confirm
                                open={resetConfirm}
                                confirmButton='Reset Builder'
                                header='Are you sure?'
                                content='This action cannot be undone. Your configuration will be lost.'
                                onCancel={() => setResetConfirm(false)}
                                onConfirm={() => {
                                    setShowExtraFields('')
                                    setResetConfirm(false)
                                    dispatch(openMenu())
                                }}
                                />
                    </Grid.Column>
                    <Grid.Column textAlign='right'>
                        <Button 
                            labelPosition='left'
                            color='green'
                            content='Proceed'
                            icon='arrow right'
                            disabled={!showExtraFields || (showExtraFields === 'yes' && state.referenceId === '')}
                            onClick={() => {
                                if (state.buildType === 'template'){
                                    dispatch(openTemplate())
                                }
                                if (state.buildType === 'manual'){
                                    dispatch(openForm())
                                }
                            }}/>
                    </Grid.Column>
                </Grid>
                
            </Segment>
            </div>
        </Transition>
    )
}

export default BuilderInfoForm;