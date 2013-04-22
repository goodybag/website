(function(exports){
  var templates = exports.templates = exports.templates || {};

  templates.product = [
    '<li data-id="{{id}}" class="product-list-item">'
  , '  <header class="heading">'
  , '    <h2>{{#if name}}{{name}}{{else}}Awesome Product{{/if}}</h2>'
  , '    <a href="#" class="hash">@ {{businessName}}</a>'
  , '  </header>'
  , '  <img src="{{filepicker photoUrl 240 240}}" width="240" height="240" alt="{{description}}" onerror="this.src = \'http://cdn.filepicker.io/api/file/TovGkwF7TCeFj3MQowEr/convert?w=240&h=240&fit=crop\'">'
  , '  <ul class="item-buttons">'
  , '    <li><a href="#" class="want{{#if userWants}} active{{/if}}">want</a></li>'
  , '    <li><a href="#" class="like{{#if userLikes}} active{{/if}}">like it</a></li>'
  , '    <li><a href="#" class="tried{{#if userTried}} active{{/if}}">tried</a></li>'
  , '  </ul>'
  , '  <span class="like-counter">{{likes}}</span>'
  , '</li>'
  ].join('\n');

  templates.signUpModal = [
    '<div class="popup-holder">'
  , '  <div class="login-box lightbox" id="facebook-popup-2">'
  , '    <a href="#" class="close">close</a>'
  , '    <h3>Sign Up</h3>'
  , '    <a href="#" class="btn-facebook">Connect with Facebook</a>'
  , '    <span class="or">or</span>'
  , '    <form action="#" class="sign-form" id="register-form">'
  , '      <fieldset>'
  , '        <div class="row">'
  , '          <label for="user-2">Username</label>'
  , '          <div class="text">'
  , '            <input type="text" id="user-2" class="field field-screenName" placeholder="Enter Username">'
  , '          </div>'
  , '        </div>'
  , '        <div class="row">'
  , '          <label for="email">*Email (required)</label>'
  , '          <div class="text">'
  , '            <input type="text" id="email" class="field field-email" placeholder="Enter Email Address">'
  , '          </div>'
  , '        </div>'
  , '        <div class="row">'
  , '          <div class="item">'
  , '            <label for="pass-1">*Password (required)</label>'
  , '            <div class="text">'
  , '              <input type="password" id="pass-1" class="field field-password" placeholder="Enter Password">'
  , '            </div>'
  , '          </div>'
  , '          <div class="item">'
  , '            <label for="pass-2">*Confirm Password</label>'
  , '            <div class="text">'
  , '              <input type="password" id="pass-2" class="field field-password" placeholder="Confirm Password">'
  , '            </div>'
  , '          </div>'
  , '        </div>'
  , '        <button><span>Sign Up</span></button>'
  , '      </fieldset>'
  , '    </form>'
  , '  </div>'
  , '</div>'
  ].join('\n');

  templates.loginModal = [
    '<div class="popup-holder">'
  , '  <div class="login-box lightbox" id="facebook-popup">'
  , '    <a href="#" class="close">close</a>'
  , '    <h3>Log In</h3>'
  , '    <a href="#" class="btn-facebook">Connect with Facebook</a>'
  , '    <span class="or">or</span>'
  , '    <form action="#" class="sign-form" id="login-form">'
  , '      <fieldset>'
  , '        <div class="row">'
  , '          <label for="user">Email</label>'
  , '          <div class="text">'
  , '            <input type="text" class="field field-email" id="user">'
  , '          </div>'
  , '        </div>'
  , '        <div class="row">'
  , '          <label for="pass">Password</label>'
  , '          <div class="text">'
  , '            <input type="password" class="field field-password" id="pass" placeholder="********">'
  , '          </div>'
  , '        </div>'
  , '        <div class="check-row">'
  , '          <input type="checkbox" id="remember" checked="checked">'
  , '          <label for="remember">Remember Me</label>'
  , '          <a href="#forgot-password" class="forgot lightbox">Forgot password?</a>'
  , '        </div>'
  , '        <button><span>Log In</span></button>'
  , '      </fieldset>'
  , '    </form>'
  , '  </div>'
  , '</div>'
  ].join('\n');

  templates.businesses = [
    '{{#each businesses}}'
  , '<li>'
  , '  <a class="lightbox" href="#popup-1" data-id="{{this.id}}">'
  , '    <img src="http://cdn.filepicker.io/api/file/TovGkwF7TCeFj3MQowEr/convert?w=114&h=114&fit=crop" data-original="{{filepicker this.logoUrl 114 114}}" width="114" height="114" alt="{{this.name}}">'
  , '    <strong>{{this.name}}</strong>'
  , '  </a>'
  , '</li>'
  , '{{/each}}'
  ].join('\n');

  templates.businessModal = [
    '<header class="heading">'
  , '  <h3>{{name}}</h3>'
  , '  <a href="#" class="close">close</a>'
  , '</header>'
  , '<div class="holder columns">'
  , '<aside class="main-info column">'
  , '  <img src="{{filepicker logoUrl 114 114}}" width="114" height="114" alt="{{name}}">'
  , '  {{#if url}}<a target="_blank" href="{{url}}" class="link">Visit website</a>{{/if}}'
  , '</aside>'
  , '<div class="column right">'
    , '{{#each locations}}'
    , '<div class="contact-info">'
    , '  <address>{{this.street1}}, {{#if this.street2}}{{this.street2}}, {{/if}}{{this.city}}, {{this.state}} {{this.zip}}</address>'
    , '  <em class="phone">{{this.phone}}</em>'
    , '  <a target="_blank" href="http://maps.google.com/?q={{../name}} {{this.street1}}, {{#if this.street2}}{{this.street2}}, {{/if}}{{this.city}}, {{this.state}} {{this.zip}}" class="link">View on map</a>'
    , '</div>'
    , '{{/each}}'
  , '</div>'
  ].join('\n');

  templates.headerUserInfo = [
    '<img class="avatar" src="{{filepicker avatarUrl 44 44}}" onerror="this.src = \'http://cdn.filepicker.io/api/file/TovGkwF7TCeFj3MQowEr/convert?w=240&h=240&fit=crop\'" alt="user avatar">'
  , '<div class="info">'
  , '  {{headerName  firstName lastName screenName}}'
  , '  <br />'
  , '  <a href="#" class="logout">Logout</a>'
  , '</div>'
  ].join('\n');

  templates.resetPasswordModal = [
    '<div class="popup-holder">'
  , '  <div class="login-box lightbox" id="reset-password">'
  , '    <a href="#" class="close">close</a>'
  , '    <h3>Reset Password</h3>'
  , '    <form action="#" class="sign-form" id="reset-password-form">'
  , '      <fieldset>'
  , '        <div class="row">'
  , '          <label for="pass1">New Password</label>'
  , '          <div class="text">'
  , '            <input type="password" class="field field-password" id="pass1" autofocus>'
  , '          </div>'
  , '        </div>'
  , '        <div class="row">'
  , '          <label for="pass2">Confirm New Password</label>'
  , '          <div class="text">'
  , '            <input type="password" class="field field-password" id="pass2">'
  , '          </div>'
  , '        </div>'
  , '        <button><span>Reset</span></button>'
  , '      </fieldset>'
  , '    </form>'
  , '  </div>'
  , '</div>'
  ].join('\n');

  templates.forgotPasswordModal = [
    '<div class="popup-holder">'
  , '  <div class="login-box lightbox" id="forgot-password">'
  , '    <a href="#" class="close">close</a>'
  , '    <h3>Forgot Password</h3>'
  , '    <form action="#" class="sign-form" id="forgot-password-form">'
  , '      <fieldset>'
  , '        <div class="row">'
  , '          <label for="email">Email</label>'
  , '          <div class="text">'
  , '            <input type="text" class="field field-email" id="forgot-email" placeholder="me@example.com" autofocus>'
  , '          </div>'
  , '        </div>'
  , '        <button><span>Send Email</span></button>'
  , '      </fieldset>'
  , '    </form>'
  , '  </div>'
  , '</div>'
  ].join('\n');

})(window);
