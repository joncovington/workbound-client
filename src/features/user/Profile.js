import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Segment,
         Transition,
         Header,
         Grid,
         Image,
         Menu,
         Button,
         Divider,
         TransitionablePortal,
         Placeholder,
         Message } from 'semantic-ui-react';

import EditProfileModal from './EditProfileImage';

function Profile(props) {
    const user = useSelector(state => state.user);
    const isSignedIn = useSelector(state => state.auth.isSignedIn);
    const [activeItem, setActiveItem] = useState({activeItem: ''});
    const [open, setOpen] = useState(false);
    const [successVisible, setSuccessVisible] = useState(false);
    const [profileVisible, setProfileVisible] = useState(false)

    const activeItemClick = (e, {name}) => {
        console.log(name + ' clicked')
        setActiveItem(name)
    };

    useEffect(() => {
        if (isSignedIn) {
            setProfileVisible(true)
        }
    }, [setProfileVisible, isSignedIn])

    return (
        <Fragment>
        <Transition visible={profileVisible} animation='fade in' duration={500}>
            <Segment.Group>
                <Segment attached style={{ backgroundColor: '#5fa5d9'}}>
                    <Header inverted as='h4'>My Profile</Header>
                </Segment>
                {successVisible
                 ? <Message
                        attached
                        positive
                        onDismiss={() => setSuccessVisible(false)}
                        header='Success'
                        content='Profile image updated.'
                   />
                 : null}
                <Segment attached>
                    <Grid celled='internally'>
                    <Grid.Row>
                        <Grid.Column width={3} textAlign='center'>
                            {
                                user.profile.image 
                                ? <Image size='medium' src={user.profile.image} />
                                :   <Fragment>
                                        <Placeholder fluid>
                                            <small>Profile image not available.</small>
                                            <Placeholder.Image square />
                                            <small>Click "<strong>Edit Image</strong>" below to upload your profile image.</small>
                                        </Placeholder>
                                    </Fragment>
                            }
                            <Divider />
                            <Button onClick={() => {
                                setOpen(true)
                                setSuccessVisible(false)
                            }} size='tiny'>Edit Image</Button>  
                        </Grid.Column>
                        <Grid.Column width={10}>
                            Profile Details Go Here
                        </Grid.Column>
                        <Grid.Column width={3}>
                            <Menu fluid secondary vertical>
                                <Menu.Item
                                    name='account'
                                    active={activeItem === 'account'}
                                    onClick={activeItemClick}
                                />
                            </Menu>
                        </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </Segment.Group>
        </Transition>
        <TransitionablePortal
            transition={{animation:'fade up', duration: 500}}
            open={open}
        >
            <EditProfileModal user={user} setOpen={setOpen} setSuccessVisible={setSuccessVisible} />
        </TransitionablePortal>
        </Fragment>
    )
}

export default Profile;