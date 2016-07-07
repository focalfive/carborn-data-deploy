import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, useRouterHistory } from 'react-router';
import history from './History';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import cookie from 'react-cookie';
import $ from 'jquery';
import Main from './Main';
import Login from './Login';
import {ParseUser} from './User';

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

const appHistory = history();
const muiTheme = getMuiTheme();
const user = ParseUser.getSharedObject();
user.appId = 'IvBZLAh4TFKfiG7vewerHgZpuWAjNMHowGSg2PMZ';
user.apiKey = 'kJbBe3wvZnh75A1GThWK15M27QomYQZhWxdIDTFO';

const checkLogin = () => {
    if(!user.logged) {
        appHistory.replace('login');
    }
}

/// Application component
class App extends React.Component {

    /**
     * Render view
     */
    render() {
        // TODO: Change to route value, not location.hash

        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div className="app">
                    {this.props.children}
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
