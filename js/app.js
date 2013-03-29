(function(exports){
  var app = exports.app = exports.app || {};

  app.init = function(){
    app.compileTemplates(templates);
    app.checkForAccessCode();
    app.setupSpinner();
  };

  app.setupSpinner = function(){
    app.spinner = new Spinner(config.spinner);
  };

  app.headerEvents = function(){
    utils.dom('#header .btn-facebook').click(app.onFacebookBtnClick);
  };

  app.checkForAccessCode = function(){
    if (window.location.href.indexOf('code=') == -1) return;

    var code = window.location.href.split('code=')[1];
    code = code.split('/#_=_')[0];

    user.oauth(code, function(error){
      if (error && error.message) alert(error.message);
      if (error) alert(error);

      app.onUserLogin();
    });
  };

  app.openRegisterModal = function(){
    utils.dom('a[href="#facebook-popup-2"]').eq(0).trigger('click');
  };

  app.openLoginModal = function(){
    utils.dom('a[href="#facebook-popup"]').eq(0).trigger('click');
  };

  app.closeModals = function(){
    jQuery.fancybox.close();
  };

  app.loadModals = function(){
    utils.dom(document.body).append(
      templates.loginModal()
    , templates.signUpModal()
    );

    app.$loginForm = utils.dom('#login-form');
    app.$registerForm = utils.dom('#register-form');

    app.$loginForm.submit(app.onLoginSubmit);
    app.$registerForm.submit(app.onRegisterSubmit);

    utils.dom('.popup-holder .btn-facebook').click(app.onFacebookBtnClick);

    // Call PSD2HTML function
    initLightbox();
  };

  app.compileTemplates = function(tmpl){
    for (var key in tmpl){
      if (typeof tmpl[key] === "object") tmpl[key] = app.compileTemplates(tmpl[key]);
      else tmpl[key] = utils.compile(tmpl[key]);
    }
  };

  app.onLoginSubmit = function(e){
    e.preventDefault();

    var
      $email    = app.$loginForm.find('#user')
    , $password = app.$loginForm.find('#pass')
    , email     = $email.val()
    , password  = $password.val()
    ;

    $password.val("");

    user.isLoggedIn(function(error, isLoggedIn){
      if (error && error.message) return alert(error.message);
      if (error) return alert(error);

      if (isLoggedIn) return alert("You're alraedy logged in!");

      user.auth(email, password, function(error, result){
        if (error && error.message) return alert(error.message);
        if (error) return alert(error);

        app.closeModals();
      });
    });
  };

  app.onRegisterSubmit = function(e){
    e.preventDefault();

    var $password = app.$registerForm.find('#pass-1');

    if ($password.val() != app.$registerForm.find('#pass-2').val())
      return alert("Passwords Must match"), app.$registerForm.find('input[type="password"]').val("");

    var data = {
      email:          app.$registerForm.find('#email').val()
    , screenName:     app.$registerForm.find('#user-2').val()
    , password:       $password.val()
    };

    app.$registerForm.find('input[type="password"]').val("");

    user.register(data, function(error, result){
      if (error && error.message) return alert(error.message);
      if (error) return alert(error);

      app.closeModals();
    });
  };

  app.onFacebookBtnClick = function(e){
    e.preventDefault();

    api.session.getOauthUrl(config.oauth.redirectUrl, 'facebook', function(error, result){
      if (error && error.message) return alert(error.message);
      if (error) return alert(error);

      window.location.href = result.url;
    });
  };

  app.onUserLogin = function(){
    // Update user header
    // Direct to coming soon page?
  };
})(window);