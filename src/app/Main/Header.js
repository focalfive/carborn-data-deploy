import React from 'react';
import history from '../History';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import { ParseUser } from '../User';


class Header extends React.Component {

    logout = () => {
        ParseUser.getSharedObject().logout(() => {
            history().push('login');
        }, () => {
            console.log('Logout fail');
        });
    }

    render() {

        return (
            <header>
                <AppBar
                    title="Carborn data deploy"
                    style={{backgroundColor: '#2196F3'}}
                    onLeftIconButtonTouchTap={this.props.onLeftMenuTouchTap}
                    iconElementRight={
                        <IconMenu
                            iconButtonElement={
                                <IconButton><MoreVertIcon /></IconButton>
                            }
                            targetOrigin={{horizontal: 'right', vertical: 'top'}}
                            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                        >
                            <MenuItem primaryText="Sign out" onTouchTap={this.logout} />
                        </IconMenu>
                    }
                />
            </header>
        );
    }
}

export default Header;
