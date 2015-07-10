function SettingsController($scope, $rootScope, frameViewStateBroadcast, gateReaderServices, $timeout) {

    // This two are on rootScope because the third frame needs to access this too.

    // Refresh the user profile object in memory before doing anything else.
    gateReaderServices.getUserProfile(
        function(userProfile) {
            console.log('getUserProfile from settings is called.')
            $rootScope.userProfile = userProfile
        })


    $rootScope.settingsSubmenuTemplates = [
    {
        Name: 'General',
        Url: 'partials/settings/basics.html'
    }, {
        Name: 'Advanced',
        Url: 'partials/settings/advanced.html'
    }, {
        Name: 'Tutorial',
        Url: 'partials/settings/tutorial.html'
    }, {
        Name: 'Markdown',
        Url: 'partials/settings/markdown.html'
    }, {
        Name: 'About',
        Url: 'partials/settings/about.html'
    }, {
        Name: 'Licenses',
        Url: 'partials/settings/licenses.html'
    }
    ]
    // This two are on rootScope because the third frame needs to access this too.
    $rootScope.settingsSelectedTemplate = $scope.settingsSubmenuTemplates[0]

    $scope.ClickSettingsSubmenu = function(targetMenuName) {
        for (var i=0; i<$scope.settingsSubmenuTemplates.length;i++) {
            if ($scope.settingsSubmenuTemplates[i].Name === targetMenuName) {
                $rootScope.settingsSelectedTemplate = $scope.settingsSubmenuTemplates[i]
            }
        }
    }

    for (var i=0;i<$rootScope.userProfile.userDetails.userLanguages.length;i++) {
        var language = $rootScope.userProfile.userDetails.userLanguages[i]
        $scope[language+'Selected'] = true
    }
    $scope.$watch('settingsSelectedTemplate', function() {
         if ($rootScope.settingsSelectedTemplate.Name === 'Markdown') {
             $timeout(function(){
                var markdownSource = document.getElementById('raw-container')
                $scope.mdResult = $rootScope.mdConverter.makeHtml(markdownSource.innerText)
             }, 10)
         }
    })

    //test inject
    //scope = $rootScope

    // Start at boot radio options.

    if ($rootScope.userProfile.machineDetails.startAtBoot) {
        $scope.startAtBootRadioState = [
        {'checked':true, 'value':1, 'name':'YES'},
        {'checked':false, 'value':0, 'name':'NO'} ]
        // Setting the current state retrieved from JSON.
    }
    else {
        $scope.startAtBootRadioState = [
        {'checked':false, 'value':1, 'name':'YES'},
        {'checked':true, 'value':0, 'name':'NO'} ]
    }

    $scope.setStartAndBootStatus = function(value) {
        $rootScope.userProfile.machineDetails.startAtBoot = !!value
    }

    // Check for updates radio options.

    if ($rootScope.userProfile.machineDetails.checkForUpdates) {
        $scope.checkForUpdatesRadioState = [
        {'checked':true, 'value':1, 'name':'YES'},
        {'checked':false, 'value':0, 'name':'NO'} ]
        // Setting the current state retrieved from JSON.
    }
    else {
        $scope.checkForUpdatesRadioState = [
        {'checked':false, 'value':1, 'name':'YES'},
        {'checked':true, 'value':0, 'name':'NO'} ]
    }

    $scope.setcheckForUpdatesRadioStatus = function(value) {
        $rootScope.userProfile.machineDetails.checkForUpdates = !!value
    }

    // Theme radio options.
    if ($rootScope.userProfile.userDetails.theme) { // 0 (False): Light, 1 (True): Dark
        $scope.themeRadioState = [
        {'checked':false, 'value':0, 'name':'Light'},
        {'checked':true, 'value':1, 'name':'Dark'} ]
        // Setting the current state retrieved from JSON.
    }
    else {
        $scope.themeRadioState = [
        {'checked':true, 'value':0, 'name':'Light'},
        {'checked':false, 'value':1, 'name':'Dark'} ]
    }

    $scope.setThemeRadioStatus = function(value) {
        $rootScope.setTheme(value)


        $rootScope.userProfile.userDetails.theme = !!value
    }




    // Logs radio button.

//    if ($rootScope.userProfile.userDetails.Logging) {
//        $scope.loggingRadioState = [
//        {'checked':'checked', 'value':1, 'name':'YES'},
//        {'checked':'', 'value':0, 'name':'NO'} ]
//        // Setting the current state retrieved from JSON.
//    }
//    else {
//        $scope.loggingRadioState = [
//        {'checked':'', 'value':1, 'name':'YES'},
//        {'checked':'checked', 'value':0, 'name':'NO'} ]
//    }
//
//    $scope.setLoggingStatus = function(value) {
//        $rootScope.userProfile.userDetails.Logging = !!value
//    }


    $scope.langClick = function(language) {
        $scope[language+'Selected']
        console.log($scope[language+'Selected'])
        if ($scope[language+'Selected']) {
            if ($rootScope.userProfile.userDetails.userLanguages.length > 1) {
                $scope[language+'Selected'] = false
                var index = $rootScope.userProfile.userDetails.userLanguages.indexOf(language)
                if (index > -1) {
                    $rootScope.userProfile.userDetails.userLanguages.splice(index, 1);
                }
            }
        }
        else
        {
            $scope[language+'Selected'] = true
            $rootScope.userProfile.userDetails.userLanguages.push(language)
        }
    }
    $scope.okButtonDisabled = false

    $scope.connectToNode = function() {
        var ipPortElement = angular.element(document.getElementsByClassName('text-entry-ip-port'))[0]
        
        var ipText = ipPortElement.value.split(':')[0]
        var portText = ipPortElement.value.split(':')[1]

        console.log('connecttonode is called')
        if (ipText && portText) {
            gateReaderServices.connectToNodeWithIP(ipText, portText)
            $scope.okButtonDisabled = true
            ipPortElement.value = ''
            ipPortElement.value = ''

        }
    }

    // Advanced menu

    $scope.resetAdvanced = function() {
        $rootScope.userProfile.machineDetails.maxOutboundCount = 10
        $rootScope.userProfile.machineDetails.maxInboundCount = 3
        $rootScope.userProfile.machineDetails.cooldown = 5

    }

}
SettingsController.$inject = ['$scope', '$rootScope', 'frameViewStateBroadcast', 'gateReaderServices', '$timeout']
