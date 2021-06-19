import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { signOut } from 'actions';
import { withRouter } from 'react-router-dom';

class Header extends React.Component {
    
    authButton() {
        if (!this.props.isSignedIn) {
            return ( 
                <Link to="/signin" className="ui primary button">Sign In</Link>
            );
        } else {
            return ( 
                <button 
                    onClick={() => this.props.signOut(this.props.history)} 
                    className="ui gray button"
                >
                    Sign Out
                </button>
            );
        }
    }

    render() {
        return (
            <div className="ui menu">
                <Link to="/" className="item">
                    Workbound
                </Link>
                <div className="right menu">
                    <div className="item">
                        {this.authButton()}
                    </div>
                </div>
            </div>
        );
    };
}

const mapStateToProps = state => {
    return { isSignedIn: state.auth.isSignedIn}
}

export default connect(mapStateToProps, { signOut })(withRouter(Header));