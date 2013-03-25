(function(){
  var user = window.user = window.user || {};

  user.attributes = {};

  user.loggedIn = function(callback){
    if (user.attributes.id) return callback(null, true);

    api.session.get(function(error, result){
      if (error) return callback(error);

      if (result && result.id) user.attributes = result;

      callback(null, !!user.attributes.id);
    });
  };

  user.auth = function(email, password, callback){
    api.session.create(email, password, function(error, result){
      if (error) return callback(error);

      if (!result.id) return callback({ message: "Something went wrong :( " });

      user.attributes = result;
      callback(null, user.attributes);
    });
  };

  user.oauth = function(callback){

  };

  user.logout = function(callback){
    api.session.delete(function(error){
      if (error) return callback(error);

      user.attributes = {};
    });
  };
})();