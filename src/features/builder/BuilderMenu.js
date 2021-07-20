import React from 'react';
import { Segment, Header, Transition, Grid, Icon, Button } from 'semantic-ui-react';

import { SET_BUILD, OPEN_INFOFORM } from './Builder.types';

export const BuilderMenu = ({open, state, dispatch}) => {
    
    return (
        <Transition visible={open && state.dialogPage === 'menu'} animation='slide right' duration={{hide: 0, show: 500}}>
                <Segment style={{height: '100%'}}>
                    <Grid columns={3} style={{height: '100%'}}>
                        <Grid.Column textAlign='center' width={7} verticalAlign='middle'>
                            <Grid columns={1}>
                                <Grid.Column textAlign='center' verticalAlign='middle' style={{paddingBottom: '0px'}}>
                                <Header as='h2' icon textAlign='center'>
                                    <Icon name='file alternate outline' circular />
                                </Header>
                                </Grid.Column>
                                <Grid.Column textAlign='center' verticalAlign='top' style={{paddingTop: '0px'}}>
                                    <Button color='purple' as='a' content='Use a Template' onClick={() => {
                                        dispatch({type: SET_BUILD, buildType: 'template'})
                                        dispatch({type: OPEN_INFOFORM})
                                    }} />
                                </Grid.Column>
                            </Grid>
                            
                        </Grid.Column>
                        <Grid.Column width={2} textAlign='center' verticalAlign='middle'>
                                <Header style={{ color: '#5fa5d9'}} as='h3'>OR</Header>
                        </Grid.Column>
                        <Grid.Column textAlign='center' width={7} verticalAlign='middle'>
                            <Grid columns={1}>
                                    <Grid.Column textAlign='center' verticalAlign='middle' style={{paddingBottom: '0px'}}>
                                    <Header as='h2' icon textAlign='center'>
                                        <Icon name='object group outline' circular />
                                    </Header>
                                    </Grid.Column>
                                    <Grid.Column textAlign='center' verticalAlign='middle' style={{paddingTop: '0px'}}>
                                        <Button color='green' as='a' content='Build a Portfolio' onClick={() => {
                                            dispatch({type: SET_BUILD, buildType: 'manual'})
                                            dispatch({type: OPEN_INFOFORM})
                                        }} />
                                    </Grid.Column>
                                </Grid>
                            
                        </Grid.Column>
                    </Grid>
                </Segment>
            </Transition>
    )
}

export default BuilderMenu;