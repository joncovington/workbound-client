import React, { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import { Tab, Segment, Header, Message } from 'semantic-ui-react';
import ProfilePane from 'features/user/ProfilePane';
import PermissionList from 'features/user/PermissionList';

function Profile(props) {
    const user = useSelector(state => state.user);
    const [successVisible, setSuccessVisible] = useState(false);

    const panes = [
        { menuItem: 'Details', render: () => <Tab.Pane as='div'><ProfilePane setSuccessVisible={setSuccessVisible} user={user}/></Tab.Pane>},
        { menuItem: 'Permissions', render: () => <Tab.Pane as='div'><PermissionList user={user} /></Tab.Pane>}
    ]

    return (
        <Fragment>
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
            <Tab menu={{ pointing: true }} panes={panes} />
        </Fragment>
    )
}

export default Profile;