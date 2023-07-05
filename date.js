exports.getDate = function (){
    let today = new Date();
    let currentDay = today.getDay();
    let option = {
    weekday : "long",
    day : "numeric" ,
    month :"long",
    };

    let day = today.toLocaleDateString("en-US",option)
    return day;
}
exports.getDay = function(){
    const today = new Date();
    const currentDay = today.getDay();
    let option = {
    weekday : "long",
    };

    let day = today.toLocaleDateString("en-US",option)
    return day;
}
console.log(module.exports)