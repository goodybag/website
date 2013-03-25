(function(){
  var templates = window.templates = window.templates || {};

  templates.product = [
    '<li data-id="{{id}}" class="product-list-item">'
    , '<header class="heading">'
      , '<h2>{{#if name}}{{name}}{{else}}Awesome Product{{/if}}</h2>'
      , '<a href="#" class="hash">@ {{businessName}}</a>'
    , '</header>'
    , '<img src="{{photoUrl}}/convert?w=240&h=240" alt="{{description}}" onerror="this.src=\'images/img-\' + (Math.floor(Math.random() * 10) + 1) + \'.jpg\'">'
    , '<ul class="item-buttons">'
      , '<li><a href="#" class="want{{#if userWants}} active{{/if}}">want</a></li>'
      , '<li><a href="#" class="like{{#if userLikes}} active{{/if}}">like it</a></li>'
      , '<li><a href="#" class="tried{{#if userTried}} active{{/if}}">tried</a></li>'
    , '</ul>'
    , '<span class="like-counter">{{likes}}</span>'
  , '</li>'
  ].join('\n');
})();