(function(exports){
  var
    app       = exports.app = exports.app || {}
  , _init     = app.init
  , _domready = app.domready
  ;

  app.init = function(){
    if (_init) _init();
  };

  app.domready = function(){
    if (_domready) _domready();

    app.startBusinessesSpinner();
    app.loadBusinesses();
    utils.dom('#biz-search-form').submit(app.onBusinessSearchSubmit);
    utils.dom('#biz-request-form').submit(app.onBusinessRequestSubmit);
    utils.dom('#name-1').on('keyup', app.onBusinessSearchKeyUp);
  };

  app.startBusinessesSpinner = function(){
    app.spinner.spin(utils.dom('#main .spinner-wrap')[0]);
  };

  app.renderBusinesses = function(){
    var businesses;

    if (app.bizFilter){
      businesses = utils.filter(app.businesses, function(business){
        return business.name.toLowerCase().indexOf(app.bizFilter) > -1;
      });
    } else {
      businesses = app.businesses;
    }

    utils.dom('#businesses-list').html(
      templates.businesses({ businesses: businesses })
    );
  };

  app.loadBusinesses = function(callback){
    api.businesses.list({ limit: 1000, isGB: true, include: ['locations'] }, function(error, results){
      if (error) return callback ? callback(error) : error;

      app.businesses    = results;
      app.businessesId  = {};

      app.renderBusinesses();

      for (var i = 0, l = results.length; i < l; ++i){
        app.businessesId[results[i].id] = results[i];
      }

      app.applyBusinessesEvents();
      app.spinner.stop();

      if (callback) callback(null, app.businesses);
    });
  };

  app.applyBusinessesEvents = function(){
    utils.dom('#businesses-list a').click(app.businessListItemClick);
    utils.dom('#businesses-list img').lazyload({
      threshold:  300
    , effect:     'fadeIn'
    });
    initLightbox();
  };

  app.businessListItemClick = function(e){
    var el = e.target;
    while (el.tagName.toLowerCase() != 'a') el = el.parentNode;

    app.setLocationModalContent(
      templates.businessModal(app.businessesId[el.dataset.id])
    );
  };

  app.setLocationModalContent = function(content){
    if (!app.$businessModal) app.$businessModal = utils.dom('#popup-1');

    app.$businessModal.html(content);
  };

  app.onBusinessSearchSubmit = function(e){
    e.preventDefault();
    var el = utils.dom('#name-1')[0];
    if (app.bizFilter == el.value) return;

    app.bizFilter = el.value;
    app.renderBusinesses();

    // Throttle
    if (app.applyBusinessesEvents) clearTimeout(app.applyBusinessesEvents);
    setTimeout(app.applyBusinessesEvents, 200);
  };

  app.onBusinessSearchKeyUp = function(e){
    if (e.target.value != "") return;
    app.bizFilter = "";
    app.renderBusinesses();

    // Throttle
    if (app.applyBusinessesEvents) clearTimeout(app.applyBusinessesEvents);
    setTimeout(app.applyBusinessesEvents, 200);
  };

  app.onBusinessRequestSubmit = function(e){
    e.preventDefault();

    var $el = utils.dom(e.target).find('input').eq(0);
    if ($el.val() == "") return;

    if (app.businessRequestTimeout) clearTimeout(app.businessRequestTimeout);

    var $label  = utils.dom('#biz-request-form label');
    app.oldLabelText = app.oldLabelText || $label.html();

    $label.fadeOut(function(){
      $label.html([
        "Thanks! We'll get on it!"
      , "Nice one! We'll get right on it!"
      , "Good suggestion. We'll contact them"
      ][parseInt(Math.random() * 3)]);

      $label.fadeIn(function(){
        app.businessRequestTimeout = setTimeout(function(){
          $label.fadeOut(function(){
            $label.html(app.oldLabelText);
            $label.fadeIn();
          });
        }, 4000);
      });
    });

    api.businesses.addRequest($el.val());

    $el.val("");
  };
})(window);