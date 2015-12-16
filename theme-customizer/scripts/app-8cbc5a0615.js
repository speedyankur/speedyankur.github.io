(function() {
  'use strict';

  angular
    .module('themeMaker', ['ngAnimate', 'ngMessages', 'ui.router', 'ui.bootstrap', 'toastr', 'less', 'colorpicker.module', 'ngclipboard' ,'ngStorage']);

})();

(function() {
    'use strict';

    angular
        .module('themeMaker')
        .directive('lessVariableListing', lessVariableListing)
        .controller('ShowModifiedVariablesCtrl', ["$scope", "$uibModalInstance", "items", "toastr", function($scope, $uibModalInstance, items, toastr) {
            $scope.items = items;
            $scope.ok = function() {
                $uibModalInstance.dismiss('cancel');
            };
            $scope.onCopiedSuccess = function(){
                $uibModalInstance.dismiss('cancel');
                toastr.success('Less Variables copied to Clipboard.');
            }
        }])
        .controller('saveThemeCtrl', ["$scope", "$uibModalInstance", "items", "$localStorage", "toastr", function($scope, $uibModalInstance, items, $localStorage, toastr) {
            $scope.canSaveTheme = items.length>0?true:false;
            $scope.themeName = "";
            var savedTheme = [];
            $scope.ok = function() {
                var allSavedThemes = $localStorage.themes || "[]"
                var savedThemes = JSON.parse(allSavedThemes);
                if(savedThemes.length>=10){
                    toastr.error('Can not save more than 10 themes in this version.')
                    return;                    
                }
                for(var i=0;i<savedThemes.length;i++){
                    if($scope.themeName==savedThemes[i].name)
                    {
                        toastr.error('Theme with this name already exists, Please pick anoher name')
                        return;
                    }
                }
                savedThemes.push({
                    name:$scope.themeName,
                    data:JSON.stringify(items)
                });
                $localStorage.themes = JSON.stringify(savedThemes);
                $uibModalInstance.dismiss('cancel');
                toastr.success('Theme Saved Successfully..');
            };
            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };

        }])
        .controller('loadThemeCtrl', ["$scope", "$uibModalInstance", "$localStorage", "toastr", function($scope, $uibModalInstance, $localStorage, toastr) {
            var allSavedThemes = $localStorage.themes || "[]";
            $scope.allSavedThemes = JSON.parse(allSavedThemes);
            $scope.ok = function() {
                $uibModalInstance.dismiss('cancel');
            };
            $scope.loadTheme = function(theme) {                
                $uibModalInstance.close(theme);
            };  
            $scope.delete = function(theme){
                $scope.allSavedThemes.splice($scope.allSavedThemes.indexOf(theme), 1)
                $localStorage.themes = JSON.stringify($scope.allSavedThemes);
            }          
        }]);


    /** @ngInject */
    function lessVariableListing() {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/components/directives/lessVariablesListing/lessVariableListing.html',
            controller: lessVariableListingController,
            controllerAs: 'vm',
            bindToController: true
        };

        lessVariableListingController.$inject = ["lessParser", "$state", "$uibModal", "toastr"];
        return directive;



        /** @ngInject */
        function lessVariableListingController(lessParser, $state, $uibModal, toastr) {
            var lessVars = [];
            lessVars['buttons'] = ['@ml-primary-button-text-color',
                '@ml-button-base-font-size',            
                '@ml-primary-button-outline-color',
                '@ml-primary-button-hover-background',
                '@ml-primary-button-hover-outline-color',
                '@ml-secondary-button-font-size',
                '@ml-secondary-button-text-color',
                '@ml-button-gradient-right-color',
                '@ml-button-gradient-left-color']
            lessVars['globalCart'] = ['@ml-gray-dark',
                '@ml-globalcart-itemInfo-background-color',
                '@ml-globalcart-layer-background-color',
                '@ml-globalcart-layer-border-color',
                '@ml-globalcart-itemInfo-border-color',
                '@ml-globalcart-total-border-color',
                '@ml-globalcart-itemHeaderBlock-border-color',
                '@ml-globalcart-container-max-width',
                '@ml-globalcart-container-min-width',
            ];
            lessVars['header'] = ['@ml-header-text-color',
                '@ml-header-border-color',
                '@ml-header-global-cart-count-color',
                '@ml-globalcart-link-text-color',
                '@ml-header-background-color',
                '@ml-header-icon-color',
                '@ml-header-icon-font-size',
                '@ml-header-height-base',
                '@ml-bg-gradient-left-color',
                '@ml-bg-gradient-right-color'
            ];
            lessVars['liteRegistration'] = [
                '@ml-lite-registration-toggle-active-background-color',
                '@ml-lite-registration-toggle-background-color',
                '@ml-lite-registration-toggle-text-color',
                '@ml-lite-registration-background-color',
                '@ml-lite-registration-border-color',
                '@ml-lite-registration-placeholder-color',
                '@ml-lite-registration-toggle-option-active-text-color',
                '@ml-lite-registration-dialog-width'
            ];
            var vm = this;
            vm.modifyVar = function(variable) {
                if (variable.currentValue != variable.defaultValue) {
                    var obj = {};
                    for (var i = 0; i < vm.lessVars.length; i++) {
                        if (vm.lessVars[i].currentValue != vm.lessVars[i].defaultValue) {
                            if (vm.lessVars[i].type == 'Dimension')
                                obj[vm.lessVars[i].name] = vm.lessVars[i].currentValue + 'px';
                            else
                                obj[vm.lessVars[i].name] = vm.lessVars[i].currentValue;
                        };
                    }
                    less.modifyVars(obj);
                }
            }
            vm.modifyAllVariables = function(){
                var obj = {};
                for (var i = 0; i < vm.lessVars.length; i++) {
                    if (vm.lessVars[i].currentValue != vm.lessVars[i].defaultValue) {
                        if (vm.lessVars[i].type == 'Dimension')
                            obj[vm.lessVars[i].name] = vm.lessVars[i].currentValue + 'px';
                        else
                            obj[vm.lessVars[i].name] = vm.lessVars[i].currentValue;
                    };
                }
                less.modifyVars(obj);
            }
            vm.loadTheme = function(){
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'loadTheme.html',
                    controller: 'loadThemeCtrl',
                    size: 'lg',
                    resolve: {
                        items: function() {
                            
                            return [];
                        }
                    }
                });
                modalInstance.result.then(function (theme) {
                    console.log(theme);
                    var themeData = JSON.parse(theme.data);
                    for(var j=0;j<themeData.length;j++){
                        for (var i = 0; i < vm.lessVars.length; i++) {
                            if(vm.lessVars[i].name==themeData[j].name){
                                vm.lessVars[i].currentValue = themeData[j].value;
                                break;
                            }
                        }                  
                    }
                    vm.modifyAllVariables();
                    toastr.success('Theme Loaded Successfully..');
                }, function () {
                  console.log('Modal dismissed at: ' + new Date());
                });

            }            
            vm.saveTheme = function(){
                var modifiedArray = getModifiedVariable();
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'saveTheme.html',
                    controller: 'saveThemeCtrl',
                    size: 'lg',
                    resolve: {
                        items: function() {                            
                            return modifiedArray;
                        }
                    }
                });

            }
            function getModifiedVariable(){
                var modifiedArray = [];                
                for (var i = 0; i < vm.lessVars.length; i++) {
                    if (vm.lessVars[i].currentValue != vm.lessVars[i].defaultValue) {
                        modifiedArray.push({
                            name : vm.lessVars[i].name,
                            value : vm.lessVars[i].currentValue
                        })
                    };
                }
                return modifiedArray;           
            }
            vm.showModifiedvariables = function() {
                var modifiedArray = getModifiedVariable();
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'myModalContent.html',
                    controller: 'ShowModifiedVariablesCtrl',
                    size: 'lg',
                    resolve: {
                        items: function() {
                            console.log("modified items:"+modifiedArray)
                            return modifiedArray;
                        }
                    }
                });
            }
            vm.lessVars = lessParser.loadValues(lessVars);
            vm.state = $state;
        }

    }

})();

