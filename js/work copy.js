// Prevent Right Click
document.addEventListener('contextmenu', function(event){
    event.preventDefault()
})


const image_container = document.querySelector('.image--container')

for(image of image_container.children){
    image.onmouseover = function(){
        this.querySelector('p').style.opacity = 1
    }
    image.onmouseout = function(){
        this.querySelector('p').style.opacity = 0
    }
}

document.addEventListener('scroll', function(event){
    for(img of image_container.children){
        console.log(img.querySelector('img').getBoundingClientRect().y)
        if(img.querySelector('img').getBoundingClientRect().y<700){
            img.querySelector('img').style.filter = `grayscale(0)`
        }
        if(img.querySelector('img').getBoundingClientRect().y>1024){
            img.querySelector('img').style.filter = `grayscale(1)`
        }
    }
})


