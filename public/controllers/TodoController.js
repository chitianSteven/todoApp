angular.module('myApp', ['ngRoute', 'ngResource', 'ngAnimate', 'ui.bootstrap', 'angularSoundManager'])

    .factory('Todos', ['$resource', function($resource){
      return $resource('/todos/:id', null, {
        'update': { method:'PUT' }
      });
    }])

    .factory('ContactList', ['$resource', function($resource){
      return $resource('/contactlist/:id', null, {
        'update': { method:'PUT' }
      });
    }])


    .controller('TodoController', ['$scope', 'Todos', 'ContactList', function ($scope, Todos, ContactList) {

    	//-----------1. Variables setting--------------------//
    	//-----------2. Database binding functions-----------//
    	//-----------3. Calendar functions-------------------//
    	//-----------4. Music functions----------------------//
    	//-----------5. Modal functions----------------------//
    	//-----------	5.1. Outside Container---------------//
    	//-----------6. Contact list functions---------------//
    	//-----------7. Others-------------------------------//


    	//---------------------------------------------------//
    	//-----------1. Variables setting--------------------//
    	//---------------------------------------------------//
		$scope.numPerPage = 5;
		$scope.totalItems = 64;
		$scope.currentPage = 1;
		$scope.maxSize = 5;
		$scope.totalPage = 1;
		$scope.numPerPageContact = 5;
		$scope.totalItemsContact = 64;
		$scope.currentPageContact = 1;
		$scope.maxSizeContact = 5;
		$scope.totalPageContact = 1;
	    //set the Date variables
		var month_name = ['January','February', 'March', 'April', 'May', 'June', 'July', 'Augst', 'September', 'Octorber', 'Novmenber', 'December'];
		var day_name = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];


    	//---------------------------------------------------//
    	//-----------2. Database binding functions-----------//
    	//---------------------------------------------------//
	    $scope.save = function(database){
	    	if (database==="notelist") {
		    	var date = $scope.year+"-"+$scope.day+"-"+$scope.month+"T00:00:00.000Z";
		        var todo = new Todos({ title: "test", priority: "normal", content: "This is a new task", complete: false, alarm: false, date: date });
		        todo.$save(function(){
		        	$scope.todos.push(todo);
		        });
	        } else if (database==="contactlist") {
				var contact = new ContactList({ name: "name", gendar: "male", phone: "0000000000", email: "someone@email.com", address: "address", note: "note" });
		        contact.$save(function(){
		        	$scope.contacts.push(contact);
		        });
	        }
	    };

	    $scope.update = function(database, data){
	    	if (database==="notelist") {
		        Todos.update({id: data._id}, data);
	    	} else if (database==="contactlist") {
		        ContactList.update({id: data._id}, data);
	        }
	    };

	    $scope.delete = function(database, id){
	    	if (database==="notelist") {
		        Todos.remove({id:id}, function (){});
			    refresh("notelist");
	    	} else if (database==="contactlist") {
	        	ContactList.remove({id:id}, function (){});
			    refresh("contactlist");
	        }
	    };

		$scope.$watch("currentPage+todos.length", function() {	
			var begin = (($scope.currentPage - 1) * $scope.numPerPage),
				  end = begin + $scope.numPerPage;

			if ($scope.todos.length > 0 && $scope.totalPage>=$scope.currentPage-1) {
				var filteredTodosAll = [];
		    	var date = $scope.year+"-"+(month_name.indexOf($scope.month)+1)+"-"+$scope.day;
				for (var i=0; i<$scope.todos.length; i=i+1) {
					if ($scope.todos[i].date.slice(0,$scope.todos[i].date.indexOf("T"))==date) {
						filteredTodosAll.push($scope.todos[i]);
					}
				}
				$scope.filteredTodos = filteredTodosAll.slice(begin, end);
				$scope.totalPage = Math.floor((filteredTodosAll.length/$scope.numPerPage)-0.1)+1;
			}
		});

		$scope.$watch("currentPageContact+contacts.length", function() {	
			var begin = (($scope.currentPageContact - 1) * $scope.numPerPageContact),
				  end = begin + $scope.numPerPageContact;
			if ($scope.contacts.length > 0 && $scope.totalPageContact>=$scope.currentPageContact-1) {
				$scope.filteredContacts = $scope.contacts.slice(begin, end);
				$scope.totalPageContact = Math.floor(($scope.contacts.length/$scope.numPerPageContact)-0.1)+1;
			}
		});

		var refresh = function(database) {
	    	if (database==="notelist") {
				$scope.todos = Todos.query();
				if ($scope.todos.length===0) {
					console.log($scope.totalPage);
				} 	
				// var date;
				// for (var i=0; i<$scope.todos.length; i=i+1) {
				// 	if ($scope.todos[i].complete===false) {
				// 		date = $scope.todos[i].date.slice(0,$scope.todos[i].date.indexOf("T"));
				// 		date = date.split("-");
				// 	}
				// }
	    	} else if (database==="contactlist") {
				$scope.contacts = ContactList.query(); 
				if ($scope.contacts.length===0) {
					$scope.totalPageContact=0;
				} 	
	        }
		}

		refresh("notelist");
		refresh("contactlist");


		//Start editing the note details
		$scope.edit = function(database, todo) {
	    	if (database==="notelist") {
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
	    	} else if (database==="contactlist") {

			}		
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
    	//-----------3. Calendar functions-------------------//
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
			refresh("notelist");
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
    	//-----------4. Music functions----------------------//
    	//---------------------------------------------------//
    	 $scope.songs = [
            {
                id: 'one',
                title: 'Ocean deep',
                artist: 'Someone',
                url: 'music/song1.mp3'
            },
            {
                id: 'two',
                title: "Stronger",
                artist: 'Kelly Clarkson',
                url: 'music/song2.mp3'
            }
        ];


    	//---------------------------------------------------//
    	//-----------5. Modal functions----------------------//
    	//-----------	5.1. Outside Container---------------//
    	//---------------------------------------------------//
    	var styleModalShow = {
    		"opacity" : "1",
			"transform": "scale(1)",
    	},
    		styleModalHide = {
    		"opacity" : "0",
			"transform": "scale(.01)",
    	};

    	var styleModalsContainerShow = {
    		"opacity" : ".7",
			"transform": "scale(1)",
    	},
    		styleModalsContainerHide = {
    		"opacity" : "0",
			"transform": "scale(.01)",
    	};

		$("#modalsContainer").on("click",function(e) {
			$("#modalsContainer").css(styleModalsContainerHide);
			$("#musicModalContainer").css(styleModalHide);
			$("#contactHomeModalContainer").css(styleModalHide);
		})

		$("#contactList").on("click",function(e) {
        	$("#modalsContainer").css(styleModalsContainerShow);
			$("#contactHomeModalContainer").css(styleModalShow);
		})

		$("#contactList").on("click",function(e) {
        	$("#modalsContainer").css(styleModalsContainerShow);
			$("#contactHomeModalContainer").css(styleModalShow);
		})

		$("#featherMusic").on("click",function(e) {
        	$("#modalsContainer").css(styleModalsContainerShow);
			$("#musicModalContainer").css(styleModalShow);
        })


    	//---------------------------------------------------//
    	//-----------6. Contact list functions---------------//
    	//---------------------------------------------------//





    	//---------------------------------------------------//
    	//-----------7. Others-------------------------------//
    	//---------------------------------------------------//
    	var genNumberArray = function(start, end, gap) {
    			var array = [];
    		for (var i = start; i<=end; i=i+gap) {
    			array.push(i);
    		}
    		return array;
    	}
    	$scope.alarmDays = genNumberArray(0, 30, 1);
    	$scope.alarmHours = genNumberArray(0, 24, 1);
    	$scope.alarmMinites = genNumberArray(0, 60, 5);

    }])


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