var app = angular.module('logApp', []);

//Use the Module.factory('name', constructorFunction) method to create a new service.
app.factory('logService', function(){
  var service = {};
  //Declare variables and functions associated with the services functionality. In this case:
    //a log function which prints the message number and the message in console.
    //a getMessageCount function, which returns the number of messages which have been logged.
  var messageCount = 0;
  service.log = function(message){
    console.log(++messageCount + ': ' + message);
  }
  service.getMessageCount = function(){
    return messageCount;
  }
  // Expose public functions with an object. Just like in the revealing module
  // pattern, we may want to keep some of our variables or methods private/protected,
  // this pattern allows us to only expose the functionality we want to have exposed.

  //i.e. messageCount is not visible except through the getMessageCount() method
  return service;
});

app.component('logComponent', {
  controller : function(logService) {
    var vm = this;
    vm.message = "";
    vm.totalMessages = logService.getMessageCount();
    vm.logMessage = function(message){
      logService.log(message);
      vm.totalMessages = logService.getMessageCount();
    };
  },

  template : `
    <div class="well" ng-component="logComponent">
        <h1>ngLogger</h1>
    </div>
    <div class="row">
        <div class="col-md-8">
            <input class="form-control" type="text" ng-model="$ctrl.message" />
        </div>
        <div class="col-md-2">
            <button class="btn btn-primary" ng-click="$ctrl.logMessage($ctrl.message)">
            Log Message
          </button>
        </div>
    </div>
    <div>
        <h4>Messages Logged:
        <span class="label label-default">
          {{$ctrl.totalMessages}}
        </span>
      </h4>
    </div>
  `
});
