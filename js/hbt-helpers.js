(function(exports){
  Handlebars.registerHelper('filepicker', function(url, width, height){
    if (!url) return "http://cdn.filepicker.io/api/file/TovGkwF7TCeFj3MQowEr/convert?w=" + (width || 100) + "&h=" + (height || 100) + "&fit=crop";

    url = url.replace('www', 'cdn');
    url += "/convert?cache=true&fit=crop";

    if (width)  url += "&w=" + width;
    if (height) url += "&w=" + height;

    return url;
  });

  Handlebars.registerHelper('headerName', function(firstName, lastName){
    if (!firstName) return config.defaultName;

    return firstName + " " + lastName[0].toUpperCase() + ".";
  });
})(window);