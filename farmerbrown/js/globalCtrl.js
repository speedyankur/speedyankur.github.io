var mainCtrl = angular.module('mainCtrl', []);
mainCtrl.controller('iglobalCtrl', function($scope, $http) {
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
        });
    });
    $scope.selectAllLocations = function(state){
        for(var i = 0;i<state.locations.length;i++){
          state.locations[i].isChecked=state.isChecked;
        }
    }
    $scope.datasetData = [];
    $http.get('json-files/dataset.json').success(function(data) {
        var tempDataSets = []
        for (var keyDataset in data) {
          tempDataSets.push(data[keyDataset])

        }
        $scope.datasetData = tempDataSets;
    });

});
