var mainCtrl = angular.module('mainCtrl', []);
mainCtrl.controller('iglobalCtrl', function($scope, $http, $timeout) {
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

});
