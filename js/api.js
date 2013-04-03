(function(exports){
  var api = exports.api = exports.api || {};

  api.get = function(url, params, callback){
    utils.get(config.baseUrl + url, params, callback);
  };

  api.post = function(url, data, callback){
    console.log(data);
    utils.post(config.baseUrl + url, data, callback);
  };

  api.put = function(url, data, callback){
    utils.put(config.baseUrl + url, data, callback);
  };

  api.patch = function(url, data, callback){
    utils.patch(config.baseUrl + url, data, callback);
  };

  api.delete = function(url, callback){
    utils.delete(config.baseUrl + url, callback);
  };



  api.products = {};

  api.products.list = function(options, callback){
    if (typeof options === "function"){
      callback = options;
      options = null;
    }

    api.get('/products', options, callback);
  };

  api.products.food = function(options, callback){
    if (typeof options === "function"){
      callback = options;
      options = null;
    }

    api.get('/products/food', options, callback);
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

  api.session.create = function(email, password, callback){
    api.post('/session', { email: email, password: password }, callback);
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

  api.consumers = {};

  api.consumers.list = function(options, callback){
    if (typeof options === "function"){
      callback = options;
      options = null;
    }

    api.get('/consumers', options, callback);
  };

  api.consumers.get = function(id, options, callback){
    api.get('/consumers/' + id, options, callback);
  };

  api.consumers.create = function(consumer, callback){
    api.post('/consumers', consumer, callback);
  };

  api.consumers.update = function(id, consumer, callback){
    if (typeof id === "object"){
      callback = consumer;
      consumer = id;
      id = consumer.id;
      delete consumer.id;
    }

    api.put('/consumers/' + id, consumer, callback);
  };

  api.consumers.delete = function(id, callback){
    api.delete('/consumers/' + id, callback);
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

  api.businesses.createContactEntry = function(info, callback){
    api.post('/businesses/contact-entries', info, callback);
  };

  api.businesses.addRequest = function(name, callback){
    api.post('/businesses/requests', { name: name }, callback);
  };

  api.collections = {};

  api.collections.list = function(uid, options, callback){
    if (typeof options === "function"){
      callback = options;
      options = null;
    }

    api.get('/consumers/' + uid + '/collections', options, callback);
  };

  api.collections.get = function(uid, cid, options, callback){
    api.get('/consumers/' + uid + '/collections/' + cid, options, callback);
  };

  api.collections.create = function(uid, collection, callback){
    api.post('/consumers/' + uid + '/collections', collection, callback);
  };

  api.collections.add = function(uid, cid, pid, callback){
    api.post('/consumers/' + uid + '/collections/' + cid + '/products', { productId: pid }, callback);
  };

  api.collections.remove = function(uid, cid, pid, callback){
    api.delete('/consumers/' + uid + '/collections/' + cid + '/products/' + pid, callback);
  };

  api.collections.update = function(uid, cid, collection, callback){
    if (typeof cid === "object"){
      callback = collection;
      collection = cid;
      cid = collection.id;
      delete collection.id;
    }

    api.put('/consumers/' + uid + '/collections/' + cid, collection, callback);
  };

  api.collections.delete = function(uid, cid, callback){
    api.delete('/consumers/' + uid + '/collections/' + cid, callback);
  };
})(window);