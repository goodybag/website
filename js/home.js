(function(exports){
  var
    app           = exports.app = exports.app || {}
  , _init         = app.init
  , _domready     = app.domready
  , _onUserDeAuth = app.onUserDeAuth
  , _onUserAuth   = app.onUserAuth

  , productsOptions = { offset: 0, limit: 30, sort: '-popular', hasPhoto: true }
  ;

  app.loadingProducts = false;

  app.domready = function(){
    if (_domready) _domready();

    app.startProductsSpinner()
    app.loadProducts();
    app.setupProductsInfiniScroll();

    utils.dom('.get-started-btn').click(function(e){
      e.preventDefault();
      utils.dom.smoothScroll({
        scrollTarget: '#main'
      , offset: -60
      });
    });
  };

  app.startProductsSpinner = function(){
    app.spinner.spin(utils.dom('#main .spinner-wrap')[0]);
  };

  app.reloadProducts = function(callback){
    utils.dom('#products-list').html("");

    productsOptions.offset = 0;

    app.loadProducts(callback);
  };

  app.loadProducts = function(callback){
    callback = callback || utils.noop;

    app.loadingProducts = true;

    api.products.food(productsOptions, function(error, products){
      if (error) return callback(error), app.loadingProducts = false;

      app.loadProductsWithData(products);

      app.loadingProducts = false;

      callback(null, products);
    });
  };

  app.loadProductsWithData = function(products){
    var $list = utils.dom('#products-list'), html = "";

    for (var i = 0, l = products.length; i < l; ++i){
      html += templates.product(products[i]);
    }

    html = $(html);
    app.applyProductsEvents(html);

    $list.append(html);

    // Apply PSD2HTML stuff
    initSlideBlocks(html);
  };

  app.finishedProducts = function(){

  };

  app.setupProductsInfiniScroll = function(){
    var $window = utils.dom(window);
    $window.scroll(function(){
      if ($window.scrollTop() >= (utils.dom(document).height() - $window.height() - config.infiniScrollHeight) && !app.loadingProducts){
        productsOptions.offset += productsOptions.limit;

        app.loadProducts();
      }
    });
  };

  app.applyProductsEvents = function($list){
    $list = $list || utils.dom('#products-list');

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

        if (feelings[action]) api.collections.add(user.attributes.id, 'all', pid);
        if (feelings[action]) api.collections.add(user.attributes.id, 'food', pid);
      });
    });
  };

  app.onUserAuth = function(user, wasFromAuthing){
    // If event was from actual authing and not a session grab
    // Then reload the products list with proper userLikes and such
    if (wasFromAuthing) app.reloadProducts();

    _onUserAuth();
  };

  app.onUserDeAuth = function(){
    _onUserDeAuth();
    utils.dom('.item-buttons a').removeClass('active');
  };
})(window);