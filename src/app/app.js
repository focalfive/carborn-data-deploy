import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import cookie from 'react-cookie';
import $ from 'jquery';
import Navigation from './Navigation';
import Header from './Header';
import Main from './Main';
import Login from './Login';
import User from './User';

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

const appHistory = useRouterHistory(createHashHistory)({queryKey: false});
const muiTheme = getMuiTheme();
let loginRedirectRoute = null;

User.getSharedObject().didLoginFail = () => {
    loginRedirectRoute = location.pathname;
    appHistory.replace('login');
}
User.getSharedObject().didLoginSuccess = () => {
    appHistory.push('');
}
const checkLogin = () => {
    User.getSharedObject().checkLogin();
}

/// Application component
class App extends React.Component {
    state = {
        navigationOpen: false,
    }

    leftMenuDidTouch = () => {
        this.setState({
            navigationOpen: !this.state.navigationOpen,
        });
    }

    /**
     * Render view
     */
    render() {
        // TODO: Change to route value, not location.hash

        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div className="app">
                    <Header onLeftMenuTouchTap={this.leftMenuDidTouch} />
                    <Navigation onRequestChange={this.leftMenuDidTouch} open={this.state.navigationOpen} />
                    <div className="container">
                        {this.props.children}
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }

    /**/
}

// Render the main app react component into the app div.
// For more details see: https://facebook.github.io/react/docs/top-level-api.html#react.render
ReactDOM.render(
    <Router history={appHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Main} onEnter={checkLogin} />
            <Route path="login" component={Login} />
        </Route>
    </Router>,
    document.getElementById('app')
);

// For example, add <Route /> inside of root <Route /> to route component
// <Route path="component" component={Component} />
