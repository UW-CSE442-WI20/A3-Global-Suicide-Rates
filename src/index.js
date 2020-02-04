window.onload = start()

document.addEventListener('DOMContentLoaded', function() {
    alert("Ready!");
}, false)

function start() {
    console.log('hello world');
    $.getJSON("/resources/overall-suicide-rates.json", function(json) {
        console.log(json); // access the response object
        console.log(json.data); // access the array
        console.log(json.data[0]); // access the first object of the array
        console.log(json.data[0].number); // access the first object proprty of the array
    })
    /*$.getJSON( "/resources/overall-suicide-rates.json", function( json ) {
        console.log( "JSON Data received, name is " + json.name)
        console.log("a")
    })*/
}


