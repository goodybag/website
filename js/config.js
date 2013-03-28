(function(exports){
  var config = exports.config = exports.config || {
    defaults: {

    }

  , dev: {
      baseUrl: 'http://localhost:3000/v1'
    , oauth: {
        redirectUrl: 'http://localhost:8081'
      }
    }

  , prod: {
      baseUrl: 'http://magic.goodybag.com/v1'
    , oauth: {
        redirectUrl: 'http://www.goodybag.com'
      }
    }
  };

  for (var key in config.default){
    if (!(key in config.dev)) config.dev[key]   = config.default[key];
    if (!(key in config.prod)) config.prod[key] = config.default[key];
  }

  exports.config = config.prod;
})(window);