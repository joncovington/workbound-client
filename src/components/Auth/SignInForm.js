import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { signIn } from 'actions'

class SignInForm extends React.Component {

    state = { hideError: false }

    renderError = ({ error, touched }) => {
        if (touched && error) {
            return (
                <div className="ui error message">
                    <div className="header">{error}</div>
                </div>
            );
        }
    }

    renderInput = ({ input, label, ph, meta, type}) => {
        const className = `field ${meta.error && meta.touched ? 'error': ''}`

        return (
            <div className={className}>
                <label>{label}</label>
                <input 
                    {...input}
                    placeholder={ph}
                    autoComplete="off"
                    type={type}
                />
                {this.renderError(meta)}
            </div>
            
        );
    };

    onSubmit = (formValues) => {
        this.props.signIn(formValues, this.props.history);
    };

    errorListItems() {
        var count = 0
        return this.props.authError.data.non_field_errors.map(error => {
            count++
            return <li key={count}>{error}</li>;
        });
    }

    onError() {
        if (this.props.authError) {
            if (this.props.authError.data.non_field_errors) {
                return (
                    <div style={{ display: (this.state.hideError ? 'none' : 'block') }}>
                        <div className="ui error message">
                            <i onClick={() => this.setState({ hideError: true })} className="close icon"></i>
                            <div className="header">
                                There were some errors with your submission
                            </div>
                            <ul className="list">
                                {this.errorListItems()}
                            </ul>
                        </div>
                        {}
                    </div>
                );
            };
        };
    }

    render() {
        return (
            <div className="ui grid" style={{ height: '100vh' }}>
            <div className="ui column centered middle" style={{ maxWidth: 450 }}>
                {this.onError()}
                <form onSubmit={this.props.handleSubmit(this.onSubmit)} className="ui form error">
                    <Field name="email" component={this.renderInput} ph="Enter Email" label="Email"/>
                    <Field name="password" component={this.renderInput}ph="Enter Password" label="Password" type='password' />
                    <button className="ui button primary">Submit</button>
                </form>
            </div>
            </div>
        );
    }
}

const validate = (formValues) => {
    const errors = {}

    if (!formValues.email) {
        errors.email = 'You must enter an email address.';
    }

    if (!formValues.password) {
        errors.password = 'You must enter a password.';
    }

    return errors;
};

const mapStateToProps = state => {
    return { 
        isSignedIn: state.auth.isSignedIn,
        authError: state.auth.error 
    }
}


export default connect(mapStateToProps, { signIn })(reduxForm({
    form: 'signInForm',
    validate
})(withRouter(SignInForm)));