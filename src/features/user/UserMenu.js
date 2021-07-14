import React, {Fragment} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { push } from 'connected-react-router'
import { Link } from 'react-router-dom'
import { signOut } from '../auth/authSlice'
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
        dispatch(signOut(localStorage.getItem('refresh_token')))
        dispatch(push('/'))
    }
    
    const trigger = (
        <span>
            {user.profile.image ? <Image avatar src={user.profile.image}/> : <Icon size='large' name='user circle' />}
        </span>
      )
    
    const taskMenuItem = () => {
        if (user.permissions.task.view_task !== undefined) {
            return user.permissions.task.view_task.status
                ? <Fragment>
                    <Dropdown.Item icon='tasks' as={Link} to='/tasks' content='Tasks' />
                    <Dropdown.Divider />
                  </Fragment>
                : null
        }              
    }
    
    return (
        <Dropdown item trigger={trigger} header={displayName}>
        <Dropdown.Menu>
            <Dropdown.Item onClick={() => dispatch(push('/profile'))} icon='user' content='Profile' />
            <Dropdown.Divider />
            {taskMenuItem()}
            <Dropdown.Item>
                <Button onClick={signOutClick}>Sign Out</Button>
            </Dropdown.Item>
        </Dropdown.Menu>
        </Dropdown>
    )
}

export default UserMenu;