(function() {
  'use strict';

  angular
      .module('themeMaker')
      .service('webDevTec', webDevTec);

  /** @ngInject */
  function webDevTec() {
    var data = [
      {
        'title': 'AngularJS',
        'url': 'https://angularjs.org/',
        'description': 'HTML enhanced for web apps!',
        'logo': 'angular.png'
      },
      {
        'title': 'BrowserSync',
        'url': 'http://browsersync.io/',
        'description': 'Time-saving synchronised browser testing.',
        'logo': 'browsersync.png'
      },
      {
        'title': 'GulpJS',
        'url': 'http://gulpjs.com/',
        'description': 'The streaming build system.',
        'logo': 'gulp.png'
      },
      {
        'title': 'Jasmine',
        'url': 'http://jasmine.github.io/',
        'description': 'Behavior-Driven JavaScript.',
        'logo': 'jasmine.png'
      },
      {
        'title': 'Karma',
        'url': 'http://karma-runner.github.io/',
        'description': 'Spectacular Test Runner for JavaScript.',
        'logo': 'karma.png'
      },
      {
        'title': 'Protractor',
        'url': 'https://github.com/angular/protractor',
        'description': 'End to end test framework for AngularJS applications built on top of WebDriverJS.',
        'logo': 'protractor.png'
      },
      {
        'title': 'Bootstrap',
        'url': 'http://getbootstrap.com/',
        'description': 'Bootstrap is the most popular HTML, CSS, and JS framework for developing responsive, mobile first projects on the web.',
        'logo': 'bootstrap.png'
      },
      {
        'title': 'Angular UI Bootstrap',
        'url': 'http://angular-ui.github.io/bootstrap/',
        'description': 'Bootstrap components written in pure AngularJS by the AngularUI Team.',
        'logo': 'ui-bootstrap.png'
      },
      {
        'title': 'Less',
        'url': 'http://lesscss.org/',
        'description': 'Less extends the CSS language, adding features that allow variables, mixins, functions and many other techniques.',
        'logo': 'less.png'
      }
    ];

    this.getTec = getTec;

    function getTec() {
      return data;
    }
  }

})();

(function() {
  'use strict';

  angular
    .module('themeMaker')
    .directive('navbar', navbar);

  /** @ngInject */
  function navbar() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/navbar/navbar.html',
      scope: {
          creationDate: '='
      },
      controller: NavbarController,
      controllerAs: 'vm',
      bindToController: true
    };

    NavbarController.$inject = ["moment"];
    return directive;

    /** @ngInject */
    function NavbarController(moment) {
      var vm = this;

      // "vm.creation" is avaible by directive option "bindToController: true"
      vm.relativeDate = moment(vm.creationDate).fromNow();
    }
  }

})();

