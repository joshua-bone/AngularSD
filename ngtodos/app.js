var app = angular.module('ngTodo', []);

app.factory('todoService', [function(){
  var service = {};
  var todos = [
      {id: 1, task: "get milk", completed: false},
      {id: 2, task: "change oil", completed: false},
      {id: 3, task: "get haircut", completed: false},
      {id: 4, task: "wash car", completed: false},
      {id: 5, task: "shovel driveway", completed: false},
      {id: 6, task: "christmas shopping", completed: false}
    ];
  service.getTodos = function(){
    return todos;
  };
  service.createTodo = function(todo){
    todo.id = todos.length + 1;
    todos.push(todo);
  };
  service.removeTodo = function(id){
    var index = -1;
    for (var i = 0; i < todos.length; i++){
      if (todos[i].id === id){
        index = i; break;
      }
    }
    todos.splice(i, 1);
  }
  return service;
}]);

app.controller('appController', function(){
  var vm = this;
});

app.controller('todosController', ['$scope', 'todoService', function($scope, todoService){
  var vm = this; //equivalent to 'todosController as vm' syntax
  vm.todos = todoService.getTodos();
  $scope.addNewTodo = function(name){
    todoService.createTodo({task: name, completed: false})
  };
  $scope.countIncompleteTodos = function(){
    var count = 0;
    vm.todos.forEach(function(t){
      count += !t.completed;
    });
    return count;
  }
  $scope.getLabelColor = function(){
    var classes = ["label-success", "label-warning", "label-danger"];
    var num = $scope.countIncompleteTodos();
    if (num < 3){
      return classes[0];
    } else if (num < 6){
      return classes[1];
    } else {
      return classes[2];
    }
  }
}]);

app.component('appComponent',
{
  template: '<todos-component></todos-component>',
  controller: 'appController'
});

app.component('todosComponent',
{
  template: `
            <div class="jumbotron">
              <h2>ngTodo <span class="label {{getLabelColor()}}">{{countIncompleteTodos()}}</span></h2>
            </div>
            <input type="text" ng-model="newTodo" placeholder="Enter a new todo..."></input>
            <button class='btn btn-primary' ng-click="addNewTodo(newTodo)">Submit</button>
            <hr>
            <todos-table bound-data="$ctrl.todos"></todos-table>
            <footer class="footer"><h3 class="text-center">
              Todos Completed: <span class="label label-success">{{$ctrl.todos.length - countIncompleteTodos()}}</span></h3></footer>
            `,
  controller: 'todosController', //controller gets called as constructor when component is built, creates $scope at that time
  bindings:{
    boundData: '<'
  }
});

app.controller('todosTableController', ['$scope', 'todoService', function($scope, todoService){
  var vm = this;
  vm.showComplete = false;
  $scope.toggleShowComplete = function(){
    vm.showComplete = !vm.showComplete;
  };
  $scope.filterByCompleted = function(task){
    return (vm.showComplete || !task.completed);
  };
  $scope.remove=function(id){
    todoService.removeTodo(id);
  }
}]);

app.component('todosTable',
{
  template: `
              <button class='btn btn-default' ng-click="toggleShowComplete()">{{$ctrl.showComplete ? 'Hide' : 'Show'}} Completed Todos</button>
              <table class="table-striped" style="width : 100%">
               <thead>
                 <th>Todo</th>
                 <th>Mark</th>
                 <th>Delete</th>
               </thead>
               <tbody>
                 <tr ng-repeat="todo in $ctrl.boundData | orderBy: 'task' | filter: filterByCompleted">
                   <td ng-style="todo.completed && {'text-decoration' : 'line-through'}">{{todo.task}}</td>
                   <td><input type="checkbox" ng-model="todo.completed"</td>
                   <td><button class="btn-sm btn-danger" ng-click="remove(todo.id)">Delete</button></td>
                 </tr>
               </tbody>
             </table>`,
  controller: 'todosTableController',
  bindings:{
    boundData: '='
  }

}
);
