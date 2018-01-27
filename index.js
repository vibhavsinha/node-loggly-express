const path = require('path');
const winston = require('winston');
const onFinished = require('on-finished');
const uaParser = require('ua-parser-js');
require('winston-loggly-bulk');

const {exec} = require('child_process');
let gitHead;
let appVersion;

const cmd = 'git describe --tags || git log --pretty="%h" -n1 HEAD';
const gt = exec(cmd, (err, stdout, stderr) => {
  if (!err) {
    gitVersion = stdout;
  }
});
const package = require(path.join(process.cwd(), 'package.json'));
appVersion = package.version;


exports.default = (config) => {
  let logglyParams = {
    token: config.token,
    subdomain: config.subdomain,
    tags: config.tokens,
    json: true,
  };
  return function(req, res, next) {
    req.expressLoggly = {
      startTime: (new Date()).getTime(),
      params: {},
    };
    onFinished(res, function(err, res) {
      let userAgent = req.headers['user-agent'];
      if (userAgent.startsWith('apex')) {
        return;
      }
      let logObject = {
        remoteAddr: req.realip,
        url: req.originalUrl || req.url,
        referrer: req.headers['referer'] || req.headers['referrer'],
        userAgent: uaParser(req.headers['user-agent']),
        appParams: req.expressLoggly.params,
        method: req.method,
        time: (new Date()).toISOString(),
        status: res.statusCode,
        length: res.getHeader('content-length'),
        responseTime: (new Date()).getTime() - req.expressLoggly.startTime,
        gitVersion,
        appVersion,
      };
      winston.log('info', logObject);
    });
    next();
  };
}

winston.add(winston.transports.Loggly, logglyParams);
