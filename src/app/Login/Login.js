import React from 'react';
import $ from 'jquery';
import cookie from 'react-cookie';
import history from '../History';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import {ParseUser} from '../User';

const styles = {
    template: {
        textAlign: 'center',
        paddingTop: 200,
    },
};
const appId = 'IvBZLAh4TFKfiG7vewerHgZpuWAjNMHowGSg2PMZ';
const apiKey = 'kJbBe3wvZnh75A1GThWK15M27QomYQZhWxdIDTFO';

class Login extends React.Component {

    state = {
        username: '',
        usernameErrorText: null,
        password: '',
        passwordErrorText: null,
        progress: false,
    }

    usernameDidChange = (event) => {
        this.setState({
            username: event.target.value,
            usernameErrorText: null,
        });
    }

    passwordDidChange = (event) => {
        this.setState({
            password: event.target.value,
            passwordErrorText: null,
        });
    }

    usernameDidKeyDown = (event) => {
        if(event.keyCode == 13) {
            this.refs.password.focus();
        }
    }

    passwordDidKeyDown = (event) => {
        if(event.keyCode == 13) {
            this.checkInputField();
        }
    }

    checkInputField = () => {
        if(this.state.username.length < 5) {
            this.setState({
                usernameErrorText: 'User e-mail must longer than 4',
            });
            this.refs.username.focus();
            return;
        }
        if(this.state.password.length < 5) {
            this.setState({
                passwordErrorText: 'Password must longer than 4',
            });
            this.refs.password.focus();
            return;
        }

        this.sendLogin();
    }

    sendLogin = () => {
        this.setState({
            progress: true,
        });

        ParseUser.getSharedObject().login(this.state.username, this.state.password, () => {
            history().push('/');
            // location.href = '#/';
        }, () => {
            this.setState({
                usernameErrorText: 'Check User e-mail',
                passwordErrorText: 'Check Password',
            });
        });
    }

    render() {
        return this.state.progress ? (
            <div style={styles.template}>
                <CircularProgress /><br />
                Sign in
            </div>
        ) : (
            <div style={styles.template}>
                <TextField
                    ref="username"
                    hintText="username@mail.com"
                    floatingLabelText="E-mail for login"
                    value={this.state.username}
                    onChange={this.usernameDidChange}
                    onKeyDown={this.usernameDidKeyDown}
                    errorText={this.state.usernameErrorText}
                /><br />
                <TextField
                    ref="password"
                    type="password"
                    hintText="password for login"
                    floatingLabelText="Password"
                    value={this.state.password}
                    onChange={this.passwordDidChange}
                    onKeyDown={this.passwordDidKeyDown}
                    errorText={this.state.passwordErrorText}
                /><br />
                <RaisedButton label="Sign-in" primary={true} onTouchTap={this.checkInputField} />
            </div>
        );
    }
}

export default Login;
