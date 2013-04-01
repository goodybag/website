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
    app.$form = utils.dom('#contact-form').submit(app.onContactFormSubmit)
  };

  app.displayError = function(error){
    var message = error.message || error;
    if (error.details){
      message += ": ";

      for (var key in error.details){
        message += key + ", ";
      }

      message = message.substring(0, message.length - 2);
    }
    utils.dom('#contact-form h2').html(message).css('color', '#f50000');
  };

  app.displaySuccess = function(){
    utils.dom('#contact-form h2').html("Alright! We got your message and we'll be contacting you shortly.").css('color', '')
  };

  app.onContactFormSubmit = function(e){
    e.preventDefault();

    app.spinner.spin(utils.dom('#main .spinner-wrap')[0]);

    if (!app.$form) app.$form = utils.dom(e.target);

    var info = {
      name:           app.$form.find('#id-1').val()
    , businessName:   app.$form.find('#id-2').val()
    , email:          app.$form.find('#id-3').val()
    , zip:            app.$form.find('#id-4').val()
    , comments:       app.$form.find('#id-5').val()
    };

    info.zip = parseInt(info.zip);

    api.businesses.createContactEntry(info, function(error){
      app.spinner.stop();

      if (error) return app.displayError(error);

      app.$form.find('input, textarea').val("");

      app.displaySuccess();
    });
  };
})(window);