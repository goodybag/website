(function(exports){
  var
    app   = exports.app = exports.app || {}
  , _init = app.init
  ;

  app.init = function(){
    if (_init) _init();
  };

  app.startBusinessesSpinner = function(){
    app.spinner.spin(utils.dom('#main .spinner-wrap')[0]);
  };

  app.locationsEvents = function(){
    utils.dom('#name-1').on('keyup', app.onBusinessSearchKeyUp);
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

  app.onBusinessSearchKeyUp = function(e){
    if (app.bizFilter == e.target.value) return;

    app.bizFilter = e.target.value;
    app.renderBusinesses();

    // Throttle
    if (app.applyBusinessesEvents) clearTimeout(app.applyBusinessesEvents);
    setTimeout(app.applyBusinessesEvents, 500);
  };
})(window);