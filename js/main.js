/**
 * AngularJS Tutorial 1
 * @author Nick Kaye <nick.c.kaye@gmail.com>
 */


/**
 * Main AngularJS Web Application
 */
var app = angular.module('tutorialWebApp', [
  'ngRoute'
]);

/**
 * Configure the Routes
 */
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    // Home
    .when("/", {templateUrl: "partials/home.html", controller: "MainCtrl"})
    // Pages
    // else 404
    .otherwise("/404", {templateUrl: "partials/404.html", controller: "PageCtrl"});
}]);

app.run(function($location, $rootScope) {
  $rootScope.$on('$viewContentLoaded', function() {
     $rootScope.$watch(function() { return $location.search() }, function(search) {
       var scrollPos = 0 
       var old =search;
       $location.search('scroll',null);
       if (old.hasOwnProperty('scroll')) {
         var $target = $('#' + old.scroll);
         var scrollPos = $target.offset().top;
       }
       $("body,html").animate({scrollTop: scrollPos}, "slow");

     });  
   });   
 })

app.directive('scrollToItem', function() {                                                      
    return {                                                                                 
        restrict: 'A',                                                                       
        scope: {                                                                             
            scrollTo: "@"                                                                    
        },                                                                                   
        link: function(scope, $elm,attr) {                                                   

            $elm.on('click', function() {                                                    
                $('html,body').animate({scrollTop: $(scope.scrollTo).offset().top }, "slow");
            });                                                                              
        }                                                                                    
    }}) 

app.controller('MainCtrl', function($scope) {
  $scope.items = [];
  for (var i=0; i<100; i++) { $scope.items.push(i); };  
  this.partialId="home_en";

  this.getPartialUrl = function() {
        return 'partials/'+this.partialId+'.html';
      };

});

/**
 * Controls the Blog
 */
app.controller('BlogCtrl', function (/* $scope, $location, $http */) {
  console.log("Blog Controller reporting for duty.");
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


app.directive('scrollOnClick', function() {
  return {
    restrict: 'A',
    link: function(scope, $elm, attrs) {
      var idToScroll = attrs.href;
      $elm.on('click', function() {
        var $target;
        if (idToScroll) {
          $target = $(idToScroll);
        } else {
          $target = $elm;
        }
        $("body").animate({scrollTop: $target.offset().top}, "slow");
        scroll();
      });
    }
  }
});


$(window).bind("load", function() {
  scroll();
});

function scroll(){
var bg;
  
  bg = {
    $layer: $('.bg-layer'),
    curr: 1,
    active: true,
    start: function() {
      this.getSections();
      if (this.sections.length === 1) {
        return;
      }
      return this.watchScroll();
    },
    getSections: function() {
      this.sections = [];
      return $("section").each(function(i, el) {
        return $.each($(this).attr('class').split(' '), (function(_this) {
          return function(i_class, color) {
            var item;
            if (color.indexOf('color') > -1) {
              item = {
                color: color,
                pos: i === 0 ? 0 : $(_this).offset().top - 300
              };
              return bg.sections.push(item);
            }
          };
        })(this));
      });
    },
    updateColor: function(i) {
      var info;
      info = bg.sections[i];
      bg.$layer.removeClass("on");
      $(".bg-layer." + info.color).addClass("on");
      this.curr = i;
      return this.getSections();
    },
    navTrigger: $(".section-1"),
    nav: $(".nav-bar"),
    watchScroll: function() {
      $(window).scroll((function(_this) {
        return function() {
          var pos;
          pos = $(window).scrollTop();
          if (pos < bg.sections[1].pos) {
            if (bg.curr !== 0) {
              bg.updateColor(0);
            }
          } else if (pos > bg.sections[bg.sections.length - 1].pos) {
            if (bg.curr !== (bg.sections.length - 1)) {
              bg.updateColor(bg.sections.length - 1);
            }
          } else {
            $.each(bg.sections, function(i, el) {
              if (i === 0) {
                return;
              }
              if (pos < el.pos && pos > bg.sections[i - 1].pos && bg.curr !== (i - 1)) {
                return bg.updateColor(i - 1);
              }
            });
          }
          if (pos > _this.navTrigger.offset().top && !_this.navFixed) {
            _this.nav.addClass('affix');
            return _this.navFixed = true;
          } else if (pos < _this.navTrigger.offset().top && _this.navFixed) {
            _this.nav.removeClass('affix');
            return _this.navFixed = false;
          }
        };
      })(this));
      return $(window).resize((function(_this) {
        return function() {
          var w;
          w = $(window).width();
          if (w < 550 && _this.active) {
            return _this.active = false;
          } else if (w > 550 && !_this.active) {
            return _this.active = true;
          }
        };
      })(this));
    }
  };

  bg.start();
};

/*function scroll() {
  var colors = [
  [0, 100, 50],
  [113, 75, 25],
  [240, 87, 40],
  [328, 24, 40]
],
el = $('body')[0], // Element to be scrolled
length = colors.length,                        // Number of colors
height = Math.round(el.offsetHeight / length); // Height of the segment between two colors

  var i = Math.floor(el.scrollTop / height),   // Start color index
      d = el.scrollTop % height / height,      // Which part of the segment between start color and end color is passed
      c1 = colors[i],                          // Start color
      c2 = colors[(i+1)%length],               // End color
      h = c1[0] + Math.round((c2[0] - c1[0]) * d),
      s = c1[1] + Math.round((c2[1] - c1[1]) * d),
      l = c1[2] + Math.round((c2[2] - c1[2]) * d);
  el.style['background-color'] = ['hsl(', h, ', ', s+'%, ', l, '%)'].join('');
}
*/