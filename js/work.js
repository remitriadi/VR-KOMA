// Prevent Right Click
document.addEventListener('contextmenu', function(event){
    event.preventDefault()
})
const image_container = document.querySelector('.image--wrap')
const images = document.querySelectorAll('.image--wrap img')

let width_check = 0
let image_array_row = []
let image_array_column = []
let previous_width = 0
let ratio_array = []
let count = 0
const original_width_array = []
const original_height_array = []

window.setTimeout(function(){
    const zoom_percent = (Math.round(window.devicePixelRatio * 100)/100)
    for(x of images){
        original_width_array.push(x.width)
        original_height_array.push(x.height)
    }
    width_check = 0
    image_array_row = []
    image_array_column = []
    previous_width = 0
    ratio_array = []

    let image_count = 0
    for(image of images){
        image.style.width = original_width_array[image_count]+ 'px'
        image.style.height = original_height_array[image_count]+ 'px'
        image_count += 1
    }
    //Create column * row array
    for(image of images){
        width_check += (image.width * zoom_percent)
        
        if(width_check < window.innerWidth * zoom_percent){
            image_array_row.push(image)
        }
        else{
            ratio_array.push((window.innerWidth/previous_width) * 0.99)
            image_array_column.push(image_array_row)
            width_check = 0
            width_check += (image.width * zoom_percent)
            image_array_row = []
            image_array_row.push(image)
        }
        previous_width = width_check
    }

    //Edit image height and with per row
    
    let row_count = 0
    for(image_row of image_array_column){
        for(image_edit of image_row){
            image_edit.style.width = (((image_edit.width * zoom_percent) * ratio_array[row_count]))  + 'px'
            image_edit.style.height = (((image_edit.clientHeight * zoom_percent) * ratio_array[row_count]))  + 'px'
        }
        row_count+= 1
    }
},100)


window.addEventListener('resize',function(){
    const zoom_percent = (Math.round(window.devicePixelRatio * 100)/100)
    for(x of images){
        original_width_array.push(x.width)
        original_height_array.push(x.height)
    }
    width_check = 0
    image_array_row = []
    image_array_column = []
    previous_width = 0
    ratio_array = []

    let image_count = 0
    for(image of images){
        image.style.width = original_width_array[image_count]+ 'px'
        image.style.height = original_height_array[image_count]+ 'px'
        image_count += 1
    }
    //Create column * row array
    for(image of images){
        width_check += (image.width * zoom_percent)
        
        if(width_check < window.innerWidth * zoom_percent){
            image_array_row.push(image)
        }
        else{
            ratio_array.push((window.innerWidth/previous_width) * 0.99)
            image_array_column.push(image_array_row)
            width_check = 0
            width_check += (image.width * zoom_percent)
            image_array_row = []
            image_array_row.push(image)
        }
        previous_width = width_check
    }

    //Edit image height and with per row
    
    let row_count = 0
    for(image_row of image_array_column){
        for(image_edit of image_row){
            image_edit.style.width = (((image_edit.width * zoom_percent) * ratio_array[row_count]))  + 'px'
            image_edit.style.height = (((image_edit.clientHeight * zoom_percent) * ratio_array[row_count]))  + 'px'
        }
        row_count+= 1
    }

})

for(image of image_container.children){
    image.onmouseover = function(){
        this.querySelector('p').style.opacity = 1
    }
    image.onmouseout = function(){
        this.querySelector('p').style.opacity = 0
    }
}

document.addEventListener('scroll', function(event){
    for(image of image_container.children){
        if(image.querySelector('img').getBoundingClientRect().y<700){
            image.querySelector('img').style.filter = `grayscale(0)`
        }
        if(image.querySelector('img').getBoundingClientRect().y>500){
            image.querySelector('img').style.filter = `grayscale(1)`
        }
    }
})
