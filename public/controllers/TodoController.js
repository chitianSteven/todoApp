angular.module('myApp', ['ngRoute', 'ngResource', 'ngAnimate', 'ui.bootstrap', 'angularSoundManager'])

    .factory('Todos', ['$resource', function($resource){
      return $resource('/todos/:id', null, {
        'update': { method:'PUT' }
      });
    }])


    .controller('TodoController', ['$scope', 'Todos', '$uibModal', '$log', function ($scope, Todos, $uibModal, $log) {
    	//-----------1. Database binding functions-----------//
    	//-----------2. Calendar functions-------------------//
    	//-----------3. Music functions----------------------//
    	//-----------4. Modal functions----------------------//
    	//-----------	4.1. Part 1 for constroller in the---//
    	//-----------	     main window---------------------//
    	//-----------	4.2. Part 2 for constroller in the---//
    	//-----------	     pop window (code is put under---//
    	//-----------	     the Others part)----------------//
    	//-----------5. Others-------------------------------//




    	//---------------------------------------------------//
    	//-----------1. Database binding functions-----------//
    	//---------------------------------------------------//
	    $scope.save = function(){
	    	var date = $scope.year+"-"+$scope.day+"-"+$scope.month+"T00:00:00.000Z";
	        var todo = new Todos({ title: "test", priority: "normal", content: "This is a new task", complete: false, alarm: false, date: date });
	        todo.$save(function(){
	          $scope.todos.push(todo);
	        });
	    };

	    $scope.update = function(todo){
	        var todo = todo;
	        Todos.update({id: todo._id}, todo);
	    };

	    $scope.delete = function(id){
	        Todos.remove({id:id}, function (){})
	        refresh();
	    };

		$scope.numPerPage = 5;
		$scope.totalItems = 64;
		$scope.currentPage = 1;
		$scope.maxSize = 5;
		$scope.totalPage = 1;
	    //set the Date variables
		var month_name = ['January','February', 'March', 'April', 'May', 'June', 'July', 'Augst', 'September', 'Octorber', 'Novmenber', 'December'];
		var day_name = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

		$scope.$watch("currentPage+todos.length", function() {	
			var begin = (($scope.currentPage - 1) * $scope.numPerPage),
				  end = begin + $scope.numPerPage;
			if ($scope.todos.length > 0) {
				$scope.filteredTodosAll = [];
		    	var date = $scope.year+"-"+(month_name.indexOf($scope.month)+1)+"-"+$scope.day;
				for (var i=0; i<$scope.todos.length; i=i+1) {
					if ($scope.todos[i].date.slice(0,$scope.todos[i].date.indexOf("T"))==date) {
						$scope.filteredTodosAll.push($scope.todos[i]);
					}
				}
				$scope.filteredTodos = $scope.filteredTodosAll.slice(begin, end);
				$scope.totalPage = Math.floor(($scope.filteredTodosAll.length/$scope.numPerPage)-0.1)+1;
			}
		});

		var refresh = function() {
			$scope.todos = Todos.query();
			var date;
			for (var i=0; i<$scope.todos.length; i=i+1) {
				if ($scope.todos[i].complete===false) {
					date = $scope.todos[i].date.slice(0,$scope.todos[i].date.indexOf("T"));
					date = date.split("-");

				}
			}
		}

		refresh();


		//Start editing the note details
		$scope.edit = function(todo) {
			$scope.thisTodo = todo;
			var calendarSectionWidth = $(".leftPage .calendarSection").width();
			//Change the left page for the note details
			var styles1 = {
				transform: "translateX(110%)"
			};
			var styles2 = {
				transform: "translateX(0%)"
			};

			$(".leftPage .noteDetails").css(styles2);
			$(".leftPage .calendarSection").css(styles1);
		}
		
		//Change the left page to the calendar page
		$scope.back = function() {
			var styles1 = {
				transform: "translateX(0%)"
			};
			var styles2 = {
				transform: "translateX(-110%)"
			};
			$(".leftPage .noteDetails").css(styles2);
			$(".leftPage .calendarSection").css(styles1);
		}




    	//---------------------------------------------------//
    	//-----------2. Calendar functions-------------------//
    	//---------------------------------------------------//
		var getCalenderDays = function(date) {
			var first_date = date.month+" "+1+" "+date.year;
			var tmp = new Date(first_date).toDateString();
			var first_day = tmp.substring(0, 3);
			var day_no = day_name.indexOf(first_day);
			var days = new Date(date.year, month_name.indexOf(date.month)+1, 0).getDate();

			return {day_no: day_no, days: days};
		}

		var refreshCalendar = function(scope) {

			if (scope.month==undefined && scope.day==undefined && scope.year==undefined) {
				//set the Date variables
				var d = new Date();
				var month = month_name[d.getMonth()];
				var year = d.getFullYear();
				var getDays = getCalenderDays({month: month, year: year});
				var day_no = getDays.day_no;
				var days = getDays.days;

				scope.month = month;
				scope.day = d.getDate();
				scope.year = year;
			} else {
				var getDays = getCalenderDays({month: scope.month, year: scope.year});
				var day_no = getDays.day_no;
				var days = getDays.days;
			}

			var calendar = get_calendar(day_no,days);
			document.getElementById('calendar-month-year').innerHTML = scope.month+" "+scope.year;
			document.getElementById('Month').innerHTML = scope.month;
			document.getElementById('Day').innerHTML = scope.day;

			var thisNode = document.getElementById('calendar-dates');
			while (thisNode.firstChild) {
				thisNode.removeChild(thisNode.firstChild);
			}
			document.getElementById('calendar-dates').appendChild(calendar);
			var styles = {
				"background-color": "red"
			};
			$("#calendar-dates").find("td").filter(function() {
				if ($(this).text()==scope.day) {
					$(this).css(styles);
				}
			});
		}
		refreshCalendar($scope);

		//Build the calendar
		function get_calendar(day_no, days) {
			var table = document.createElement('table');
			var tr = document.createElement('tr');

			for (var i=0; i<=6; i+=1) {
				var td = document.createElement('td');
				td.innerHTML = "SMTWTFS"[i];
				tr.appendChild(td);
			}
			table.appendChild(tr);

			//create 2nd row
			tr = document.createElement('tr');
			for (var c=0; c<=6; c+=1) {
				if (c == day_no) {
					break;
				}
				var td = document.createElement('td');
				td.innerHTML = "";
				tr.appendChild(td);
			}

			var count = 1;
			for (var c= 0; c<=6-day_no; c+=1) {
				var td = document.createElement('td');
				td.innerHTML = count;
				count+=1;
				tr.appendChild(td);
			}
			table.appendChild(tr);

			//rest of the date rows
			for (var r=3; r<=6; r+=1) {
				tr = document.createElement('tr');
				for (var c=0; c<=6; c+=1) {
					if (count > days) {
						table.appendChild(tr);
						count = "";
					}
					var td = document.createElement('td');
					td.innerHTML= count;
					if (count!=="") {
						count+=1;
					}
					tr.appendChild(td);
				}
				table.appendChild(tr);
			}
			return table;
		}

		//Select the date
		$("#calendar-dates").on("click", function(e) {
			var dateNo = e.target.outerText;
			if (parseInt(dateNo)) {
				$("#Day").text(dateNo);
			}
			$scope.day = dateNo;
			refresh();
		});

		//Change the date color
		$("#oneDateMark").on("click", function(e) {
			// console.log(e.target.id);
			var color = e.target.id;
			switch(color) {
				case "blue":
					color = "#00b5d1";
					break;
				case "yellow":
					color = "#EBF056";
					break;
				case "green": 
					color = "#99E8A8";
					break;
			}
			var styles1 = {
				"border-color": color
			};
			var styles2 = {
				"background-color": color
			}
			$("#oneDate").css(styles1);
			$("#oneDateUpside").css(styles2);
			var matchText = $("#Day").text();
			$("#calendar-dates").find("td").filter(function() {
				if ($(this).text()==matchText) {
					$(this).css(styles2);
				}
			});
		});

		//Change the month
		var changeMonth = function(turn) {

		}

		$("#preMonth").on("click", function(e) {
			changeMonth("pre");
		})

		$("#nextMonth").on("click", function(e) {
			changeMonth("pre");		
		});

    	//---------------------------------------------------//
    	//-----------3. Music functions----------------------//
    	//---------------------------------------------------//
    	 $scope.songs = [
            {
                id: 'one',
                title: 'Ocean deep',
                artist: 'Someone',
                url: 'music/song1.mp3'
            },
            {
                id: 'one',
                title: "What Doesn't Kill You (Stronger)",
                artist: 'Kelly Clarkson',
                url: 'music/song2.mp3'
            }
        ];





    	//---------------------------------------------------//
    	//-----------4. Modal functions----------------------//
    	//-----------	4.1. Part 1 for constroller in the---//
    	//-----------	     main window---------------------//
    	//---------------------------------------------------//
		$scope.animationsEnabled = true;
		$scope.items = ['item1', 'item2', 'item3'];

		$scope.featherOpen = function (size) {
		    var modalInstance = $uibModal.open({
		        animation: $scope.animationsEnabled,
		        templateUrl: 'myModalContent.html',
		        controller: 'TodoController',
		        size: size,
		        resolve: {
		        	items: function () {
		            	return $scope.items;
		            }
		        }
		    });

		    modalInstance.result.then(function (selectedItem) {
		        $scope.selected = selectedItem;
		    }, function () {
		        $log.info('Modal dismissed at: ' + new Date());
		    });
		};
    	//---------------------------------------------------//
    	//-----------5. Others-------------------------------//
    	//---------------------------------------------------//

    }])
    	//---------------------------------------------------//
    	//-----------4. Modal functions----------------------//
    	//-----------	4.2. Part 2 for constroller in the---//
    	//-----------	     pop window----------------------//
    	//---------------------------------------------------//
angular.module('myApp').controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, items) {

		$scope.items = ['item1', 'item2', 'item3'];
	$scope.selected = {
		item: $scope.items[0]
	};

	$scope.ok = function () {
		$uibModalInstance.close($scope.selected.item);
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
});

//Set the news sliders
$('.variable-width').slick({
  dots: false,
  infinite: true,
  speed: 300,
  slidesToShow: 1,
  centerMode: true,
  variableWidth: true,
  autoplay: true,
  autoplaySpeed: 2000,
  arrows: false
});