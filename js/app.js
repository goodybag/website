(function(){
  var
    app = window.app = window.app || {}
  , productsOptions = { offset: 0, limit: 30, sort: 'random', hasPhoto: true }
  ;

  app.init = function(){
    app.compileTemplates(templates);

    utils.domready(function(){
      // I could probably use async to load in products and wait for dom at the same time
      // But oh well
      app.loadProducts();
    });
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
        if (!result) return alert('Please Login');

        var
          $el       = utils.dom(e.target)
        , pid       = $el.parents('.product-list-item').data('id')
        , feelings  = {}

          // Determine action
        , action = (
            $el.hasClass('like') ? 'isLiked'  : (
            $el.hasClass('want') ? 'isWanted' : (
            $el.hasClass('tried')  ? 'isTried'  : false
          )))
        ;

        // Somebody must have messed up the template or something
        if (!action) return alert("Something went wrong :(");

        // Update feelings and active class on element
        $el[((feelings[action] = !$el.hasClass('active')) ? 'add' : 'remove') + 'Class']('active');

        api.products.feelings(pid, feelings, function(error){
          if (error) return alert(error.message);
        });
      });
    });
  }
})();