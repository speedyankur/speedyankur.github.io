var mainCtrl = angular.module('mainCtrl', []);
mainCtrl.controller('iglobalCtrl', function($scope, $http, $timeout,$filter) {
    $scope.states = [];    
    $http.get('json-files/states.json').success(function(data) {
        var states = [];
        states = data;
        $http.get('json-files/locations.json').success(function(data) {
            var locations = data;
            var tempStates = [];
            var stateIndex = 0;
            for (var keyStates in states) {
                states[keyStates].locations = [];
                tempStates.push(states[keyStates]);
                for (var keyLocations in locations) {
                    if (states[keyStates].id == (locations[keyLocations].state_id)) {
                        (tempStates[stateIndex]).locations.push(locations[keyLocations]);
                    }
                }
                stateIndex++;
            }
            $scope.states = tempStates;
            $timeout(function(){
              $('#sticky-list').stickySectionHeaders({
                stickyClass     : 'sticky',
                headlineSelector: 'strong'
              });
            },1000)
        });
    });
    $scope.selectAllLocations = function(state){
        for(var i = 0;i<state.locations.length;i++){
          state.locations[i].isChecked=state.isChecked;
        }
    }
    $scope.datasetData = [];
    $http.get('json-files/dataset.json').success(function(data) {
        var nodes = [];
        for (var key in data) {
            nodes.push(data[key]);   
        }
        var unflatten = function( array, parent, tree ){
           
            tree = typeof tree !== 'undefined' ? tree : [];
            parent = typeof parent !== 'undefined' ? parent : { id: 0 };
                
            var children = _.filter( array, function(child){ 
                return parseInt(child.superset_id) == parent.id; 
            });
            
            if( !_.isEmpty( children )  ){
                if( parent.id == "0" ){
                   tree = children;   
                }else{
                   parent['children'] = children
                }
                _.each( children, function( child ){ unflatten( array, child ) } );                    
            }
            
            return tree;
        }

        $scope.datasetData = unflatten( nodes );   
    });


$scope.selectDataset = function(dataset){
        for(var i = 0;i<dataset.children.length;i++){
          dataset.children[i].isChecked=dataset.isChecked;
        }

    }
$timeout(function(){
         $('input[type="checkbox"]').change(function(e) {
      var checked = $(this).prop("checked"),
          container = $(this).parent(),
          siblings = container.siblings();
  
      container.find('input[type="checkbox"]').prop({
          indeterminate: false,
          checked: checked
      });
  
      function checkSiblings(el) {
          var parent = el.parent().parent(),
              all = true;
  
          el.siblings().each(function() {
              return all = ($(this).children('input[type="checkbox"]').prop("checked") === checked);
          });
  
          if (all && checked) {
              parent.children('input[type="checkbox"]').prop({
                  indeterminate: false,
                  checked: checked
              });
              checkSiblings(parent);
          } else if (all && !checked) {
              parent.children('input[type="checkbox"]').prop("checked", checked);
              parent.children('input[type="checkbox"]').prop("indeterminate", (parent.find('input[type="checkbox"]:checked').length > 0));
              checkSiblings(parent);
          } else {
              el.parents("li").children('input[type="checkbox"]').prop({
                  indeterminate: true,
                  checked: false
              });
          }
        }
    
        checkSiblings(container);
      });
    }, 2000);
});
