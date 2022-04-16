const main = document.getElementsByClassName('main')[0]
const add = document.getElementsByClassName('add')[0]
const save = document.getElementsByClassName('save')[0]
let note = [...document.getElementsByClassName('note')]
let textarea = [...document.getElementsByClassName('textarea')]

let id = 0
let colors = ['#74b9ff', '#00cec9', '#6c5ce7', '#ff7675', '#F8EFBA']  // Colors or notes

// ******************************
//     Retrieving the notes from localstorage
// ******************************

const local = getLocal()
if (local) {
    if (local.length >= 1) {
        local.forEach(ele => {
            createNote(ele)
        });
    } else {
        createNote()
    }
}
else {
    createNote()
}

// ******************************
//     for Setting the id of notes
// ******************************

function setId(params) {
    const local = getLocal()
    if (local) {
        local.length == 0 ? id = 0 : id = local[local.length - 1].id
    }
    else {
        id = 0
    }
}
setId()

// ******************************
//     Cratgin notes on button click
// ******************************
add.addEventListener('click', (e) => {
    createNote()
})

// ******************************
//     Function for create notes 
// ******************************

function createNote(value = '') {
    let div = document.createElement('div')
    div.setAttribute('class', 'note')
    id++
    div.setAttribute('id', id)
    div.innerHTML = `<div class="items" >
                    <img class='save' src="./images/save.svg" alt="">
                    <img class='delete' src="./images/trash.svg" alt="">
                     </div>
                     <textarea class="textarea" name='textarea' spellcheck='false'  value=${value.note}  >${value == '' ? 'Start your note' : value.note}</textarea>`

    const style = {
        backgroundColor: colors[Math.floor(Math.random() * colors.length)]
    }

    div.style.backgroundColor = value.colors

    main.prepend(div)
    note = [...document.getElementsByClassName('note')]

    if (value == '') {
        div.style.backgroundColor = style.backgroundColor
        saveToStorage(div, style.backgroundColor)
    }
    textarea = [...document.getElementsByClassName('textarea')]
    autosave()
}

// ******************************
//     Getting value of textarea
// ******************************

function saveNote() {
    document.addEventListener('click', (e) => {
        const target = e.target.parentNode.parentNode
        if (e.target.classList.contains('save')) {
            const value = target.getElementsByClassName('textarea')[0].value
            updtingNoteToStorage(value, target.id)
        }
    })
}
saveNote()

// ******************************
//     For updating and saving note to localstorage
// ******************************

function updtingNoteToStorage(value, id) {
    const local = getLocal()
    const index = local.findIndex(x => x.id == id)
    local[index].note = value
    saveLocal(local)
}

// ******************************
//     Function for deleting notes from display 
// ******************************

function deleteNote() {
    document.addEventListener('click', (e) => {
        const target = e.target.parentNode.parentNode
        if (e.target.classList.contains('delete')) {
            target.style.display = 'none'
            deleteFromLocal(target.id)
            setId()
        }
    })
}
deleteNote()

// ******************************
//     Function for deleting notes from  local storage 
// ******************************

function deleteFromLocal(id) {
    const local = getLocal()
    const newLocal = local.filter((e) => {
        return e.id != id
    });
    saveLocal(newLocal)
}

// ******************************
//     First time saving note to local storage
// ******************************

function saveToStorage(div, color) {
    const local = getLocal()
    if (!local) {
        localStorage.setItem("notes", JSON.stringify([{ id: div.id, note: 'Start your note', colors: color }]))
    } else {
        local.push({ id: div.id, note: 'Start your note', colors: color })
        saveLocal(local)

    }
}

// ******************************
//     Get local storage
// ******************************

function getLocal() {
    return JSON.parse(localStorage.getItem('notes'))
}

// ******************************
//     Save to local storage
// ******************************
function saveLocal(data) {
    localStorage.setItem("notes", JSON.stringify(data))

}

// ******************************
//     Auto save to localstorage
// ******************************

function autosave(params) {

    textarea.forEach(ele => {
        ele.addEventListener('keyup', (e) => {
            const id = e.target.parentNode.id
            const value = ele.value
            updtingNoteToStorage(value, id)
        })
    });
}