class common {

  // converting minutes to Hours & Minutes
  minutesToStr(minutes) {
    var sign ='';
    if(minutes < 0) {
      sign = '-';
    }
    var hours = this.leftPad(Math.floor(Math.abs(minutes) / 60));
    var minutes = this.leftPad(Math.abs(minutes) % 60);
    return sign + hours +' hrs '+minutes + ' min';
  }

  leftPad(number) {
    return ((number < 10 && number >= 0) ? '0' : '') + number;
  }

  // getting +/-2 days from the selected date
  getDates(dt) {
    let dtarr = [];
    for(let i=-2; i<=2; i++) {
      var date = new Date(dt);
      date.setDate(date.getDate()+i);
      dtarr.push(date.getFullYear() + '/' + (date.getMonth()+1).padZero() + '/' + date.getDate().padZero());
    }
    return dtarr;
  }

  // converting time from 24hrs to 12hrs
  tConvert(time) {
    time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    if (time.length > 1) {
      time = time.slice (1);
      time[5] = +time[0] < 12 ? ' AM' : ' PM';
      time[0] = +time[0] % 12 || 12;
    }
    return time.join ('');
  }

  ajaxCall(url) {
    return new Promise((resolve, reject) => {
      $.ajax({
          url: url,
          dataType: 'json',
          cache: false
      })
      .success((data) => {
        resolve(data);
      })
      .error((err) => {
        reject(err);
      });
    })
  }

}
