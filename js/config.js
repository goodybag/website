(function(exports){
  var config = exports.config = exports.config || {
    defaults: {
      spinner: {
        lines: 15             // The number of lines to draw
      , length: 11            // The length of each line
      , width: 4              // The line thickness
      , radius: 26            // The radius of the inner circle
      , corners: 1            // Corner roundness (0..1)
      , rotate: 0             // The rotation offset
      , color: '#000'         // #rgb or #rrggbb
      , speed: 2.2            // Rounds per second
      , trail: 82             // Afterglow percentage
      , shadow: false         // Whether to render a shadow
      , hwaccel: false        // Whether to use hardware acceleration
      , className: 'spinner'  // The CSS class to assign to the spinner
      , zIndex: 2e9           // The z-index (defaults to 2000000000)
      , top: 'auto'           // Top position relative to parent in px
      , left: 'auto'          // Left position relative to parent in px
      }

    , infiniScrollHeight: 400

    , defaultName: 'Goodybagger'
    }

  , dev: {
      baseUrl: 'http://localhost:3000/v1'
    , oauth: {
        redirectUrl: 'http://localhost:8081'
      }
    , proxyUrl: "http://localhost:3000/proxy.html"
    }

  , prod: {
      baseUrl: 'http://magic.goodybag.com/v1'
    , oauth: {
        redirectUrl: 'http://www.goodybag.com'
      }
    , proxyUrl: "http://magic.goodybag.com/proxy.html"
    }
  };

  for (var key in config.defaults){
    if (!(key in config.dev)) config.dev[key]   = config.defaults[key];
    if (!(key in config.prod)) config.prod[key] = config.defaults[key];
  }

  exports.config = config.prod;
})(window);