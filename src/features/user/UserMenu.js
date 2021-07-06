import React from 'react'
import { withRouter } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { signOut } from 'features/auth/authSlice'
import { clearProfile } from './userSlice'
import { Dropdown, Button, Image, Icon } from 'semantic-ui-react'

const UserMenu = (props) => {
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const displayName = 
        user.profile.first_name
        ? user.profile.first_name
        : user.email.split('@')[0]
    
    function signOutClick() {
        dispatch(clearProfile())
        dispatch(signOut())
        props.history.push('/')
    }
    
    const trigger = (
        <span>
            {user.profile.image ? <Image avatar src={user.profile.image}/> : <Icon size='large' name='user circle' />}
        </span>
      )

    return (
        <Dropdown item trigger={trigger} header={displayName}>
        <Dropdown.Menu>
            <Dropdown.Item as={Link} to='/profile' icon='user' content='Profile' />
            <Dropdown.Divider />
            <Dropdown.Header>
                Admin
            </Dropdown.Header>
            <Dropdown.Item icon='tasks' as={Link} to='/tasks' content='Tasks' />
            <Dropdown.Divider />
            <Dropdown.Item>
                <Button onClick={signOutClick}>Sign Out</Button>
            </Dropdown.Item>
        </Dropdown.Menu>
        </Dropdown>
    )
}

export default withRouter(UserMenu);