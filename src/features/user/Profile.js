import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Segment,
         Transition,
         Header,
         Grid,
         Image,
         Button,
         Divider,
         TransitionablePortal,
         Placeholder,
         Message } from 'semantic-ui-react';

import EditProfileModal from 'features/user/EditProfileImage';
import ProfileDetail from 'features/user/ProfileDetail'

function Profile(props) {
    const user = useSelector(state => state.user);
    const isSignedIn = useSelector(state => state.auth.isSignedIn);
    const [open, setOpen] = useState(false);
    const [successVisible, setSuccessVisible] = useState(false);
    const [profileVisible, setProfileVisible] = useState(false)

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
                        content='Profile updated.'
                   />
                 : null}
                <Segment attached>
                    <Grid celled='internally'>
                    <Grid.Row>
                        <Grid.Column width={6} textAlign='center'>
                            {
                                user.profile.image 
                                ? <Image fluid src={user.profile.image} />
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
                            <ProfileDetail setSuccessVisible={setSuccessVisible} user={user}/>
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