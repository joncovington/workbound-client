import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Segment, Transition } from 'semantic-ui-react';
import { fetchProfile } from './userSlice';

function Profile(props) {
    const dispatch = useDispatch();

    const user = useSelector(state => state.user)
    const isSignedIn = useSelector(state => state.auth.isSignedIn)
    
    useEffect(() => {
        if(isSignedIn){
            dispatch(fetchProfile())
        }
        
    }, [isSignedIn, dispatch])

    return (
        <Transition visible={isSignedIn} animation='drop' duration={500}>
            <Segment>
                {user.email}
            </Segment>
        </Transition>
        
    )
}

export default Profile;