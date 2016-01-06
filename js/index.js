// TODO store stuff in sessionStorage?

$.getJSON("http://stocksplosion.apsis.io/api/company")
  .done(initializeDataTables)
  .error(handleError);

function initializeDataTables(data) {
  $('#companyTable').dataTable({
    data: data,
    lengthChange: false,
    pageLength: 200,
    columns: [
      {
        data: "name",
        width: "50%",
      }, {
        data: "symbol",
        width: "50%",
        render: function ( data, type, full, meta ) {
          return '<a href="' + getStockSymbolDetailsURL(data) + '">'+data+'</a>';
        },
      },
    ]
  });

  $('.dataTables_filter input').bind('keypress', function redirectOnEnterKeyPress(e) {
    if (e.which === 13) {
      e.preventDefault();
      var inputVal = $('.dataTables_filter input').val();
      window.location.href = getStockSymbolDetailsURL(inputVal)
    }
  });

  $('div.dataTables_filter input').focus()
  $('.dataTables_filter').css('float', 'left');
  $('.dataTables_filter label').css('font-size', '30px');
}

function handleError(err) {
  $('#error').text(err.toString());
}

function getStockSymbolDetailsURL(stockSymbol) {
  return 'details.html?company=' + stockSymbol.toUpperCase();
}
