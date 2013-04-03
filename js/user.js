(function(exports){
  var user = exports.user = exports.user || {};

  user.attributes = {};

  user.loggedIn = function(callback){
    if (user.attributes.id) return callback(null, true);

    api.session.get(function(error, result){
      if (error) return callback(error);

      if (result && result.id){
        user.save(result);
      }

      callback(null, !!user.attributes.id);
    });
  };

  user.save = function(attributes){
    user.attributes = {};
    for (var key in attributes){
      user.attributes[key] = attributes[key];
    }
  }

  user.auth = function(email, password, callback){
    api.session.create(email, password, function(error, result){
      if (error) return callback(error);

      if (!result.id) return callback({ message: "Something went wrong :( " });

      user.save(result);

      callback(null, user.attributes);
    });
  };

  user.oauth = function(code, callback){
    api.session.oauth(code, function(error, result){
      if (error) return callback(error);

      user.save(result);

      callback(null, user.attributes);
    });
  };

  user.register = function(attributes, callback){
    api.consumers.create(attributes, function(error, result){
      if (error) return callback(error);

      user.save(result);

      callback(null, user.attributes);
    });
  };

  user.logout = function(callback){
    api.session.delete(function(error){
      if (error) return callback(error);

      user.attributes = {};

      callback();
    });
  };
})(window);