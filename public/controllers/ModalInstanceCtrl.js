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