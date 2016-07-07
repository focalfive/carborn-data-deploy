import React from 'react';
import cookie from 'react-cookie';
import $ from 'jquery';

var sharedObject = null;

const urls = {
    login: 'https://api.parse.com/1/login',
    userInfo: 'https://api.parse.com/1/users/me',
    logout: 'https://api.parse.com/1/logout',
};

class User {
    userInfo = cookie.load('userInfo');
    appId = null;
    apiKey = null;

    get logged() {
        return !!this.userInfo && !!this.userInfo.sessionToken && !!this.userInfo.sessionToken.length;
    }

    login = (username, password, resolve, reject) => {
        if(!this.appId || !this.apiKey) {
            console.log('AppID or API Key is empty, Set ParseUser appId and apiKey property.');
            if(typeof reject == 'function') {
                reject.call();
            }
            return;
        }

        $.ajax({
            url: urls.login,
            headers: {
                'X-Parse-Application-Id': this.appId,
                'X-Parse-REST-API-Key': this.apiKey,
                'X-Parse-Revocable-Session': '1',
            },
            data: {
                username: username,
                password: password,
            },
        }).done((data) => {
            this.userInfo = data;
            cookie.save('userInfo', data);
            if(typeof resolve == 'function') {
                resolve.call();
            }
        }).fail(() => {
            this.userInfo = null;
            cookie.remove('userInfo');
            if(typeof reject == 'function') {
                reject.call(null, this);
            }
        });
    }

    checkLogin = (resolve, reject) => {
        if(!this.appId || !this.apiKey) {
            console.log('AppID or API Key is empty, Set ParseUser appId and apiKey property.');
            if(typeof reject == 'function') {
                reject.call();
            }
            return;
        }

        if(!this.userInfo || !this.userInfo.sessionToken) {
            if(typeof reject == 'function') {
                reject.call();
            }
            return;
        }

        $.ajax({
            url: urls.userInfo,
            headers: {
                'X-Parse-Application-Id': this.appId,
                'X-Parse-REST-API-Key': this.apiKey,
                'X-Parse-Session-Token': this.userInfo.sessionToken,
            },
        }).done((data) => {
            this.userInfo = data;
            cookie.save('userInfo', data);
            if(typeof resolve == 'function') {
                resolve.call(null, this);
            }
        }).fail(() => {
            this.userInfo = null;
            cookie.remove('userInfo');
            if(typeof reject == 'function') {
                reject.call();
            }
        });
    }

    logout = (resolve, reject) => {
        if(!this.appId || !this.apiKey) {
            console.log('AppID or API Key is empty, Set ParseUser appId and apiKey property.');
            if(typeof reject == 'function') {
                reject.call();
            }
            return;
        }

        if(!this.userInfo || !this.userInfo.sessionToken) {
            if(typeof reject == 'function') {
                reject.call();
            }
            return;
        }

        $.ajax({
            method: 'post',
            url: urls.logout,
            headers: {
                'X-Parse-Application-Id': this.appId,
                'X-Parse-REST-API-Key': this.apiKey,
                'X-Parse-Session-Token': this.userInfo.sessionToken,
            },
        }).done((data) => {
            if(typeof resolve == 'function') {
                resolve.call(null, this);
            }
        }).fail(() => {
            if(typeof reject == 'function') {
                reject.call();
            }
        });

        this.userInfo = null;
        cookie.remove('userInfo');
    }
}

User.getSharedObject = () => {
    if(sharedObject == null) {
        sharedObject = new User();
    }

    return sharedObject;
}

export default User;
