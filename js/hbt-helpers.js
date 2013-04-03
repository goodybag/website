(function(exports){
  Handlebars.registerHelper('filepicker', function(url, width, height){
    if (!url) return;

    url = url.replace('www', 'cdn');
    url += "/convert?cache=true&fit=crop";

    if (width)  url += "&w=" + width;
    if (height) url += "&w=" + height;

    return url;
  });
})(window);