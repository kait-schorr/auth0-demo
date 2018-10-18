# Setting up Auth0

## Resources

- [Quick Start for React](https://auth0.com/docs/quickstart/spa/react)
- [Universal Login](https://auth0.com/docs/hosted-pages/login)
- [Lock](https://auth0.com/docs/libraries/lock/v11)
- [Adding environment variables to a React App](https://github.com/facebook/create-react-app/tree/master/packages/react-scripts/template#adding-custom-environment-variables)

## Initial Set Up

1. Sign up for account
2. Click New Application - Single Page App
3. Choose React
4. Open Application settings and add callback URL
5. `yarn add auth0-js` on front end client
6. Add script tag `<script type="text/javascript" src="node_modules/auth0-js/build/auth0.js"></script>` into index.html in the public folder
7. `yarn add auth0-lock`
8. Paste `<script src="https://cdn.auth0.com/js/lock/11.10/lock.min.js"></script>` Into index.html
9. Store Client ID and Domain ID in .env file
10. Initialize Lock:

```
var lock = new Auth0Lock(
  process.env.REACT_APP_CLIENT_ID,'lambdaletters.auth0.com'
);
```

11. Listen for Authentication:

```
lock.on("authenticated", function(authResult) {
  // Use the token in authResult to getUserInfo() and save it to localStorage
  lock.getUserInfo(authResult.accessToken, function(error, profile) {
    if (error) {
      // Handle error
      return;
    }

    document.getElementById('nick').textContent = profile.nickname;

    localStorage.setItem('accessToken', authResult.accessToken);
    localStorage.setItem('profile', JSON.stringify(profile));
  });
});
```

12. Add a login Button and tie that to lock.show:

```
document.getElementById('btn-login').addEventListener('click', function() {
  lock.show();
});
```

13. Add webAuth to deal with tokens
14. Create an isAuthenticated function and the expiresAt value:

```
isAuthenticated() {
    // Check whether the current time is past the
    // Access Token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }
```

15. Protect content

16. Add logout function:

```
logout() {
    // Clear Access Token and ID Token from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('expires_at');
    window.location.reload();

  }
```
