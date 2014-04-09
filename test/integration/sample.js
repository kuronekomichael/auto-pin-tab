/* global it */
'use strict';
var port = process.env.TEST_PORT || 3333;
var base = 'http://localhost:' + port;
var assert = require('assert');

it('handles an invalid login', function (done) {
    this.browser
        .get(base + '/options.html')

        // assert we're taken to the login page
        .url().then(function (url) {
            console.log('Logging in...');
            return assert.equal(url, base + '/login');
        })

        // enter invalid credentials and submit
        .elementById('email').type('me@here.com')
        .elementById('pass').type('wayoff')
        .elementByTagName('form').submit()

        // assert we're still in the login page
        .url().then(function (url) {
            return assert.equal(url, base + '/login');
        })
        .then(done, done);
});