(function() {
  'use strict';

  angular
    .module('themeMaker')
    .directive('acmeMalarkey', acmeMalarkey);

  /** @ngInject */
  function acmeMalarkey(malarkey) {
    var directive = {
      restrict: 'E',
      scope: {
        extraValues: '='
      },
      template: '&nbsp;',
      link: linkFunc,
      controller: MalarkeyController,
      controllerAs: 'vm'
    };

    MalarkeyController.$inject = ["$log", "githubContributor"];
    return directive;

    function linkFunc(scope, el, attr, vm) {
      var watcher;
      var typist = malarkey(el[0], {
        typeSpeed: 40,
        deleteSpeed: 40,
        pauseDelay: 800,
        loop: true,
        postfix: ' '
      });

      el.addClass('acme-malarkey');

      angular.forEach(scope.extraValues, function(value) {
        typist.type(value).pause().delete();
      });

      watcher = scope.$watch('vm.contributors', function() {
        angular.forEach(vm.contributors, function(contributor) {
          typist.type(contributor.login).pause().delete();
        });
      });

      scope.$on('$destroy', function () {
        watcher();
      });
    }

    /** @ngInject */
    function MalarkeyController($log, githubContributor) {
      var vm = this;

      vm.contributors = [];

      activate();

      function activate() {
        return getContributors().then(function() {
          $log.info('Activated Contributors View');
        });
      }

      function getContributors() {
        return githubContributor.getContributors(10).then(function(data) {
          vm.contributors = data;

          return vm.contributors;
        });
      }
    }

  }
  acmeMalarkey.$inject = ["malarkey"];

})();

(function() {


  angular
      .module('themeMaker')
      .service('lessParser', lessParser);

  /** @ngInject */
  function lessParser() {
    var getVariableValue = function(variable){
      if(less.variables[variable].value[0].value[0].type == "Variable")
          return less.variables[variable].value[0].value[0].name;
      else
          return less.variables[variable].value[0].value[0].value;
    }
    var getVariableType = function(variable){
      return less.variables[variable].value[0].value[0].type;
    }

    this.loadValues = function(list){
      var array = [];
      for(key in list){
        for(var i=0;i<list[key].length;i++){        
            var item = (list[key])[i]
            array.push({
                'name':item,
                'defaultValue' : getVariableValue(item),
                'currentValue' : getVariableValue(item),
                'type' : getVariableType(item),
                'group' : key
            })
        }         
      }
 
      return array;    
    }
  }

})();

(function() {
  'use strict';

  angular
    .module('themeMaker')
    .factory('githubContributor', githubContributor);

  /** @ngInject */
  function githubContributor($log, $http) {
    var apiHost = 'https://api.github.com/repos/Swiip/generator-gulp-angular';

    var service = {
      apiHost: apiHost,
      getContributors: getContributors
    };

    return service;

    function getContributors(limit) {
      if (!limit) {
        limit = 30;
      }

      return $http.get(apiHost + '/contributors?per_page=' + limit)
        .then(getContributorsComplete)
        .catch(getContributorsFailed);

      function getContributorsComplete(response) {
        return response.data;
      }

      function getContributorsFailed(error) {
        $log.error('XHR Failed for getContributors.\n' + angular.toJson(error.data, true));
      }
    }
  }
  githubContributor.$inject = ["$log", "$http"];
})();

(function() {
  'use strict';

  angular
    .module('themeMaker')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($timeout, webDevTec, toastr, lessParser) {
    var vm = this;

    vm.awesomeThings = [];
    vm.classAnimation = '';
    vm.creationDate = 1447918464680;
    vm.showToastr = showToastr;

    activate();

    function activate() {
      //lessParser.parseLess();
      getWebDevTec();
      $timeout(function() {
        vm.classAnimation = 'rubberBand';
      }, 4000);
    }

    function showToastr() {
      toastr.info('Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>');
      vm.classAnimation = '';
    }

    function getWebDevTec() {
      vm.awesomeThings = webDevTec.getTec();

      angular.forEach(vm.awesomeThings, function(awesomeThing) {
        awesomeThing.rank = Math.random();
      });
    }
  }
  MainController.$inject = ["$timeout", "webDevTec", "toastr", "lessParser"];
})();

(function() {
  'use strict';

  angular
    .module('themeMaker')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }
  runBlock.$inject = ["$log"];

})();

(function() {
  'use strict';

  angular
    .module('themeMaker')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('header', {
        url: '/header',
        templateUrl: 'app/header/header.html'
      })    
      .state('globalCart', {
        url: '/globalCart',
        templateUrl: 'app/globalCart/globalCart.html'
      })
      .state('buttons', {
        url: '/buttons',
        templateUrl: 'app/buttons/buttons.html'
      })      
      .state('liteRegistration', {
        url: '/liteRegistration',
        templateUrl: 'app/liteRegistration/liteRegistration.html'
      })
    $urlRouterProvider.otherwise('/header');
  }
  routerConfig.$inject = ["$stateProvider", "$urlRouterProvider"];

})();

/* global malarkey:false, moment:false */
(function() {
  'use strict';

  angular
    .module('themeMaker')
    .constant('malarkey', malarkey)
    .constant('moment', moment);

})();

