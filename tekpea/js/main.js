// Define the `phonecatApp` module
var lightApp = angular.module('lightApp', []);

// Define the `PhoneListController` controller on the `phonecatApp` module
lightApp.controller('MainController', function MainController($scope) {
    $scope.activeTab = 'light';
    $scope.modified = false;
    $scope.$watch('preset', function(newV, oldV) {
        if ($scope.selectedGroup.name) {
            for (var i = 0; i < $scope.selectedGroup.devices.length; i++) {
                $scope.devices[$scope.selectedGroup.devices[i]].intensityNew = ($scope.devices[$scope.selectedGroup.devices[i]].intensity * newV) % 100;
            }
            $scope.modified = true;
        }
    })
    $scope.apply = function() {
        for (d in $scope.devices) {
            if ($scope.devices[d].intensityNew) {
                $scope.devices[d].intensity = $scope.devices[d].intensityNew;
                $scope.devices[d].intensityNew = null;
            }
        }
        $scope.modified = false;
    }
    $scope.$watch('range', function(newV, oldV) {
        if ($scope.selectedDevice.name) {
            $scope.selectedDevice.intensityNew = newV;
            $scope.modified = true;
        } else if ($scope.selectedGroup.name) {
            for (var i = 0; i < $scope.selectedGroup.devices.length; i++) {
                $scope.devices[$scope.selectedGroup.devices[i]].intensityNew = newV;
            }
            $scope.modified = true;
        }
    })
    $scope.devices = {}
    $scope.devices[1] = {
        id: 1,
        name: 'Device #1',
        intensity: 10
    }
    $scope.devices[2] = {
        id: 2,
        name: 'Device #2',
        intensity: 20
    }
    $scope.devices[3] = {
        id: 3,
        name: 'Device #3',
        intensity: 30
    }

    $scope.groups = [{
        name: 'Group #1',
        devices: [1, 2],
        active: {
            preset: null,
            intensity: 30
        }
    }, {
        name: 'Group #2',
        devices: [2, 3],
        active: {
            preset: 3,
            intensity: null
        }
    }, {
        name: 'Group #3',
        devices: [1, 3],
        active: {
            preset: null,
            intensity: 40
        }
    }]
    $scope.selectedGroup = {};
    $scope.selectedDevice = {};
    $scope.selectDevice = function(d) {
        console.log(d)
        $scope.selectedGroup = {};
        if ($scope.selectedDevice.name == d.name)
            $scope.selectedDevice = {};
        else
            $scope.selectedDevice = d
    }

    $scope.selectGroup = function(gp) {
        console.log(gp)
        $scope.selectedDevice = {};
        if ($scope.selectedGroup.name == gp.name)
            $scope.selectedGroup = {};
        else
            $scope.selectedGroup = gp

    }
    $scope.phones = [{
        name: 'Nexus S',
        snippet: 'Fast just got faster with Nexus S.'
    }, {
        name: 'Motorola XOOM™ with Wi-Fi',
        snippet: 'The Next, Next Generation tablet.'
    }, {
        name: 'MOTOROLA XOOM™',
        snippet: 'The Next, Next Generation tablet.'
    }];
});
/*

function openCity(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tabcontent.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}
*/
