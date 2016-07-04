import $ from 'jquery';
import cookie from 'react-cookie';

const appId = 'IvBZLAh4TFKfiG7vewerHgZpuWAjNMHowGSg2PMZ';
const apiKey = 'kJbBe3wvZnh75A1GThWK15M27QomYQZhWxdIDTFO';

var sharedObject = null;

class User {
    userInfo = cookie.load('userInfo');

    didLoginSuccess() {
        console.log('User.didLoginSuccess called. Override this function');
    }

    didLoginFail() {
        console.log('User.didLoginFail called. Override this function');
    }

    login = (username, password) => {
        let url = 'https://api.parse.com/1/login?username=' + username + '&password=' + password;

        $.ajax({
            url: url,
            headers: {
                'X-Parse-Application-Id': appId,
                'X-Parse-REST-API-Key': apiKey,
                'X-Parse-Revocable-Session': '1',
            },
        }).done((data) => {
            this.userInfo = data;
            cookie.save('userInfo', data);
            this.didLoginSuccess();
        }).fail(() => {
            this.userInfo = null;
            cookie.remove('userInfo');
            this.didLoginFail();
        });

        return promise;
    }

    checkLogin = () => {
        if(!this.userInfo || !this.userInfo.sessionToken) {
            this.didLoginFail();
            return;
        }

        let url = 'https://api.parse.com/1/users/me';

        $.ajax({
            url: url,
            headers: {
                'X-Parse-Application-Id': appId,
                'X-Parse-REST-API-Key': apiKey,
                'X-Parse-Session-Token': this.userInfo.sessionToken,
            },
        }).done((data) => {
            this.userInfo = data;
            cookie.save('userInfo', data);
            this.didLoginSuccess();
        }).fail(() => {
            this.userInfo = null;
            cookie.remove('userInfo');
            this.didLoginFail();
        });
    }

    logout = () => {
        this.userInfo = null;
        cookie.remove('userInfo');
        this.didLoginFail();
    }
}

User.getSharedObject = () => {
    if(sharedObject == null) {
        sharedObject = new User();
    }

    return sharedObject;
}

export default User;
