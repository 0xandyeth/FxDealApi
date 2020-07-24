let moment = require('moment'); // require

let getFormattedTime=function (date, format_string="Y-MM-DD HH:mm") {
    let date_obj;
    date_obj=moment(date);
    return date_obj.format(format_string);
}

module.exports={
    getFormattedTime:getFormattedTime
}