reportApp = angular.module('angSentRepApp', []);

reportApp.controller('SentRepController',  function($scope, $http, $window) {

	// let host = "http://localhost:8888";

    let host = "http://" + $window.location.host
	
	let URL_ALL_COMMENTS = host + "/getAllComments";
	let URL_INSERT_COMMENT = host +  "/insComment?";

    let URL_ALL_USERS = host + "/getAllUsers";

    let URL_MONTH_RATINGS = host + "/barMonthRating";
    let URL_YEAR_RATINGS = host + "/lineYearRating";
    
    $scope.comments = [];
	  $scope.users = [];
    $scope.monthlyratings = [];
    $scope.yearlyratings = [];
			
	$http.get(URL_ALL_COMMENTS).then(function(response) {
		
      $scope.comments =  response.data;
      //console.log($scope.comments);
      
    });

    $http.get(URL_ALL_USERS).then(function(response) {
		
        $scope.users =  response.data;
        
    });

    $http.get(URL_MONTH_RATINGS).then(function(response) {
		
        $scope.monthlyratings =  response.data;
        $scope.ratingNames = [];
        let counts = [];
        response.data.forEach(x => {
            $scope.ratingNames.push(x.ratingName);
            counts.push(x.No);
        });

        //console.log(counts);

        try {

            // Percent Chart of sentiment rating by month
            var ctx = document.getElementById("sentiment-rating-chart");
            if (ctx) {
              ctx.height = 280;
              var myChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: $scope.ratingNames,
                    datasets: [
                      {
                        //data: [10, 20, 20, 40, 10],
                        data: counts,
                        backgroundColor: [
                          '#ff1b6b',
                          '#ff6a00',
                          '#f89b29',
                          '#00ad5f',
                          '#00b5e9'
                        ],
                        hoverBackgroundColor: [
                          '#ff1b6b',
                          '#ff6a00',
                          '#f89b29',
                          '#00ad5f',
                          '#00b5e9'
                        ],
                        borderWidth: [
                          0, 0
                        ],
                        hoverBorderColor: [
                          'transparent',
                          'transparent'
                        ]
                      }
                    ],
                },
                options: {
                  maintainAspectRatio: false,
                  responsive: true,
                  cutoutPercentage: 55,
                  animation: {
                    animateScale: true,
                    animateRotate: true
                  },
                  legend: {
                    /* position: "top",
                    align: "start" */
                    display: false
                  },
                  tooltips: {
                    titleFontFamily: "Poppins",
                    xPadding: 15,
                    yPadding: 10,
                    caretPadding: 0,
                    bodyFontSize: 16
                  }
                }
              }); 
            }
        
          } catch (error) {
            console.log(error);
          }
        
    });

//data for line chart of rating by year
    $http.get(URL_YEAR_RATINGS).then(function(response) {

      //console.log(response.data);
      const {negative, neutral, positive} = response.data;
      
      
      let negativeNos = [];
      let neutralNos = [];
      let positiveNos = [];
      negative.forEach(x=> {
        negativeNos.push(x.No);
      })

      neutral.forEach(x=> {
        neutralNos.push(x.No);
      })

      positive.forEach(x=> {
        positiveNos.push(x.No);
      })

      console.log(negativeNos);
      console.log(neutralNos);
      console.log(positiveNos);
        try {
          var ctx = document.getElementById("sentimentChartByYear");
          if (ctx) {
            ctx.height = 150;
            var myChart = new Chart(ctx, {
              type: 'line',
              data: {
                labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                defaultFontFamily: "Poppins",
                datasets: [
                  {
                    label: "Negative",
                    color: "#FFE9F3",
                    borderColor: "#FA586D",
                    borderWidth: "1",
                    backgroundColor: "#FFE9F3",
                    data: negativeNos
                  },
                  {
                    label: "Neutral",
                    borderColor: "#717825",
                    borderWidth: "1",
                    backgroundColor: "#C2CE7A",
                    pointHighlightStroke: "rgba(26,179,148,1)",
                    data: neutralNos
                  },
                  {
                    label: "Positive",
                    borderColor: "#6B956F",
                    borderWidth: "1",
                    backgroundColor: "#AED3B1",
                    data: positiveNos
                  }
                ]
              },
              options: {
                legend: {
                  position: 'top',
                  labels: {
                    fontFamily: 'Poppins'
                  }
      
                },
                responsive: true,
                tooltips: {
                  mode: 'index',
                  intersect: false
                },
                hover: {
                  mode: 'nearest',
                  intersect: true
                },
                scales: {
                  x: {
                    beginAtZero: true,
                    ticks: {
                      fontFamily: "Poppins"
      
                    }
                  },
                  y: {
                    beginAtZero: true,
                    ticks: {
                      beginAtZero: true,
                      fontFamily: "Poppins"
                    }
                  }
                  /*xAxes: [{
                    ticks: {
                      fontFamily: "Poppins"
      
                    }
                  }],
                  yAxes: [{
                    ticks: {
                      beginAtZero: true,
                      fontFamily: "Poppins"
                    }
                  }]*/
                }
      
              }
            });
          }

        } catch (error) {
          console.log(error);
        }
        
    });

})