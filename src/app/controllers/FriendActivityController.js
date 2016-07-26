angular.module('app')
  .constant('friendactivity', {
    page_size: 5,
    url_base: 'https://envirocar.org/api/stable/users/',
    friend: '/friendActivities?',
    avatar: '/avatar'

  })
  .controller('FriendActivityController', ['$scope', '$http', '$rootScope',
    '$stateParams',
    '$state', 'friendactivity',
    function ($scope, $http, $rootScope, $stateParams, $state, friendactivity) {
      $scope.show_no_my_activity = false
      $scope.originaluser = false
      $scope.events = []
      var eventshelper = []
      $scope.busy = false
      $scope.page = 0
      $scope.page_size = friendactivity.page_size
      $http.defaults.headers.common = {
        'X-User': $rootScope.globals.currentUser.username,
        'X-Token': $rootScope.globals.currentUser.authdata
      }
      var username
      if ($stateParams.user == '') {
        $scope.originaluser = true
        username = $rootScope.globals.currentUser.username
      } else {
        $scope.originaluser = false
        username = $stateParams.user
        return
      }
      $scope.nextpage = function () {
        $scope.page++
        var url = friendactivity.url_base + username +
        friendactivity.friend
        $http.get(url + 'limit=' + $scope.page_size + '&page=' + $scope.page)
          .success(function (data, status, headers, config) {
            if (data.activities.length == 0) {
              $scope.show_no_my_activity = true
              console.log('fired hide')
            }
            for (var i = 0; i < data.activities.length; i++) {
              var helper = {}
              helper['time'] = data.activities[i].time
              helper['name'] = data.activities[i].user.name
              helper['profileurl'] = friendactivity.url_base + helper['name'] + friendactivity.avatar
              console.log(helper['profileurl'])
              helper['date'] = new Date(data.activities[i].time).toLocaleString()
              console.log(i)
              console.log(data.activities[i])
              helper['color'] = '#8CBF3F'
              if (data.activities[i].type == 'FRIENDED_USER') {
                helper['type'] = 0
                helper['topic'] = 'New Friend Activity'
                helper['color'] = '#0065A0'
                if ($rootScope.globals.currentUser.username != data.activities[i].other.name)
                  helper['name'] = data.activities[i].user.name +
                  ' is now friends with ' + data.activities[i].other.name
                else
                  helper['name'] = data.activities[i].user.name +
                  ' is now friends with you'
                helper['trackidlink'] = ''
              } else if (data.activities[i].type == 'CREATED_TRACK') {
                helper['type'] = 1
                helper['color'] = '#0065A0'
                helper['topic'] = 'New Track Upload'
                helper['trackidlink'] = (data.activities[i].track !=
                undefined) ? data.activities[i].track.id :
                  'Invalid ID'
              } else if (data.activities[i].type == 'CHANGED_PROFILE') {
                helper['type'] = 0
                helper['topic'] = data.activities[i].user.name +
                'Updated profile'
              } else if (data.activities[i].type == 'UNFRIENDED_USER') {
                continue
              } else if (data.activities[i].type == 'CREATED_GROUP') {
                helper['type'] = 0
                helper['topic'] = data.activities[i].user.name +
                ' created a Group'
              } else if (data.activities[i].type == 'CHANGED_GROUP') {
                helper['type'] = 0
                helper['topic'] = data.activities[i].user.name +
                ' changed the group'
              } else if (data.activities[i].type == 'JOINED_GROUP') {
                helper['type'] = 0
                helper['topic'] = data.activities[i].user.name +
                ' joined the Group'
              } else if (data.activities[i].type == 'LEFT_GROUP') {
                helper['type'] = 0
                helper['topic'] = data.activities[i].user.name +
                ' left the Group'
              } else if (data.activities[i].type == 'DELETED_GROUP') {
                helper['type'] = 0
                helper['topic'] = data.activities[i].user.name +
                ' deleted the group'
              }
              eventshelper.push(helper)
              console.log(helper)
            }
            console.log($scope.events)
            $scope.events = eventshelper
          })
      }
      $scope.nextpage($scope.page)
      $scope.goToActivity = function (activity, trackid) {
        // redirect ro a page only if it is a chart event.
        if (activity == 1) {
          console.log(trackid)
          $state.go('home.chart', {
            'trackid': trackid
          })
        }
        console.log('fired')
      }
    }
  ])
