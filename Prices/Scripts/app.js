
const chartColors = [
    'rgb(255, 99, 132)',
    'rgb(255, 159, 64)',
    'rgb(255, 205, 86)',
    'rgb(75, 192, 192)',
    'rgb(54, 162, 235)',
    'rgb(153, 102, 255)',
    'rgb(201, 203, 207)',
    'rgb(155, 99, 132)',
    'rgb(255, 10, 14)',
    'rgb(234, 205, 1)',
    'rgb(75, 92, 92)',
    'rgb(4, 122, 235)',
    'rgb(100, 142, 3)',
    'rgb(101, 203, 27)'

];

const lineOptions = {
    ///Boolean - Whether grid lines are shown across the chart
    scaleShowGridLines: true,
    //String - Colour of the grid lines
    scaleGridLineColor: "rgba(0,0,0,.05)",
    //Number - Width of the grid lines
    scaleGridLineWidth: 1,
    //Boolean - Whether the line is curved between points
    bezierCurve: false,
    //Number - Tension of the bezier curve between points
    bezierCurveTension: 0.4,
    //Boolean - Whether to show a dot for each point
    pointDot: true,
    //Number - Radius of each point dot in pixels
    pointDotRadius: 4,
    //Number - Pixel width of point dot stroke
    pointDotStrokeWidth: 1,
    //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
    pointHitDetectionRadius: 20,
    //Boolean - Whether to show a stroke for datasets
    datasetStroke: true,
    //Number - Pixel width of dataset stroke
    datasetStrokeWidth: 2,
    //Boolean - Whether to fill the dataset with a colour
    datasetFill: false,
    //Boolean - Re-draw chart on page resize
    responsive: true,

};


const app = angular.module('testApp', []);
app.constant('serviceBasePath', window.location.origin);

app.factory('pricesService', ['$http', '$q', 'serviceBasePath', function ($http, $q, serviceBasePath) {
    const fac = {};
    fac.getCheesePrices = () => {
        const defer = $q.defer();
        $http({
            method: 'GET',
            url: serviceBasePath + "/api/FetchCheesePrices",
            data: {}
        }).then((response) => {
            defer.resolve(response.data);
        }, (error) =>{
            defer.reject(error);
        })
        return defer.promise;
    };

    return fac;
}]);

app.controller('demoController', ['$scope', 'pricesService', function ($scope, pricesService) {

    $scope.inprocessing = false;
    $scope.cheeseData = { years: [], names: [], prices: [] };
    $scope.dataStatus = "Loading ...";



    $scope.getCheesePrices =  () => {
        $scope.dataStatus = "Loading ...";
        pricesService.getCheesePrices().then((data) =>{
            if (data && data.cheese_data) {
                $scope.cheeseData.years = data.cheese_data.years;
                if ($scope.cheeseData.years && $scope.cheeseData.years.length > 0) {
                    $scope.dataStatus = "";
                    $scope.cheeseData.names = data.cheese_data.names;
                    $scope.cheeseData.prices = data.cheese_data.prices;
                } else {
                    $scope.dataStatus = "No Data Available";
                }
            }
            _drawChart();
        }, (error) => {
            $scope.dataStatus = "";
            console.log("error", error)

            //show the error
            const errDivContainer = document.getElementById('err_container');
            const errDiv = document.getElementById('err_msg');
            errDiv.innerText = error.data.ExceptionMessage;
            errDivContainer.classList.remove("collapse");
            
        })
    };


    function _generateChartDataset() {
        const dataSet = [];
        const arrayLength = $scope.cheeseData.prices.length;
        for (let i = 0; i < arrayLength; i++) {
            const item = {
                label: $scope.cheeseData.prices[i].name,
                strokeColor: chartColors[i],
                pointColor: chartColors[i],
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: chartColors[i],
                data: $scope.cheeseData.prices[i].price_data
            }
            dataSet.push(item);
        }
        return dataSet;
    }

    // LINE CHART
    function _drawChart() {
        // ref: http://www.chartjs.org/docs/#line-chart-introduction
        const lineData = {
            labels: $scope.cheeseData.names,
            datasets: _generateChartDataset()
        };

        // render chart
        const ctx = document.getElementById("lineChart").getContext("2d");
        const lineChart = new Chart(ctx).Line(lineData, lineOptions);

        // add legend
        document.getElementById('line-legend').innerHTML = lineChart.generateLegend();
        
    }
    // END LINE CHART

    $scope.getCheesePrices();

}]);
