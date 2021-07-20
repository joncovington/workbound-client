import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { push } from 'connected-react-router'
import { Link } from 'react-router-dom'
import { signOut } from '../auth/authSlice'
import { clearProfile } from './userSlice'
import { Dropdown, Button, Image, Icon } from 'semantic-ui-react'

const UserMenu = (props) => {
    const user = useSelector(state => state.user)
    const isPermFetched = useSelector(state => state.user.isPermFetched)
    const [viewTaskPerm, setViewTaskPerm] = useState(false)
    const [viewCategoryPerm, setViewCategoryPerm] = useState(false)
    const [addPortfolioPerm, setAddPortfolioPerm] = useState(false)

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

    useEffect(() => {
        if (isPermFetched) {
            user.permissions?.task?.view_task ? setViewTaskPerm(true) : setViewTaskPerm(false)
            user.permissions?.category?.view_category ? setViewCategoryPerm(true) : setViewCategoryPerm(false)
            user.permissions?.portfolio?.add_portfolio ? setAddPortfolioPerm(true) : setAddPortfolioPerm(false)
        }
    }, [isPermFetched, user])
    
    const taskMenuItem = () => {
        return viewTaskPerm
            ? <Dropdown.Item icon='tasks' as={Link} to='/tasks' content='Tasks' />
            : null     
    }
    const categoryMenuItem = () => {
        return viewCategoryPerm
            ? <Dropdown.Item icon='sitemap' as={Link} to='/categories' content='Categories' />
            : null     
    }
    const builderMenuItem = () => {
        return addPortfolioPerm
            ? <Dropdown.Item icon='object group' as={Link} to='/build' content='Build Portfolio' />
            : null     
    }
    
    return (
        <Dropdown item trigger={trigger} header={displayName}>
        <Dropdown.Menu>
            <Dropdown.Item onClick={() => dispatch(push('/profile'))} icon='user' content='Profile' />
            {
                addPortfolioPerm
                ? <><Dropdown.Divider /><Dropdown.Header>Actions</Dropdown.Header></>
                : null
            }
            {builderMenuItem()}
            {
                viewTaskPerm || viewCategoryPerm 
                ? <><Dropdown.Divider /><Dropdown.Header>Admin</Dropdown.Header></>
                : null
            }
            {taskMenuItem()}
            {categoryMenuItem()}
            <Dropdown.Divider />
            <Dropdown.Item>
                <Button onClick={signOutClick}>Sign Out</Button>
            </Dropdown.Item>
        </Dropdown.Menu>
        </Dropdown>
    )
}

export default UserMenu;