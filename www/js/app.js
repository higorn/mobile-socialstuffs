'use strict';

var app = ons.bootstrap('app', [
  'onsen',
  'ngCordova'
]);

app.run(['$rootScope', function($rootScope) {

  ons.ready(function() {

/*    if (undefined !== window.cordova) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }*/

    var options = {
      animation: "none",
      onTransitionEnd: function() {
        if(undefined !== window.navigator.splashscreen) {
          navigator.splashscreen.hide();
        }
      }
    };

    appNavigator.resetToPage('page/tabs.html', options);

    /*
     * The two listeners below are necessary to fix an known issue in the
     * ons-navigator. The workaround is described in the official forum with
     * endorsement of one of the OnsenUI Team's developer.
     * https://github.com/OnsenUI/OnsenUI/issues/349
     */
    appNavigator.on('prepush', function(event) {
      if($rootScope.isPushing) {
        event.cancel();
      } else {
        $rootScope.isPushing = true;
      }
    });
    appNavigator.on('postpush', function(event) {
      $rootScope.isPushing = false;
    });

  });
}]);
