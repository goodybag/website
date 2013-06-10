(function(exports){
  var app = exports.app = exports.app || {};

  app.init = function(){
    app.compileTemplates(templates);
    app.checkForAccessCode();
    app.setupSpinner();
    utils.domready(app.domready);

    // I know, I know.. not decoupled WHATEVER
    user.onAuth   = app.onUserAuth;
    user.onDeAuth = app.onUserDeAuth;

    user.loggedIn(function(error, result){
      if (error) return app.error(error);
    });
  };

  app.domready = function(){
    app.loadModals();
    jcf.customForms.replaceAll(); // Re-run form stuff for modals
    app.headerEvents();
    app.checkForPasswordReset();
    app.checkForPartialRegistration();
  };

  app.error = function(error, $el){
    // No XHR errors - they probably just canceled the request
    if (error.hasOwnProperty('status') && error.status == 0) return;

    if (error){
      var msg, detailsAdded = false;
      if (typeof error == "object")
        msg = error.message || (window.JSON ? window.JSON.stringify(error) : error);
      else
        msg = error;

      if (error.details){
        msg += "\n";
        for (var key in error.details){
          if ($el) $el.find('.field-' + key).addClass('error');
          if (error.details[key]){
            msg += "\n" + key + ": " + error.details[key] + ", ";
            detailsAdded = true;
          }
        }
        if (detailsAdded) msg = msg.substring(0, msg.length -2);
      }
      return alert(msg);
    }
  };

  app.loadUserHeader = function(){
    utils.dom('#user-info').html(
      templates.headerUserInfo(user.attributes)
    );
  };

  app.applyUserHeaderEvents = function(){
    utils.dom('#user-info .logout').click(function(e){
      e.preventDefault();

      user.logout();
    });
  };

  app.setupSpinner = function(){
    app.spinner = new Spinner(config.spinner);
  };

  app.headerEvents = function(){
    utils.dom('#header .btn-facebook').click(app.onFacebookBtnClick);
  };

  app.checkForAccessCode = function(){
    var params = utils.parseQueryParams();
    var code = params.code;
    if (code == null) return;

    var callback = function(error){
      if (error && error.message) alert(error.message);
      if (error) alert(error);
    }

    if (params['partialRegistrationToken'] != null) {
      user.completeRegistration({code:code}, params['partialRegistrationToken'], callback);
    } else {
      user.oauth(code, callback);
    }
  };

  app.checkForPasswordReset = function() {
    var match = /#reset-password\/(\w+)/g.exec(window.location.href);
    if (match == null || match.length !== 2) return;
    var token = match[1];
    app.onResetPasswordSubmit.token = token;
    window.location.href = '#password-reset';
    app.openPasswordResetModal();
  };

  app.checkForPartialRegistration = function() {
    var match = /complete-registration\/(\w+)/g.exec(window.location.href);
    console.log(match);
    if (match == null || match.length !== 2) return;
    var token = match[1];
    app.onPartialRegistrationSubmit.token = token;
    window.location.href = '#complete-registration';
    app.openPartialRegistrationModal(token);
  }

  app.openRegisterModal = function(){
    utils.dom('a[href="#facebook-popup-2"]').eq(0).trigger('click');
  };

  app.openLoginModal = function(){
    utils.dom('a[href="#facebook-popup"]').eq(0).trigger('click');
  };

  app.openPasswordResetModal = function() {
    utils.dom('a[href="#reset-password"]').eq(0).trigger('click');
  }

  app.openPartialRegistrationModal = function(token) {
    utils.dom('a[href="#complete-registration"]').eq(0).trigger('click');
    user.getPartialRegistrationEmail(token, function(error, results){
      if (error != null || results == null) return app.error(error, app.$partialRegistrationFrom), app.closeModals();
      app.$partialRegistrationForm.find('#email').val(results.email);
    });
  }

  app.closeModals = function(){
    jQuery.fancybox.close();
  };

  app.loadModals = function(){
    utils.dom(document.body).append(
      templates.loginModal()
    , templates.signUpModal()
    , templates.resetPasswordModal()
    , templates.forgotPasswordModal()
    , templates.partialRegistrationModal()
    );

    app.$loginForm = utils.dom('#login-form');
    app.$registerForm = utils.dom('#register-form');
    app.$resetPasswordForm = utils.dom('#reset-password-form');
    app.$forgotPasswordForm = utils.dom('#forgot-password-form');
    app.$partialRegistrationForm = utils.dom('#partial-registration-form');

    app.$loginForm.submit(app.onLoginSubmit);
    app.$registerForm.submit(app.onRegisterSubmit);
    app.$resetPasswordForm.submit(app.onResetPasswordSubmit);
    app.$forgotPasswordForm.submit(app.onForgotPasswordSubmit);
    app.$partialRegistrationForm.submit(app.onPartialRegistrationSubmit);

    utils.dom('a[href=#reset-password]').on('closed', function(e){window.location.href = '#';});
    utils.dom('a[href=#complete-registration]').on('closed', function(e){window.location.href = '#';});

    utils.dom('.popup-holder .btn-facebook :not(.btn-facebook-partial)').click(app.onFacebookBtnClick);
    utils.dom('.popup-holder .btn-facebook-partial').click(app.onFacebookPartialBtnClick);

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
    , $remember = app.$loginForm.find('#remember')
    , email     = $email.val()
    , password  = $password.val()
    , remember  = $remember.is(':checked')
    ;

    $password.val("");

    app.$loginForm.find('.field').removeClass('error');

    if (email == "") return app.error({
      message: 'You forgot to put in your email!'
    , details: { email: null }
    }, app.$loginForm);

    if (password == "") return app.error({
      message: 'You forgot to put in your password!'
    , details: { password: null }
    }, app.$loginForm);

    user.loggedIn(function(error, isLoggedIn){
      if (error) return app.error(error, app.$loginForm);

      if (isLoggedIn) return app.error("You're alraedy logged in!");

      user.auth(email, password, remember, function(error, result){
        if (error) return app.error(error, app.$loginForm);

        app.closeModals();
      });
    });
  };

  app.onRegisterSubmit = function(e){
    e.preventDefault();

    var $password = app.$registerForm.find('#pass-1');

    app.$registerForm.find('.field').removeClass('error');
    if ($password.val() != app.$registerForm.find('#pass-2').val())
      return app.error({
        message: 'Passwords must match'
      , details: { password: null }
      }, app.$registerForm);

    var data = {
      email:          app.$registerForm.find('#email').val()
    , screenName:     app.$registerForm.find('#user-2').val()
    , password:       $password.val()
    };

    app.$registerForm.find('input[type="password"]').val("");

    user.register(data, function(error, result){
      if (error) return app.error(error, app.$registerForm);

      app.closeModals();
    });
  };

  app.onResetPasswordSubmit = function(e) {
    e.preventDefault();

    app.$resetPasswordForm.find('.field').removeClass('error');

    var $pass1 = app.$resetPasswordForm.find('#pass1');
    var $pass2 = app.$resetPasswordForm.find('#pass2');

    if ($pass1.val() !== $pass2.val())
      return app.error({
        message: 'Passwords must match'
      , details: { pass1: null, pass2:null }
      }, app.$resetPasswordForm);

    if ($pass1.val() === '')
      return app.error({
        message: 'You must supply a password'
      , details: { pass1: null, pass2:null }
      }, app.$resetPasswordForm);

    var data = {
      password: $pass1.val()
    };

    $pass1.val('');
    $pass2.val('');

    user.resetPassword(data, app.onResetPasswordSubmit.token, function(error, result) {
      if (error) return app.error(error, app.$resetPasswordForm);
      window.location.href = '#';
      app.closeModals();
    });
  }

  app.onForgotPasswordSubmit = function(e) {
    e.preventDefault();

    app.$forgotPasswordForm.find('.field').removeClass('error');

    var $email = app.$forgotPasswordForm.find('#forgot-email');

    if ($email.val() === '')
      return app.error({
        message: 'You must supply an email'
        , details: { "forgot-email": null }
      }, app.$forgotPasswordForm);

    var data = {
      email: $email.val()
    };

    user.forgotPassword(data, function(error, result) {
      if (error) return app.error(error, app.$forgotPasswordForm);

      app.closeModals();
    });
  }

  app.onPartialRegistrationSubmit = function(e) {
    e.preventDefault();
    app.$partialRegistrationForm.find('.field').removeClass('error');

    var $password = app.$partialRegistrationForm.find('#pass-1');

    if ($password.val() != app.$partialRegistrationForm.find('#pass-2').val())
      return app.error({
        message: 'Passwords must match'
      , details: { password: null }
      }, app.$partialRegistrationForm);

    var data = {
      email:          app.$partialRegistrationForm.find('#email').val()
    , screenName:     app.$partialRegistrationForm.find('#user-2').val()
    , password:       $password.val()
    };

    app.$registerForm.find('input[type="password"]').val("");

    user.completeRegistration(data, app.onPartialRegistrationSubmit.token, function(error, result) {
      if (error) return app.error(error, app.$partialRegistrationForm);

      app.closeModals();
    });
  }

  app.onFacebookPartialBtnClick = function(e) {
    e.preventDefault();

    api.session.getOauthUrl(config.oauth.redirectUrl + '?partialRegistrationToken='+app.onPartialRegistrationSubmit.token, 'facebook', function(error, result){
      if (error && error.message) return alert(error.message);
      if (error) return alert(error);

      window.location.href = result.url;
    });
  }

  app.onFacebookBtnClick = function(e){
    e.preventDefault();

    api.session.getOauthUrl(config.oauth.redirectUrl, 'facebook', function(error, result){
      if (error && error.message) return alert(error.message);
      if (error) return alert(error);

      window.location.href = result.url;
    });
  };

  app.onUserAuth = function(){
    // Pre-panel behavior
    app.loadUserHeader();
    app.applyUserHeaderEvents();
    utils.dom('.pre-login').addClass('hide');
    utils.dom('.post-login').removeClass('hide');
  };

  app.onUserDeAuth = function(){
    utils.dom('.post-login').addClass('hide');
    utils.dom('.pre-login').removeClass('hide');
  };

})(window);
