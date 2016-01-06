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

/*
 * This feels a little hacky but it was also the quickest way to format the date
 * An ISO string gets the double digit day and month quickly plus it is shorter.
 * So split on the occurance of 'T' and then rip out the dashes.
*/
var endDate   = today.toISOString().split('T')[0].replace(/-/g, '');
var startDate = thirtyDaysAgo.toISOString().split('T')[0].replace(/-/g, '');

var url = getAPIURL();

if (url instanceof Error) {
  handleError(url);
} else {
  $.getJSON(url)
    .done(initializeChart)
    .fail(handleError);
}

function getAPIURL() {
  var baseUrl = 'http://stocksplosion.apsis.io/api/company/';
  var url = window.location.href
  var params = {};

  // parse all the url params and put them in an object
  var afterQuestionMark = url.split('?')[1];
  if (afterQuestionMark) {
    afterQuestionMark.split('&').forEach(function(string) {
      var parts = string.split('=');
      params[parts[0]] = parts[1];
    });
  }

  if (!params.company) return new Error('No company param in the url.');

  return baseUrl + params.company + '?startdate=' + startDate + '&enddate=' + endDate;
}

function initializeChart(data) {
  $('#foo').text('BUY');
  var goodData = Object.keys(data.prices).map(function(date) {
    return data.prices[date];
  });

  $('#chart').highcharts({

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
}

function handleError(err) {
  $('#error').html(err.toString());
}
