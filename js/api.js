(function(exports){
  var api = exports.api = exports.api || {};

  api.get = function(url, params, callback){
    utils.get(config.baseUrl + url, params, callback);
  };

  api.post = function(url, data, callback){
    utils.post(config.baseUrl + url, data, callback);
  };

  api.put = function(url, data, callback){
    utils.put(config.baseUrl + url, data, callback);
  };

  api.patch = function(url, data, callback){
    utils.patch(config.baseUrl + url, data, callback);
  };

  api.delete = function(url, callback){
    utils.post(config.baseUrl + url, callback);
  };



  api.products = {};

  api.products.list = function(options, callback){
    if (typeof options === "function"){
      callback = options;
      options = null;
    }

    api.get('/products', options, callback);
  };

  api.products.get = function(id, options, callback){
    api.get('/products/' + id, options, callback);
  };

  api.products.create = function(product, callback){
    api.post('/products', product, callback);
  };

  api.products.update = function(id, product, callback){
    if (typeof id === "object"){
      callback = product;
      product = id;
      id = product.id;
      delete product.id;
    }

    api.put('/products/' + id, product, callback);
  };

  api.products.feelings = function(id, feelings, callback){
    api.put('/products/' + id + '/feelings', feelings, callback);
  };

  api.products.delete = function(id, callback){
    api.delete('/products/' + id, callback);
  };



  api.session = {};

  api.session.get = function(callback){
    api.get('/session', callback);
  };

  api.session.create = function(data, callback){
    api.post('/session', data, callback);
  };

  api.session.delete = function(callback){
    api.delete('/session', callback);
  };

  api.session.oauth = function(code, callback){
    api.post('/oauth', { code: code, group: 'consumer' }, callback);
  };

  api.session.getOauthUrl = function(url, service, callback){
    api.get('/oauth', { redirect_uri: url, service: service }, callback);
  };
})(window);