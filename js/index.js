console.log(__dirname)

function testFileExists(src, successFunc, failFunc) {
    var xhr = new XMLHttpRequest();
    console.log(xhr)
    xhr.onreadystatechange = function () {
        console.log(this)
        if (this.readyState === this.DONE) {
            if (xhr.status === 200) {
                successFunc(xhr);
            } else {
                failFunc(xhr);
            }
        }
    }
    // xhr.error = function() {
    //     failFunc(xhr);
    // }
    // xhr.onabort = function() {
    //     failFunc(xhr);
    // }
    // xhr.timeout = function() {
    //     failFunc(xhr);
    // }
    xhr.timeout = 5000;           // TIMEOUT SET TO PREFERENCE (5 SEC)
    xhr.open('HEAD', src, true);
    xhr.send(null);               // VERY IMPORTANT
}
function fileExists(xhr) {
    alert("File exists !!  Yay !!");
}
function fileNotFound(xhr) {
    alert("Cannot find the file, bummer");
}

testFileExists("asd.html", fileExists, fileNotFound);

window.setTimeout(function() {
    document.querySelector('.image--container img').style.opacity = 1
    document.querySelector('.dashboard-top-left').style.opacity = 1
    
}, 1000);
