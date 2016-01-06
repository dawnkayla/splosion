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
  var arrayOfPrices = Object.keys(data.prices).map(function(date) {
    return data.prices[date];
  });

  analyzeData(arrayOfPrices);

  $('#chart').highcharts({
    title: {
      text: data.company.name + ' - ' + data.company.symbol
    },

    series: [{
      type: 'line',
      name: 'price',
      data: arrayOfPrices,
      dataLables: {
        formatter: function() {
          return '$' + this.y.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        }
      },
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

    yAxis: {
      labels: {
        formatter: function() {
          return '$' + this.value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        },
      },
      title: {
        text: 'Price',
      },
    },

    legend: {
      enabled: false,
    },

  });
}

function handleError(err) {
  $('#error').text(err.toString());
}

/*
 * This function works a lot like counting cards in blackjack.
 * We get the average price over the timespan
 * Then we comapre each price to the average.
 * If the count of the prices that were above the average is high then sell
 * If the count of the prices that were below the average is high then buy
 * If the count of the prices was equal then wait;
 */
function analyzeData(data) {
  var total = 0;
  data.forEach(function(price) {
    total += price;
  });
  var average = total / data.length;
  var counts = {
    above: 0,
    below: 0,
  }
  data.forEach(function(price) {
    if (price > average) {
      counts.above += 1;
    } else {
      counts.below += 1;
    }
  });

  var text;
  if (counts.above === counts.below) {
    text = 'WAIT';
  } else if (counts.above > counts.below) {
    text = 'SELL';
  } else {
    text = 'BUY';
  }
  $('#analysis').text(text);
}
