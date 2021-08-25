const list_item = document.querySelectorAll('.list--item')

for(list of list_item){
    list.onclick = function(){
        for(item of list_item){
            item.classList.remove('list__secondary')
        }
        this.classList.add('list__secondary')
    }
}

