var xhr = []; // an empty array for xhr requests
var comm = new common();
$(document).ready(() => {
    // date picker code
  $( "#dateFlt" ).datepicker({
    numberOfMonths: 3,
    showButtonPanel: true,
    minDate: 0,
    dateFormat: 'yy/mm/dd'
  });

  // keyup function for auto complete
  $('#fromFlt,#toFlt').bind('keyup', function(e) {
    var id = $(this).attr('id');

    /* code for key events to move up and down using arrow keys on suggestions */
    var li_Index="-1";
    if (e.which == 38 || e.which == 40) {
      $('.'+id+' li').each((index,data) => {
        if($(data).hasClass("liAct")==true) {
          li_Index = index;
        }
      });
      if(e.which == 38 && li_Index == "-1")
        li_Index = $('.'+id+' li').length;
      if (e.which == 38) {
        if (li_Index==0)
          li_Index = $('.'+id+' li').length-1;
        else
          li_Index--;
      } else {
      if (($('.'+id+' li').length-1)==li_Index)
        li_Index = 0;
      else
        li_Index++;
      }
      $('.'+id+' li').each((index,data) => {
        if (index  == li_Index) {
          $(this).addClass('liAct');
        }
        else {
          $(this).removeClass('liAct');
        }
      });
      return true;
    }
    /* *********************************************************************** */

    /* code to handle enter key event in autocomplete */
    if(e.which == 13) {
      var flg = true;
      $('.'+id+' li').each(() => {
        if($(this).hasClass('liAct')) {
          var airportCode = $(this).attr('id');
          setData(airportCode, id, airportCode);
          flg = false;
        }
      });
      if(!flg) {
        return;
      }
    }
    /* ********************************************** */

    let q = $(this).val();
    let str = '';
    if(q.length > 1) {
      // ajax call for list of airports using the text search
      comm.ajaxCall(`/api/list-of-airports/${q}`)
      .then((data) => {
        if(data.code == 0) {
          $(`.${id} .suggest`).removeClass('dn');
          str += `<ul>`;
          for(let vl of data.res) {
            str += `<li id="${vl.airportCode}" onclick="setData('${vl.cityName} (${vl.airportCode})', '${id}', '${vl.airportCode}')">${vl.cityName} (${vl.airportCode})</li>`;
          }
          str += `</ul>`;
        }
        $('.'+id+' .suggest').html(str);
      })
    }
    else {
      $('.'+id+' .suggest').html(str);
    }
  });

  $('.btn').click(() => {
    var frm = $('#hfromFlt').val();
    var to = $('#htoFlt').val();
    var dt = $('#dateFlt').val();

    // Form validation and showing appropriate msg
    if(!$('#hfromFlt').val()) {
      $('.alert').html('Please provide a valid source city');
      $('.alert').removeClass('dn');
      $('#fromFlt').focus();
      return;
    }
    if(!$('#htoFlt').val()) {
      $('.alert').html('Please provide a valid destination city');
      $('.alert').removeClass('dn');
      $('#toFlt').focus();
      return;
    }
    if(!dt) {
      $('.alert').html('Please provide a travel date');
      $('.alert').removeClass('dn');
      $('#dateFlt').focus();
      return;
    }
    window.location = '/searchPage?q='+frm+'-'+to+'-'+dt;
  });

  var p = window.location.search.substr(1);
  if(p) {
    var parr = p.split('=');
    if(parr.length) {
      var month = new Array("January","February","March","April","May","June","July","August","September","October","November","December");
      var params = parr[1].split('-');
      var frm = params[0];
      var to = params[1];
      var dt = params[2];

      var dateArr = comm.getDates(dt);
      var str = '';
      for(let vl of dateArr) {
        var ddt = new Date(vl);
        var dispDate = month[ddt.getMonth()] + ' ' + ddt.getDate() + ', ' + ddt.getFullYear();
        $('#dispDate').text(dispDate);
        if(vl == dt)
          str += '<li class="active" data-dt="'+vl+'"><a href="/searchPage?q='+frm+'-'+to+'-'+vl+'">'+dispDate+'</a></li>';
        else
          str += '<li data-dt="'+vl+'"><a href="/searchPage?q='+frm+'-'+to+'-'+vl+'">'+dispDate+'</a></li>';
      }
      showResults(frm, to, dt, month);
      $('.nav').html(str);
    }
  }
});

