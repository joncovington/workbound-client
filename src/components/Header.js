import React, { useEffect }  from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Menu } from 'semantic-ui-react';
import { fetchProfile } from 'features/user/userSlice';

import UserMenu from 'features/user/UserMenu';

import 'components/Header.styles.css'

function Header(props) {
    const isSignedIn = useSelector(state => state.auth.isSignedIn);

    const dispatch = useDispatch();
    useEffect(() => {
        if(isSignedIn){
            dispatch(fetchProfile())
        }
    }, [isSignedIn, dispatch]);

    return (
        <Menu>
            <Menu.Item as={NavLink} to='/' className='brand'>
                Workbound
            </Menu.Item>
            <Menu.Menu position='right'>
                {
                    isSignedIn
                    ? <UserMenu signInOpen={props.signInOpen}/> 
                    : <Menu.Item header>
                        <Button onClick={() => props.signInOpen(true)} color='blue'>Sign In</Button>
                      </Menu.Item>
                }
            </Menu.Menu>
        </Menu>
    );
};

export default Header;