(function() {
  'use strict';

  angular
    .module('themeMaker')
    .config(config);

  /** @ngInject */
  function config($logProvider, toastrConfig) {
    // Enable log
    $logProvider.debugEnabled(true);

    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-top-right';
    toastrConfig.preventDuplicates = true;
    toastrConfig.progressBar = true;
  }
  config.$inject = ["$logProvider", "toastrConfig"];

})();

angular.module("themeMaker").run(["$templateCache", function($templateCache) {$templateCache.put("app/buttons/buttons.html","<button class=\"ml-primary-button\">Primary Button</button><br><button class=\"ml-secondary-button\">Secondary Button</button>");
$templateCache.put("app/globalCart/globalCart.html","<div class=\"popDownWrapper globalCartWrapper ml-globalcart-container\"><div class=\"col-xs-6\"><div class=\"popDownLayer globalCartLayer popover bottom\" style=\"width: 273px; z-index: 1;display: block;\"><div class=\"arrow\"></div><div class=\"popover-content\"><div class=\"globalCartEmpty\">Your shopping basket is empty.</div><div class=\"globalCartLastItemAddedFillSlot ml-slot-item\"></div></div></div></div><div class=\"col-xs-6\"><div class=\"popDownLayer globalCartLayer popover bottom\" style=\"width: 273px; z-index: 1;display: block;\"><div class=\"arrow\"></div><div class=\"popover-content\"><div class=\"globalCartItemHeaderBlock text-lowercase\"><div class=\"globalCartItemHeaderItem\">Item</div><div class=\"globalCartItemHeaderPrice\">Price</div></div><div class=\"globalCartItemInfo globalCartItemInfo1Bg\"><div class=\"nameQtyAndImage\"><div class=\"itemImage\"><a href=\"/product/%5Ben_us%5Dchlorine+%26+heavy+metal+neutralizer+16oz.%5Ben_us%5D.do?sortby=ourPicks;\"><img src=\"/images//products/en_us/thumb/noimage.gif\" width=\"80\" height=\"80\"></a></div><div class=\"itemNameAndQty\"><div class=\"name\"><a href=\"/product/%5Ben_us%5Dchlorine+%26+heavy+metal+neutralizer+16oz.%5Ben_us%5D.do?sortby=ourPicks;\">[en_US]Chlorine &amp; Heavy Metal Neutralizer 16oz. …</a></div><div class=\"qty\">Qty: 1</div></div></div><div class=\"price\">$9.99</div></div><div class=\"globalCartTotal\"><div class=\"summary\"><div class=\"title-subtotal\" style=\"width: 145px;\">Subtotal:</div><div class=\"value\">$9.99</div></div></div><div class=\"viewBasketAndCheckout\"><div class=\"globalCartViewBasketBtn\"><a href=\"/basket.do\"><div class=\"ml-globalcart-button\">View Bag</div></a></div><form id=\"globalCartCheckoutForm\" action=\"/basket.do?method=checkout\" method=\"post\"><input type=\"hidden\" name=\"itemPk\" value=\"106401\"> <input type=\"hidden\" name=\"qty\" id=\"qty_106401\" value=\"1\"> <input type=\"hidden\" name=\"option\" id=\"optionTypeValues_106401\" value=\"none\"><div class=\"globalCartCheckoutBtn\"><button type=\"button\" name=\"Checkout\" class=\"ml-primary-button\" onclick=\"MarketLive.P2P.Basket.basketCheckout(\'globalCartCheckoutForm\');\">Checkout</button></div></form></div><div class=\"globalcart-carousel-wrapper\"></div></div></div></div></div>");
$templateCache.put("app/header/header.html","<header role=\"banner\"><nav role=\"navigation\"><span class=\"ml-icon-lib ml-icon-home ml-icon-pre-load-fix\"></span><div id=\"globalHeaderInclude\" class=\"ml-global-include\"><div class=\"container\" style=\"width:100%\"><div class=\"ml-header-global-include-wrapper\"><div class=\"ml-header-global-include\"><div class=\"ml-header-global-include-close\"><button type=\"button\" class=\"ml-icon-lib ml-icon-close\" data-toggle=\"collapse\" data-target=\".ml-global-include\" onclick=\"globalIncludeClose();\"></button></div>Buy One Get One 1/2 off. Today Only.</div></div></div></div><div class=\"ml-header-wrapper\"><div class=\"container\" style=\"width:100%\"><div class=\"ml-header\"><div class=\"ml-header-content-wrapper\"><div class=\"ml-header-content\"><div class=\"ml-header-logo-wrapper\"><div class=\"ml-header-logo\"><a href=\"/home.do\"><span class=\"ml-dynamic-data\" data-type=\"image\" data-alt=\"Company Name\" data-mq-default=\"/images/set_x/en_us/global/globalnav/logo01.png\" data-mq-xs=\"/images/set_x/en_us/global/globalnav/logo_xs.png\" data-mq-md=\"/images/set_x/en_us/global/globalnav/logo01.png\"><noscript>&lt;img src=\"/images/set_x/en_us/global/globalnav/logo01.png\" alt=\"Company Name\"&gt;</noscript><img class=\"ml-dynamic-data-img\" alt=\"Company Name\" src=\"/images/set_x/en_us/global/globalnav/logo01.png\"></span></a></div></div><div class=\"ml-header-links-wrapper\"><div class=\"ml-header-links\"><div class=\"ml-header-link ml-header-shop\"><div class=\"ml-header-link-item\" data-toggle=\"collapse\" data-target=\"#ml-navbar-collapse\"><span>Products</span> <span class=\"ml-icon-lib ml-icon-down\"></span></div></div><div class=\"ml-header-link ml-header-account\"><div class=\"ml-header-link-item\"><div id=\"fb-root\" class=\"fb_reset\"><div style=\"position: absolute; top: -10000px; height: 0px; width: 0px;\"><div></div></div><div style=\"position: absolute; top: -10000px; height: 0px; width: 0px;\"><div><iframe name=\"fb_xdm_frame_http\" frameborder=\"0\" allowtransparency=\"true\" allowfullscreen=\"true\" scrolling=\"no\" title=\"Facebook Cross Domain Communication Frame\" aria-hidden=\"true\" tabindex=\"-1\" id=\"fb_xdm_frame_http\" src=\"http://static.ak.facebook.com/connect/xd_arbiter/TlA_zCeMkxl.js?version=41#channel=f1acb0278&amp;origin=http%3A%2F%2Flocalhost%3A21080\" style=\"border: none;\"></iframe><iframe name=\"fb_xdm_frame_https\" frameborder=\"0\" allowtransparency=\"true\" allowfullscreen=\"true\" scrolling=\"no\" title=\"Facebook Cross Domain Communication Frame\" aria-hidden=\"true\" tabindex=\"-1\" id=\"fb_xdm_frame_https\" src=\"https://s-static.ak.facebook.com/connect/xd_arbiter/TlA_zCeMkxl.js?version=41#channel=f1acb0278&amp;origin=http%3A%2F%2Flocalhost%3A21080\" style=\"border: none;\"></iframe></div></div></div><span class=\"ml-topnav-identity\"><span class=\"ml-topnav-identity-guest\"><span class=\"ml-topnav-identity-link\" data-from=\"IdentityGuest\" data-url=\"/checkout/literegistration.do?liteRegistrationType=identityLogin\">Login</span> <span class=\"ml-icon-lib ml-icon-user\"></span></span></span></div></div><div class=\"ml-header-link ml-header-stores\"><div class=\"ml-header-link-item\"><span><a href=\"/store-locator.do\">Stores</a></span> <span class=\"ml-icon-lib ml-icon-map-marker\"></span></div></div><div class=\"ml-header-link ml-header-phone\"><div class=\"ml-header-link-item\"><span>800.780.1600</span> <span class=\"ml-icon-lib ml-icon-phone\"></span></div></div></div></div><div class=\"ml-header-global-cart-wrapper\"><div id=\"globalBasket\" class=\"popDownWrapper globalCartWrapper ml-globalcart-container\"><div class=\"popDownNav ml-header-global-cart\"><a href=\"/basket.do\"><div class=\"ml-icon ml-icon-global-cart\"><span class=\"ml-header-global-cart-count\">1</span></div><div class=\"ml-header-global-cart-text\"><span class=\"ml-header-global-cart-label\">CHECKOUT</span> <span class=\"ml-header-global-cart-price\">$9.99</span></div></a></div><div class=\"popDownLayer globalCartLayer popover bottom\" style=\"width: 273px;\"><div class=\"arrow\"></div><div class=\"popover-content\"><div class=\"globalCartItemHeaderBlock text-lowercase\"><div class=\"globalCartItemHeaderItem\">Item</div><div class=\"globalCartItemHeaderPrice\">Price</div></div><div class=\"globalCartItemInfo globalCartItemInfo1Bg\"><div class=\"nameQtyAndImage\"><div class=\"itemImage\"><a href=\"/product/%5Ben_us%5Dchlorine+%26+heavy+metal+neutralizer+16oz.%5Ben_us%5D.do?sortby=ourPicks;\"><img src=\"/images//products/en_us/thumb/noimage.gif\" width=\"80\" height=\"80\"></a></div><div class=\"itemNameAndQty\"><div class=\"name\"><a href=\"/product/%5Ben_us%5Dchlorine+%26+heavy+metal+neutralizer+16oz.%5Ben_us%5D.do?sortby=ourPicks;\">[en_US]Chlorine &amp; Heavy Metal Neutralizer 16oz. …</a></div><div class=\"qty\">Qty: 1</div></div></div><div class=\"price\">$9.99</div></div><div class=\"globalCartTotal\"><div class=\"summary\"><div class=\"title-subtotal\" style=\"width: 145px;\">Subtotal:</div><div class=\"value\">$9.99</div></div></div><div class=\"viewBasketAndCheckout\"><div class=\"globalCartViewBasketBtn\"><a href=\"/basket.do\"><div class=\"ml-globalcart-button\">View Bag</div></a></div><form id=\"globalCartCheckoutForm\" action=\"/basket.do?method=checkout\" method=\"post\"><input type=\"hidden\" name=\"itemPk\" value=\"106401\"> <input type=\"hidden\" name=\"qty\" id=\"qty_106401\" value=\"1\"> <input type=\"hidden\" name=\"option\" id=\"optionTypeValues_106401\" value=\"none\"><div class=\"globalCartCheckoutBtn\"><button type=\"button\" name=\"Checkout\" class=\"ml-primary-button\" onclick=\"MarketLive.P2P.Basket.basketCheckout(\'globalCartCheckoutForm\');\">Checkout</button></div></form></div><div class=\"globalcart-carousel-wrapper\"></div><div class=\"globalCartLastItemAddedFillSlot ml-slot-item\"></div></div></div></div></div></div></div></div></div></div></nav></header>");
$templateCache.put("app/liteRegistration/liteRegistration.html","<div class=\"col-xs-6\"><div class=\"ml-lite-registration-dialog\"><div class=\"ml-lite-registration\"><div class=\"ml-lite-registration-underlay\"></div><div class=\"ml-lite-registration-wrapper\"><div class=\"toggle-options\"><div class=\"toggle-option active\"><div id=\"login\" class=\"toggle-button\">Login</div><div class=\"arrow-wrapper\"><div class=\"arrow\"></div></div></div><div class=\"toggle-option\"><div id=\"guest\" class=\"toggle-button\">New Shopper</div><div class=\"arrow-wrapper\"><div class=\"arrow\"></div></div></div></div><div class=\"section-wrapper\"><div id=\"loginSection\" class=\"sub-section-wrapper\" style=\"display: block;\"><div id=\"loginContainer\"><form id=\"accountSetupFormLogin\" action=\"/checkout/literegistration.do?method=submitLogin\" method=\"post\" onsubmit=\"return false\" class=\"ng-pristine ng-valid\" novalidate=\"novalidate\"><input id=\"socialLoginLinkAccountsRequired\" name=\"socialLoginLinkAccountsRequired\" type=\"hidden\" value=\"false\"> <input id=\"socialLoginFromPage\" name=\"socialLoginFromPage\" value=\"LITEREGISTRATION\" type=\"hidden\"> <input id=\"mergeAccount\" name=\"mergeAccount\" value=\"\" type=\"hidden\"><div id=\"accountsetupfailerror\"></div><div class=\"section-description\" data-ng-hide=\"model.show.mergeMessages\">Login with an email address and password.</div><label class=\"visuallyhidden-with-placeholder\" for=\"loginEmail\">Email Address</label><div class=\"input-group\"><span class=\"input-group-addon\"><i class=\"ml-icon-lib ml-icon-envelope ml-icon-fw\"></i></span> <input ng-readonly=\"model.show.mergeMessages\" type=\"email\" name=\"loginEmail\" maxlength=\"100\" value=\"\" class=\"form-control\" id=\"loginEmail\" placeholder=\"Email Address\"></div><label class=\"visuallyhidden-with-placeholder\" for=\"loginPassword2\">Password</label><div class=\"input-group\"><span class=\"input-group-addon\"><i class=\"ml-icon-lib ml-icon-lock ml-icon-fw\"></i></span> <input type=\"password\" name=\"loginPassword2\" maxlength=\"50\" value=\"\" class=\"form-control\" id=\"loginPassword2\" placeholder=\"Password\"></div><div><div class=\"ml-forgot-password\"><a href=\"#\" onclick=\"MarketLive.LiteRegistration.forgotPassword();\">Forgot Password?</a></div><div class=\"ml-button-set\"><div><input name=\"Cancel\" class=\"ml-cancel-btn\" type=\"button\" value=\"Cancel\" data-dismiss=\"modal\"></div><div><input id=\"btnContinueAccountSetupFormLogin\" name=\"ContinueAccountSetupForm\" class=\"ml-login-btn\" type=\"submit\" value=\"Login\"></div></div></div></form></div><div id=\"socialLoginTerm\" class=\"ml-sociallogin-term\" style=\"display:none\"><div id=\"returningAccountTermHeader\" class=\"termHeader\">Your personal MarketLive data will not be shared with</div><ul><li id=\"returningAccountTerm1\" class=\"termItem\">MarketLive <b><i>will not</i></b> share your account information with</li><li id=\"returningAccountTerm2\" class=\"termItem\">MarketLive <b><i>will not</i></b> share your purchase history with</li><li id=\"returningAccountTerm3\" class=\"termItem\">MarketLive <b><i>will not</i></b> attempt to contact your personal contacts on</li></ul></div></div><div><div class=\"ml-secure\"><div class=\"secure-message-wrapper\"><span class=\"ml-icon-lib ml-icon-lock\"></span> <span>Your connection to this website is secure.</span></div></div></div></div></div></div></div></div><div class=\"col-xs-6\"><div class=\"ml-lite-registration-dialog\"><div class=\"ml-lite-registration\"><div class=\"ml-lite-registration-underlay\"></div><div class=\"ml-lite-registration-wrapper\"><div class=\"toggle-options\"><div class=\"toggle-option\"><div id=\"login\" class=\"toggle-button\">Login</div><div class=\"arrow-wrapper\"><div class=\"arrow\"></div></div></div><div class=\"toggle-option active\"><div id=\"guest\" class=\"toggle-button\">New Shopper</div><div class=\"arrow-wrapper\"><div class=\"arrow\"></div></div></div></div><div class=\"section-wrapper\"><div id=\"guestSection\" class=\"sub-section-wrapper\" style=\"display: block;\"><form id=\"accountSetupForm\" action=\"/checkout/literegistration.do?method=submitRegister\" method=\"post\" onsubmit=\"return false\" class=\"ng-pristine ng-valid\" novalidate=\"novalidate\"><input id=\"socialLoginLinkAccountsRequired\" name=\"socialLoginLinkAccountsRequired\" type=\"hidden\" value=\"false\"><div id=\"accountsetupfailerror\"></div><div class=\"section-description\">Register with an email address and password.</div><label class=\"visuallyhidden-with-placeholder\" for=\"newCustomerEmail\">Email Address</label><div class=\"input-group\"><span class=\"input-group-addon\"><i class=\"ml-icon-lib ml-icon-envelope ml-icon-fw\"></i></span> <input type=\"email\" name=\"newCustomerEmail\" maxlength=\"100\" value=\"\" class=\"form-control\" id=\"newCustomerEmail\" placeholder=\"Email Address\"></div><label class=\"visuallyhidden-with-placeholder\" for=\"loginPassword\">Password</label><div class=\"input-group\"><span class=\"input-group-addon\"><i class=\"ml-icon-lib ml-icon-lock ml-icon-fw\"></i></span> <input type=\"password\" name=\"loginPassword\" maxlength=\"50\" value=\"\" class=\"form-control\" id=\"loginPassword\" placeholder=\"Password\"></div><label class=\"visuallyhidden-with-placeholder\" for=\"loginPasswordConfirm\">Re-enter Password</label><div class=\"input-group\"><span class=\"input-group-addon\"><i class=\"ml-icon-lib ml-icon-lock ml-icon-fw\"></i></span> <input type=\"password\" name=\"loginPasswordConfirm\" maxlength=\"50\" value=\"\" class=\"form-control\" id=\"loginPasswordConfirm\" placeholder=\"Re-enter Password\"></div><div class=\"input-group\"><span class=\"input-group-addon\"><i class=\"ml-icon-lib ml-icon-question ml-icon-fw\"></i></span><select id=\"liteRegistrationHint\" name=\"liteRegistrationHint\" class=\"form-select\"><option value=\"\">Select a recovery question</option><option value=\"1\">What is your city of birth?</option><option value=\"2\">What is your mother\'s maiden name?</option><option value=\"3\">What is your father\'s first name?</option><option value=\"4\">What is your pet\'s name?</option><option value=\"5\">What is the year you were born?</option></select></div><label class=\"visuallyhidden-with-placeholder\" for=\"liteRegistrationAnswer\">Enter Answer</label><div class=\"input-group\"><span class=\"input-group-addon\"><i class=\"ml-icon-lib ml-icon-comment ml-icon-fw\"></i></span> <input type=\"text\" name=\"liteRegistrationAnswer\" maxlength=\"100\" value=\"\" class=\"form-control\" id=\"liteRegistrationAnswer\" placeholder=\"Enter Answer\"></div><div class=\"ml-lite-registration-signup\"><input type=\"checkbox\" name=\"emailSignup\" id=\"emailSignup\"> <label for=\"emailSignup\">Sign me up for Company Name Email Updates about new services and special offers!</label></div><div class=\"ml-button-set\"><div><input name=\"Cancel\" class=\"ml-cancel-btn\" type=\"button\" value=\"Cancel\" data-dismiss=\"modal\"></div><div><input id=\"btnContinueAccountSetupForm\" name=\"ContinueAccountSetupForm\" class=\"ml-register-btn\" type=\"submit\" value=\"Register\"></div></div></form></div><div><div class=\"ml-secure\"><div class=\"secure-message-wrapper\"><span class=\"ml-icon-lib ml-icon-lock\"></span> <span>Your connection to this website is secure.</span></div></div></div></div></div></div></div></div>");
$templateCache.put("app/main/main.html","<div class=\"jumbotron text-center\"><h1>12</h1><p class=\"lead\"><img src=\"assets/images/yeoman.png\" alt=\"I\'m Yeoman\"><br>Always a pleasure scaffolding your apps.</p><p class=\"animated infinite\" ng-class=\"main.classAnimation\"><button type=\"button\" class=\"btn btn-lg btn-success\" ng-click=\"main.showToastr()\">Splendid Toastr</button></p><p>With ♥ thanks to the contributions of<acme-malarkey extra-values=\"[\'Yeoman\', \'Gulp\', \'Angular\']\"></acme-malarkey></p></div><div class=\"row\"><div class=\"col-sm-6 col-md-4\" ng-repeat=\"awesomeThing in main.awesomeThings | orderBy:\'rank\'\"><div class=\"thumbnail\"><img class=\"pull-right\" ng-src=\"assets/images/{{ awesomeThing.logo }}\" alt=\"{{ awesomeThing.title }}\"><div class=\"caption\"><h3>{{ awesomeThing.title }}</h3><p>{{ awesomeThing.description }}</p><p><a ng-href=\"{{awesomeThing.url}}\">{{ awesomeThing.url }}</a></p></div></div></div></div>");
$templateCache.put("app/components/navbar/navbar.html","<nav class=\"navbar navbar-static-top navbar-inverse my-navbar\"><div class=\"container-fluid\"><div class=\"navbar-header\"><a class=\"navbar-brand\"><span class=\"glyphicon glyphicon-home\"></span> Theme Customizer</a></div><div class=\"collapse navbar-collapse\" id=\"bs-example-navbar-collapse-6\"><ul class=\"nav navbar-nav\"><li ui-sref-active=\"active\"><a ui-sref=\"header\">Header</a></li><li ui-sref-active=\"active\"><a ui-sref=\"globalCart\">GlobalCart</a></li><li ui-sref-active=\"active\"><a ui-sref=\"liteRegistration\">Login</a></li><li ui-sref-active=\"active\"><a ui-sref=\"buttons\">Button</a></li></ul></div></div></nav>");
$templateCache.put("app/components/directives/lessVariablesListing/lessVariableListing.html","<div class=\"col-xs-6\"><button class=\"btn btn-primary btn-block\" ng-click=\"vm.loadTheme()\">Load</button></div><div class=\"col-xs-6\"><button class=\"btn btn-success btn-block\" ng-click=\"vm.saveTheme()\">Save</button></div><div class=\"col-xs-12\"><h5 class=\"my-app-label\">Total Less vars : <span ng-bind=\"(vm.lessVars | filter: {group:vm.state.current.name}).length\" class=\"badge\"></span></h5></div><div class=\"col-xs-12 list\" style=\"height: 500px;overflow-y: auto;\"><div ng-repeat=\"lessVar in vm.lessVars | filter: {group:vm.state.current.name}\" class=\"form-group\"><div style=\"position:relative\"><label for=\"{{lessVar.name}}\" class=\"my-app-label\">{{lessVar.name}}</label> <input type=\"text\" class=\"form-control\" ng-if=\"lessVar.type==\'Color\'\" colorpicker=\"\" ng-model=\"lessVar.currentValue\" colorpicker-parent=\"true\" ng-blur=\"vm.modifyVar(lessVar)\"> <input type=\"text\" class=\"form-control\" ng-if=\"lessVar.type==\'Dimension\' || lessVar.type==\'Variable\'\" ng-model=\"lessVar.currentValue\" ng-blur=\"vm.modifyVar(lessVar)\"></div></div></div><div class=\"col-xs-12 footer\"><div class=\"\"><button class=\"btn btn-primary btn-lg btn-block\" ng-click=\"vm.showModifiedvariables()\">Show Modified Variables</button></div></div><script type=\"text/ng-template\" id=\"myModalContent.html\"><div class=\"modal-header\" style=\"border-bottom: 1px solid #e5e5e5;\"> <h3 class=\"modal-title\" style=\"float:none\">Modified Variables</h3> </div> <div class=\"modal-body\" style=\"padding:15px;\"> <h5 ng-show=\"items.length==0\" > Yikes!! You have not tried me yet, Please do some modifications </h5> <code ng-if=\"items.length>0\" class=\"variable-listing\"> <div ng-repeat=\"item in items\"> <span>{{item.name}}</span> : {{item.value}} </div> </code> </div> <div class=\"modal-footer\"> <button class=\"btn btn-default\" type=\"button\" ng-click=\"ok()\">Cancel</button> <button class=\"btn btn-primary\" ng-disabled=\"items.length==0\" type=\"button\" ngclipboard data-clipboard-target=\".variable-listing\" ngclipboard-success=\"onCopiedSuccess()\">Copy Variables</button> </div></script><script type=\"text/ng-template\" id=\"saveTheme.html\"><div class=\"modal-header\" style=\"border-bottom: 1px solid #e5e5e5;\"> <h3 class=\"modal-title\" style=\"float:none\">Save Theme</h3> </div> <form name=\"myForm\"> <div class=\"modal-body\" style=\"padding:15px;\"> <div class=\"form-group\"> <label for=\"ThemeName\" class=\"my-app-label\">Theme Name</label> <input type=\"text\" class=\"form-control\" name=\"name\" ng-minlength=\"5\" ng-maxlength=\"20\" ng-model=\"themeName\" required /> <div class=\"text-danger\" ng-messages=\"myForm.name.$error\" > <div ng-message=\"required\">Please enter theme name</div> <div ng-message=\"minlength\">Name is too short</div> <div ng-message=\"maxlength\">Name field is too long</div> </div> <div class=\"text-danger\" ng-hide=\"canSaveTheme\"> Yikes!! You have not tried me yet, Please do some modifications </div> </div> </div> <div class=\"modal-footer\"> <button class=\"btn btn-default\" type=\"button\" ng-click=\"cancel()\">Cancel</button> <button class=\"btn btn-success\" type=\"button\" ng-click=\"ok()\" ng-disabled=\"!(canSaveTheme && myForm.name.$valid)\">Save</button> </div> </form></script><script type=\"text/ng-template\" id=\"loadTheme.html\"><div class=\"modal-header\" style=\"border-bottom: 1px solid #e5e5e5;\"> <h3 class=\"modal-title\" style=\"float:none\">Load Theme</h3> </div> <div class=\"modal-body\" style=\"padding:15px;\"> <div ng-show=\"allSavedThemes.length==0\">No Themes Found</div> <div ng-show=\"allSavedThemes.length>0\"> <h5>Choose from one of the Saved Theme below</h5> <div class=\"col-xs-12\" ng-repeat=\"theme in allSavedThemes\" > <div class=\"col-xs-11 \"> <button class=\"btn btn-primary btn-block\" style=\"margin-bottom: 5px;\" ng-click=\"loadTheme(theme)\">{{theme.name}} </button> </div> <div class=\"col-xs-1\" > <a ng-click=\"delete(theme)\" class=\"text-danger\"><span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"></span></a> </div> </div> <div class=\"clearfix\"></div> </div> </div> <div class=\"modal-footer\"> <button class=\"btn btn-default\" type=\"button\" ng-click=\"ok()\">OK</button> </div></script>");}]);
//# sourceMappingURL=../maps/scripts/app-8cbc5a0615.js.map
