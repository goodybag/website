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


  api.users = {};

  api.users.list = function(options, callback){
    if (typeof options === "function"){
      callback = options;
      options = null;
    }

    api.get('/users', options, callback);
  };

  api.users.get = function(id, options, callback){
    api.get('/users/' + id, options, callback);
  };

  api.users.create = function(user, callback){
    api.post('/users', user, callback);
  };

  api.users.update = function(id, user, callback){
    if (typeof id === "object"){
      callback = user;
      user = id;
      id = user.id;
      delete user.id;
    }

    api.put('/users/' + id, user, callback);
  };

  api.users.delete = function(id, callback){
    api.delete('/users/' + id, callback);
  };

  api.businesses = {};

  api.businesses.list = function(options, callback){
    if (typeof options === "function"){
      callback = options;
      options = null;
    }

    api.get('/businesses', options, callback);
  };

  api.businesses.get = function(id, options, callback){
    api.get('/businesses/' + id, options, callback);
  };

  api.businesses.create = function(business, callback){
    api.post('/businesses', business, callback);
  };

  api.businesses.update = function(id, business, callback){
    if (typeof id === "object"){
      callback = business;
      business = id;
      id = business.id;
      delete business.id;
    }

    api.put('/businesses/' + id, business, callback);
  };

  api.businesses.delete = function(id, callback){
    api.delete('/businesses/' + id, callback);
  };

  api.collections = {};

  api.collections.list = function(cid, options, callback){
    if (typeof options === "function"){
      callback = options;
      options = null;
    }

    api.get('/consumers/' + cid + '/collections', options, callback);
  };

  api.collections.get = function(cid, id, options, callback){
    api.get('/consumers/' + cid + '/collections/' + id, options, callback);
  };

  api.collections.create = function(cid, collection, callback){
    api.post('/consumers/' + cid + '/collections', collection, callback);
  };

  api.collections.update = function(cid, id, collection, callback){
    if (typeof id === "object"){
      callback = collection;
      collection = id;
      id = collection.id;
      delete collection.id;
    }

    api.put('/consumers/' + cid + '/collections/' + id, collection, callback);
  };

  api.collections.delete = function(cid, id, callback){
    api.delete('/consumers/' + cid + '/collections/' + id, callback);
  };
})(window);