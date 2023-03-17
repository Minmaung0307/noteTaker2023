//canvas clock
const date = new Date();
const year = date.getFullYear();
document.getElementById("year").innerHTML = year;

//digital clock
const clock = document.getElementById('myclk');

function updateTime () {
    const now = moment();
    const ko = now.format('hh : mm : ss A')
    // console.log(ko);
    clock.textContent = ko;
// console.log('Time is being updated!!!')
}
setInterval(updateTime, 1000);
updateTime();
