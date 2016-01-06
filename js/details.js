// TODO handle if not params.company
// TODO handle if non 200 respsonse from getJSON
// TODO clean up AKA better param names
// TODO parameterize startdate/enddate
// TODO remove yAxis title
// TODO remove legend
// TODO add some simple logic for BUY/SELL/WAIT
// TODO add in some documentation
// TODO increase BUY/SELL/WAIT font size

var url = window.location.href
var params = {};
url.split('?')[1].split('&').forEach(function(string) {
  var parts = string.split('=');
  params[parts[0]] = parts[1];
});
var tail = params.company + '?startdate=20150501&enddate=20150530'
$.getJSON("http://stocksplosion.apsis.io/api/company/" + tail)
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
        pointStart: Date.UTC(2015, 05, 1),
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

