'use strict';
app.controller('TabsCtrl', ['$scope', '$cordovaCamera', '$cordovaFacebook', function($scope, $cordovaCamera, $cordovaFacebook) {

  var pages = ['home', 'comments', 'activity'];
  var pagesIndex = {home: 0, comments: 1, activity: 2};
  var carousel = undefined;
  //$scope.url = 'http://www.pull4up.com.br';
  $scope.dialogs = {};
  $scope.$watch('page', function(newVal, oldVal) {

    carousel && carousel.setActiveCarouselItemIndex(pagesIndex[newVal]);
  });
  $scope.page = 'home';

  document.addEventListener('ons-carousel:init', function(e) {
    carousel = e.component;
    carousel.on('postchange', function(event) {
      $scope.page = pages[event.activeIndex];
      !$scope.$$phase && $scope.$apply();
    });
  })

  $scope.show = function(dlg) {
    $cordovaFacebook.getLoginStatus().then(function(resp) {

      console.log('resp: '+JSON.stringify(resp));
      if (resp.status === 'connected') {
        if (!$scope.dialogs[dlg]) {
          ons.createDialog(dlg, {parentScope: $scope}).then(function(dialog) {
            $scope.dialogs[dlg] = dialog;
            dialog.show();
          });
        } else {
          $scope.dialogs[dlg].show();
        }
      } else {

        $scope.appNavigator.pushPage('page/login.html');
      }

    }, function(error) {

      console.log('error: '+JSON.stringify(error));
    });
  }

  $scope.logout = function() {

    $cordovaFacebook.logout().then(function(success) {
      console.log(success);
    }, function(error) {
      console.log(error);
    });
  }

  $scope.takePic = function() {
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 100,
      targetHeight: 100,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      //var image = document.getElementById('pic');
      //image.src = 'data:image/jpeg;base64,'+imageData;
      $scope.image = 'data:image/jpeg;base64,'+imageData;
    }, function(error) {
      console.log(error);
    });
  }
}]);

app.controller('ShareCtrl', ['$scope', '$cordovaSocialSharing', '$cordovaFacebook', function($scope, $cordovaSocialSharing, $cordovaFacebook) {

  $scope.medias = [
    {label: 'Facebook', icon: 'fa-facebook-square'},
    {label: 'Email', icon: 'fa-envelope'}
  ];

  $scope.share = function(media) {
    $cordovaSocialSharing['shareVia'+media]($scope.message, $scope.image, $scope.url).then(function(result) {
      console.log('res: '+JSON.stringify(result));
    }, function(error) {
      console.log('error: '+JSON.stringify(error));
      $cordovaFacebook.showDialog({
        method: 'share',
        href: $scope.url,
      }).then(function(result) {
        console.log('res: '+JSON.stringify(result));
      }, function(error) {
        console.log('error: '+JSON.stringify(error));
      });
    })
  }
}]);

app.controller('LoginCtrl', ['$scope', '$cordovaFacebook', function($scope, $cordovaFacebook) {

  $scope.fbLogin = function() {

    $cordovaFacebook.login(['public_profile', 'email', 'user_friends']).then(function(resp) {
      console.log('resp: '+JSON.stringify(resp));
      if (resp.status === 'connected') {

        $cordovaFacebook.api('me', ['public_profile', 'email']).then(function(result) {

          console.log('res: '+JSON.stringify(result));
          $scope.appNavigator.popPage();
        }, function(error) {

          console.log('error: '+JSON.stringify(error));
        })
      } else {
        alert('Facebook login failed');
      }
    }, function(error) {
      console.log(error);
    });

  }

  $scope.fbLoginOAuth = function() {

    $cordovaOauth.facebook('1629722923983060', ['email', 'public_profile']).then(function(result) {
      console.log('res: '+JSON.stringify(result));
      $scope.appNavigator.popPage();
    }, function(error) {

      console.log('error: '+JSON.stringify(error));
    });
  }
}]);
