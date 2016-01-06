// TODO handle if not params.company
// TODO handle if non 200 respsonse from getJSON
// TODO clean up AKA better param names
// TODO remove yAxis title
// TODO remove legend
// TODO add some simple logic for BUY/SELL/WAIT
// TODO add in some documentation
// TODO increase BUY/SELL/WAIT font size
// TODO Change chart label. to company name / stock

var dateOffset = (24 * 60 * 60 * 1000) * 30; //30 days
var today = new Date();
var thirtyDaysAgo = new Date(today.getTime() - dateOffset);

var endDate   = today.toISOString().split('T')[0].replace(/-/g, '');
var startDate = thirtyDaysAgo.toISOString().split('T')[0].replace(/-/g, '');


function getAPIURL() {
  var url = window.location.href
  var params = {};

  // parse all the url params and put them in an object
  url.split('?')[1].split('&').forEach(function(string) {
    var parts = string.split('=');
    params[parts[0]] = parts[1];
  });

  var tail = params.company + '?startdate=' + startDate + '&enddate=' + endDate;
  return "http://stocksplosion.apsis.io/api/company/" + tail;
}


$.getJSON(getAPIURL())
  .done(function(data) {
    $('#foo').text('BUY');
    var goodData = Object.keys(data.prices).map(function(date) {
      return data.prices[date];
    });

    $('#container').highcharts({

      title: {
        text: 'Stock'
      },

      series: [{
        type: 'line',
        name: 'price',
        data: goodData,
        pointStart: thirtyDaysAgo.getTime(),
        pointInterval: 24 * 3600 * 1000
      }],

      plotOptions: {
        series: {
          cursor: 'pointer',
          animation: false,
        },
      },

      xAxis: {
        type: 'datetime',
        labels: {
          formatter: function() {
            return Highcharts.dateFormat('%d %b', this.value);
          }
        },
      },

    });
  })
  .fail(function(err) {
    // FAIL
  });

