/**
 * Library to make  AJAX calls.
 * @see http://visionmedia.github.io/superagent
 */
import Promise2 from 'promise';
import superagentPromise from 'superagent-promise';
import SuperAgent from 'superagent';
import defaults from 'superagent-defaults';
import config from '../../config';

import CookieDough from 'cookie-dough';

SuperAgent.parse['application/vnd.api+json'] = JSON.parse;

const promise = Promise || Promise2;
const superagent = superagentPromise(SuperAgent, promise);

export default (req) => {
  const request = defaults(superagent);
  const cookie = new CookieDough(req);

  // Override URL
  request.on('request', (req2) => {
    req2.url = config.api_base_path + req2.url;

    if (req2.url.search(/upload/) === -1) {
      req2.set('Content-Type', 'application/json');
    }

    console.log(cookie.all());

    if (cookie.get('authentication')) {
      req2.set('Authorization', cookie.get('authentication'));
    }
  });

  // Because it's useful...
  if (__CLIENT__) {
    window.request = request;
  }

  return request;
};
