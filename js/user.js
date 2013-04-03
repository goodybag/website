(function(exports){
  var user = exports.user = exports.user || {};

  user.attributes = {};

  user.onAuth = utils.noop;
  user.onDeAuth = utils.noop;

  user.loggedIn = function(callback){
    if (user.attributes.id) return callback ? callback(null, true) : null;

    api.session.get(function(error, result){
      if (error) return callback ? callback(error) : null;

      if (result && result.id){
        api.consumers.get(result.id, function(error, consumer){
          if (error) return callback ? callback(error) : null;

          for (var key in consumer){
            result[key] = consumer[key];
          }

          user.save(result);
          if (callback) callback(null, true);
          user.onAuth(user.attributes, false);
        });
      } else {
        if (callback) callback(null, false);
      }
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
      if (error) return callback ? callback(error) : null;

      if (!result.id) return callback ? callback({ message: "Something went wrong :( " }) : null;

      api.consumers.get(result.id, function(error, consumer){
        if (error) return callback ? callback(error) : null;

        for (var key in consumer){
          result[key] = consumer[key];
        }

        user.save(result);
        if (callback) callback(null, user.attributes);
        user.onAuth(user.attributes, true);
      });
    });
  };

  user.oauth = function(code, callback){
    api.session.oauth(code, function(error, result){
      if (error) return callback ? callback(error) : null;

      api.consumers.get(result.id, function(error, consumer){
        if (error) return callback ? callback(error) : null;

        for (var key in consumer){
          result[key] = consumer[key];
        }

        user.save(result);
        if (callback) callback(null, user.attributes);
        user.onAuth(user.attributes, true);
      });
    });
  };

  user.register = function(attributes, callback){
    api.consumers.create(attributes, function(error, result){
      if (error) return callback ? callback(error) : null;

      for (var key in attributes){
        results[key] = attributes[key];
      }

      user.save(result);

      if (callback) callback(null, user.attributes);
      user.onAuth(user.attributes, true);
    });
  };

  user.logout = function(callback){
    api.session.delete(function(error){
      if (error) return callback ? callback(error) : null;

      user.attributes = {};

      if (callback) callback();
      user.onDeAuth();
    });
  };
})(window);