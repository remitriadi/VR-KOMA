const img = new Image(200,300)
img.src = 'https://www.google.com/images/srpr/logo4w.png'

console.log(img)

window.setTimeout(function() {
    document.querySelector('.image--container img').style.opacity = 1
    document.querySelector('.dashboard-top-left').style.opacity = 1
    
}, 1000);
