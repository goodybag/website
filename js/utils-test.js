(function(){
  var utils = window.utils = window.utils || {};

  if (jQuery.browser.msie) XMLHttpRequest = XDomainRequest;

  utils.dom = jQuery;
  utils.getScript = jQuery.getScript;
  utils.domready = jQuery;
  utils.support = jQuery.support;
  utils.compile = Handlebars.compile;

  utils.rpc = new easyXDM.Rpc({ remote: config.proxyUrl }, {
    remote: { request: {} }
  });


  utils.filter = function(set, fn){
    var filtered = [];
    for (var i = 0, l = set.length; i < l; ++i){
      if (fn(set[i])) filtered.push(set[i]);
    }
    return filtered;
  };

  utils.ajax = function(method, url, data, callback){
    switch (method){
      case "get":     method = "GET";     break;
      case "post":    method = "POST";    break;
      case "del":     method = "DELETE";  break;
      case "put":     method = "PUT";     break;
      case "patch":   method = "PUT";     break;
    }

    if (typeof data === "function"){
      callback = data;
      data = null;
    }

    if (method === "GET" || method === "get"){
      url += utils.queryParams(data);
      data = null;
    }

    var ajax = {
      type: method
    , method: method
    , url: url
    , success: function(results){
        if (typeof results == 'string') results = JSON.parse(results);
        results = results || {};
        callback && callback(results.error, results.data, results.meta);
      }
    , error: function(error, results, res, r){
        callback && callback(error.responseText ? JSON.parse(error.responseText).error : error);
      }
    };

    if ($.browser.msie) ajax.cache = false;

    if (data) ajax.data = data;

    if ($.browser.msie && $.browser.version < 10) utils.rpc.request(ajax, ajax.success, ajax.error);
    else $.ajax(ajax);
  };

  utils.get = function(url, params, callback){
    utils.ajax('get', url, params, callback);
    return utils;
  };

  utils.post = function(url, data, callback){
    utils.ajax('post', url, data, callback);
    return utils;
  };

  utils.put = function(url, data, callback){
    utils.ajax('put', url, data, callback);
    return utils;
  };

   utils.patch = function(url, data, callback){
    utils.ajax('patch', url, data, callback);
    return utils;
  };

  utils.del = function(url, data, callback){
    utils.ajax('delete', url, data, callback);
    return utils;
  };

  utils.queryParams = function(data){
    if (typeof data !== "object") return "";
    var params = "?";
    for (var key in data){
      params += key + "=" + data[key] + "&";
    }
    return params.substring(0, params.length - 1);
  };


  utils.noop = function(){};
})();