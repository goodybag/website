(function(exports){
  var
    app = exports.app = exports.app || {}
  , productsOptions = { offset: 0, limit: 30, sort: 'random', hasPhoto: true }
  ;

  app.init = function(){
    app.compileTemplates(templates);
    app.checkForAccessCode();
  };

  app.headerEvents = function(){
    utils.dom('#header .btn-facebook').click(app.onFacebookBtnClick);
  };

  app.checkForAccessCode = function(){
    if (window.location.href.indexOf('code=') == -1) return;

    var code = window.location.href.split('code=')[1];
    code = code.split('/#_=_')[0];
    alert(code);

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
    initLightbox()
  };

  app.compileTemplates = function(tmpl){
    for (var key in tmpl){
      if (typeof tmpl[key] === "object") tmpl[key] = app.compileTemplates(tmpl[key]);
      else tmpl[key] = utils.compile(tmpl[key]);
    }
  };

  app.loadProducts = function(callback){
    callback = callback || utils.noop;

    api.products.list(productsOptions, function(error, products){
      if (error) return callback(error);

      app.loadProductsWithData(products);
    });
  };

  app.loadProductsWithData = function(products){
    var $list = utils.dom('#products-list'), html = "";

    for (var i = 0, l = products.length; i < l; ++i){
      html += templates.product(products[i]);
    }

    $list.html(html);

    app.applyProductsEvents($list);
  };

  app.applyProductsEvents = function($list){
    $list = $list || utils.dom('#products-list');

    // Apply PSD2HTML stuff
    initSlideBlocks();

    $list.find('.item-buttons a').click(function(e){
      e.preventDefault();

      // Ensure we're logged in, if not display the register modal
      user.loggedIn(function(error, result){
        if (error) return alert(error.message);

        // Display Modal
        if (!result) return app.openLoginModal();

        var
          $el       = utils.dom(e.target)
        , $parent   = $el.parents('.product-list-item')
        , pid       = $parent.data('id')
        , feelings  = {}

          // Determine action
        , action = (
            $el.hasClass('like')  ? 'isLiked'  : (
            $el.hasClass('want')  ? 'isWanted' : (
            $el.hasClass('tried') ? 'isTried'  : false
          )))
        ;

        // Somebody must have messed up the template or something
        if (!action) return alert("Something went wrong :(");

        // Update feelings and active class on element
        $el[((feelings[action] = !$el.hasClass('active')) ? 'add' : 'remove') + 'Class']('active');

        if (action == 'isLiked'){
          var $counter  = $parent.find('.like-counter');

          $counter.html(parseInt($counter.html()) + (feelings.isLiked ? 1 : -1));
        }

        api.products.feelings(pid, feelings, function(error){
          if (error) return alert(error.message);
        });
      });
    });
  }

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
    alert('logged in!');
  };
})(window);