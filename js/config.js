(function(){
  var config = window.config = window.config || {
    defaults: {

    }

  , dev: {
      baseUrl: 'http://localhost:3000/v1'
    }

  , prod: {
      baseUrl: 'http://magic.goodybag.com/v1'
    }
  };

  for (var key in config.default){
    if (!(key in config.dev)) config.dev[key]   = config.default[key];
    if (!(key in config.prod)) config.prod[key] = config.default[key];
  }
})();