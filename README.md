# node-loggly-express
send application parameters from express to loggly

## Sample code

```js
const logglyExpress = require('node-loggly-express').default;

app.use(logglyExpress({
  token: process.env.logglyToken,
  subdomain: 'example',
  tags: process.env.logglyTags.split(','),
}));

```

## Features

### Extra properties

- response time
- content length
- gitHead (git tag and last commit)
- appVersion (from package.json)
- useragent parsed

### Custom params

`req.expressLoggly.params` is an object created by this package. Use this
object to load custom application parameters that you like to track.
This object is passed on loggly as `json.params`. Loggly indexes individual 
parameters which makes it easier to track. You can add things like username or
location to track in loggly.

Example 1. Track username
```js
app.use('/login', handleLogin);
function handleLogin(req, res) {
  // login
  req.expressLoggly.params.username = req.user.username;
}
```

Example 2. External API performance
```js
function routeHandler(req, res) {
  let initTime = (new Date()).getTime();
  setTimeout(() => {
    req.expressLoggly.params.asyncTime = (new Date()).getTime() - initTime;
    res.json({message: 'DONE'});
  }, 1000);
}
```

### Ignore useragent

`config.ignoreUserAgent`

It is better to ignore requests from user agents such as spiders or uptime
monitors. This can also be useful to ignore during testing.

Example: Ignore requests from curl and [apex ping](https://apex.sh/ping/)

```
let config = {
  ...expressLogglyConfig,
  ignoreUserAgent: /^(apex|curl)/,
}
```

[8 Handy Tips to Consider When Logging in JSON](https://www.loggly.com/blog/8-handy-tips-consider-logging-json/)

## License

**MIT**

Loggly is registered trademark of [Loggly Inc.](https://www.loggly.com)
