$(function(){

    localStorage.setItem("search_history","['张三','李四','老王']")
function getHistory(){
    var history = localStorage.getItem("search_history")
    console.log(history)
}
getHistory()

// function getHistory(){
//     var history = localStorage.getItem("search_history") || '[]';
//     console.log(history)
//     return JSON.parse(history);
// }

// function render(){
//     var arr = getHistory();
//     var html = template("tpinner",{arr:arr});
//     console.log(html)
// }

// render()


})