var showResults = (frm, to, dt, month) => {
  let ddt = new Date(dt);
  let dispDate = month[ddt.getMonth()] + ' ' + ddt.getDate() + ', ' + ddt.getFullYear();

  // ajax call to get all the airlines
  comm.ajaxCall(`api/list-of-airlines`)
  .then((data) => {
    if(data.code == 0) {
      var acodes = [];
      var flg = false;
      $.each(data.res, (k, vk) => {
        acodes.push(vk.code);

        // ajax async call for results from differnt airlines
        comm.ajaxCall(`/api/search-flights?frm=${frm}&to=${to}&dt=${dt}&ac=${vk.code}`)
        .then((fltdata) => {
          if(fltdata.code == 0) {
            for(let vl of fltdata.res) {

              let str = '';

              let sdt = new Date(vl.start.dateTime);
              let departDate = month[sdt.getMonth()] + ' ' + sdt.getDate() + ', ' + sdt.getFullYear();
              let departTime = (sdt.getHours().toString().length == 1 ? '0'+sdt.getHours() : sdt.getHours()) + ':' + (sdt.getMinutes().toString().length == 1 ? '0'+sdt.getMinutes() : sdt.getMinutes());

              let fdt = new Date(vl.finish.dateTime);
              let arriveDate = month[fdt.getMonth()] + ' ' + fdt.getDate() + ', ' + fdt.getFullYear();
              let arriveTime = (fdt.getHours().toString().length == 1 ? '0'+fdt.getHours() : fdt.getHours()) + ':' + (fdt.getMinutes().toString().length == 1 ? '0'+fdt.getMinutes() : fdt.getMinutes());

              str += `<li>
                <div class="booking-item-container">
                  <div class="booking-item">
                    <div class="row">
                      <div class="col-md-2">
                          <div class="booking-item-airline-logo">
                              <p>${vl.airline.name}</p>
                              <p>${vl.airline.code}-${vl.flightNum}</p>
                          </div>
                      </div>
                      <div class="col-md-5">
                          <div class="booking-item-flight-details">
                              <div class="booking-item-departure">
                                  <h5>${comm.tConvert(departTime)}</h5>
                                  <p class="booking-item-date">${departDate}</p>
                                  <p class="booking-item-destination">${vl.start.cityName} (${vl.start.cityCode})</p>
                              </div>
                              <div class="booking-item-arrival">
                                  <h5>${comm.tConvert(arriveTime)}</h5>
                                  <p class="booking-item-date">${arriveDate}</p>
                                  <p class="booking-item-destination">${vl.finish.cityName} (${vl.finish.cityCode})</p>
                              </div>
                          </div>
                      </div>
                      <div class="col-md-2">
                        <h5>${comm.minutesToStr(vl.durationMin)}</h5>
                        <p>2 stops</p>
                      </div>
                      <div class="col-md-3"><span class="booking-item-price">$${vl.price}</span><span>/person</span><a class="btn btn-primary" href="#">Select</a>
                      </div>
                    </div>
                  </div>
                </div>
              </li>`;

              $('.loaderClass').addClass('dn');
              $('.booking-list').append(str);

            }
          }
          else {
            flg = true;
          }
        });
      });
    }
    else {
      $('.loaderClass').addClass('dn');
    }
  });
}

// padding zero to getDate & getTime date functions
Number.prototype.padZero = function(len) {
  let s= String(this), c = '0';
  len= len || 2;
  while(s.length < len)
    s= c + s;
  return s;
}

// setting values from autocomplete to hidden fields
var setData = (cval, id, airportCode) => {
  $('#'+id).val(cval);
  $('#h'+id).val(airportCode);
  $('.'+id+' .suggest').addClass('dn');
};
