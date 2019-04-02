var makeDate = function() {
    var d = new Date();
    var formattedDate = "";

    formattedDate += (d.getMonth() + 1) + "_";

    formattedDate += d.getDate(0 + "_");

    formattedDate += d.getFullYear();

    return formattedDate;
};

module.exports = makeDate;