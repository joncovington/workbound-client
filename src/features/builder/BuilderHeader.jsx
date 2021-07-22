import React from 'react';
import { Segment, Header, Transition, Grid, Popup, Icon } from 'semantic-ui-react';

export const BuilderHeader = ({open, state, closeFn, resetFn}) => {
    
    return (
        <Transition visible={open} animation='slide down' duration={{hide: 0, show: 500}}>
            <Segment style={{ backgroundColor: '#5fa5d9'}}>
                <Grid columns={2}>
                    <Grid.Row>
                        <Grid.Column verticalAlign='bottom'>
                            <Header  inverted as='h4'>Build a Portfolio</Header>
                        </Grid.Column>
                        <Grid.Column textAlign='right'>
                            {
                                !state.openMenu
                                ? 
                                    <Popup content='Reset Builder'
                                        size='mini'
                                        position='bottom right'
                                        trigger={
                                        <Icon size='small'
                                        className='actionButton'
                                        circular
                                        flipped='horizontally'
                                        name='redo'
                                        onClick={() => resetFn()}/>}
                                    />
                                    : null
                            }
                            <Icon size='small'
                                className='actionButton'
                                circular
                                name='cancel'
                                onClick={() => closeFn()}
                            />
                            
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        </Transition>
    )
}

export default BuilderHeader;