// TODO handle if non 200 respsonse from getJSON
// TODO clean up AKA better param names
// TODO add in some comments
// TODO style search box to be more pronounced and on left
// TODO put focus on search input
// TODO store stuff in sessionStorage?

$.getJSON("http://stocksplosion.apsis.io/api/company")
  .done(initializeDataTables)
  .error(function(err) {
    console.log('OH NOEZ');
  });

function initializeDataTables(data) {
  $('#example').dataTable({
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
}

function getStockSymbolDetailsURL(stockSymbol) {
  return 'details.html?company=' + stockSymbol.toUpperCase();
}
