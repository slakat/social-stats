/**  * AngularJS Tutorial 1  * @author Nick Kaye <nick.c.kaye@gmail.com>  */


/**
 * Main AngularJS Web Application
 */
var app = angular.module('social-stats', [
  'ngRoute','ngCsvImport', 'hljs', 'ngSanitize', 'ngCsv'
]);

/**
 * Configure the Routes
 */
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    // Home
    .when("/", {templateUrl: "partials/home.html", controller: "MainCtrl"})
    .when("/results", {templateUrl: "partials/results.html", controller: "ResultsCtrl"})
    // Pages
    // else 404
    .otherwise("/404", {templateUrl: "partials/404.html", controller: "PageCtrl"});
}]);



app.controller('MainCtrl', function($scope, $http, $location, $parse) {
  this.partialId="home";

  this.getPartialUrl = function() {
        return 'partials/'+this.partialId+'.html';
      };



  $scope.getStats = function(url){
    $location.path("/results").search({url: url});

  };

    $scope.getStats = function(url){
    $location.path("/results").search({url: url});

  };

  $scope.csv = {
      content: null,
      header: true,
      headerVisible: false,
      separator: ',',
      separatorVisible: false,
      result: null,
      encoding: 'ISO-8859-1',
      encodingVisible: false,
      accept: '.csv'
    };

  var _lastGoodResult = '';
  $scope.toPrettyJSON = function (json, tabWidth) {
      var objStr = JSON.stringify(json);
      var obj = null;
      try {
        obj = $parse(objStr)({});
      } catch(e){
        // eat $parse error
        return _lastGoodResult;
      }

      var result = JSON.stringify(obj, null, Number(tabWidth));
      _lastGoodResult = result;

      return result;
    };

});

/**
 * Controls the Blog
 */
app.controller('ResultsCtrl', function ( $scope, $location, $http, $route ) {
  console.log("Results Controller reporting for duty.");

  var url = $route.current.params['url'];//'http://www.emol.com/noticias/internacional/2014/12/19/695424/bolivia-afirma-en-video-que-chile-le-arrebato-territorio-y-se-apodero-de-sus-riquezas.html';
  //var path = 'https://api.facebook.com/method/fql.query?format=json&query=SELECT+url,normalized_url,total_count,share_count,comment_count,like_count,click_count,commentsbox_count+FROM+link_stat+WHERE+url+%3D+%27'+url+'%27';
  var path =  'https://graph.facebook.com/fql?q=SELECT+url,normalized_url,total_count,share_count,comment_count,like_count,click_count,commentsbox_count+FROM+link_stat+WHERE+url+%3D+%27'+url+'%27&access_token=1233283913478350|1843acc2cf7c74808e4659af6a6a7550'
  $http.get(path).
  success(function(data, status, headers, config) {
    $scope.items = data.data;
    console.log(data.data);
  }).
  error(function(data, status, headers, config) {
    // log error
  });


  this.partialId="results";

  this.getPartialUrl = function() {
    return 'partials/'+this.partialId+'.html';
  };


});

/**
 * Controls all other Pages
 */
app.controller('PageCtrl', function ($scope, $location, $anchorScroll, $routeParams) {
  console.log("Page Controller reporting for duty.");

  // Activates the Carousel
  $('.carousel').carousel({
    interval: 5000
  });

  // Activates Tooltips for Social Links
  $('.tooltip-social').tooltip({
    selector: "a[data-toggle=tooltip]"
  })
});

app.controller('Downloadctrl', function ($scope, $http) {
  $scope.init = function(batch)
  {
    $scope.filename = "test";


    $scope.separator = ',';
    $scope.results = [];
    $scope.errors = [];
    var index = 0;
    //for (var i = 0, len = batch.length; i < len; i++) {
    angular.forEach(batch, function(value, key){
      var url = value.url;//'http://www.emol.com/noticias/internacional/2014/12/19/695424/bolivia-afirma-en-video-que-chile-le-arrebato-territorio-y-se-apodero-de-sus-riquezas.html';
      //var path = 'https://api.facebook.com/method/fql.query?format=json&query=SELECT+url,normalized_url,total_count,share_count,comment_count,like_count,click_count,commentsbox_count+FROM+link_stat+WHERE+url+%3D+%27'+url+'%27';
      var path =  'https://graph.facebook.com/fql?q=SELECT+url,normalized_url,total_count,share_count,comment_count,like_count,click_count,commentsbox_count+FROM+link_stat+WHERE+url+%3D+%27'+url+'%27&access_token=1233283913478350|1843acc2cf7c74808e4659af6a6a7550'

      $http.get(path).
      success(function(d, status, headers, config) {
        console.log(index);
        data = d.data[0];
        $scope.results.push({url: data.url, share_count: data.share_count, like_count: data.like_count, comment_count: data.comment_count,total_count: data.total_count, commentsbox_count: data.commentsbox_count});
        index=index+1;
      }).
      error(function(data, status, headers, config) {
        // log error
        console.log(data);
        $scope.results.push({url: url, share_count: '', like_count: '', comment_count: '',total_count: '', commentsbox_count: ''})
        $scope.errors.push({url: url, share_count: '', like_count: '', comment_count: '',total_count: '', commentsbox_count: ''})

      });

    });
    
  };

$scope.getHeader = function () {return ['url', 'share_count']};
  
  
});


