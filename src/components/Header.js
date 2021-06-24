import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { signOut } from 'features/auth/authSlice';
import { useSelector, useDispatch } from 'react-redux';

function Header(props) {
    const [buttonColor, setButtonColor] = useState('primary')
    const isSignedIn = useSelector(state => state.auth.isSignedIn)
    const dispatch = useDispatch()
    
    function handleClick() {
        if (!isSignedIn){
            props.history.push('/signin')
        } else {
            dispatch(signOut())
            props.history.push('/')
        }
    }
    
    useEffect(() => {
        isSignedIn ? setButtonColor('gray') : setButtonColor('primary')
    }, [isSignedIn, setButtonColor])

    return (
        <div className="ui menu">
            <Link to="/" className="item">
                Workbound
            </Link>
            <div className="right menu">
                <div className="item">
                    <button 
                        onClick={handleClick} 
                        className={`ui button ${buttonColor}`}
                    >
                        { isSignedIn ? 'Sign Out' : 'Sign In'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default withRouter(Header);