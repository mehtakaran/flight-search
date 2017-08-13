'use strict'

class Common {
  constructor() {

  }

  api(url) {
    http.get(url, (response) => {
      return response;
    }).
    catch((err) => {
      return err;
    });
  }
}

module.exports = Common;
