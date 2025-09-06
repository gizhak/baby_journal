'use strict'


const USER = []
const ID = []
const LINK = []

const STORAGE_KEY = 'user'

const gCache = []


function loginClicked() {
    console.log('login clicked - service')

    const usernameEl = document.querySelector('.input-field-name').value
    console.log(usernameEl)

    const idEl = document.querySelector('.input-field-id').value
    console.log(idEl)

    const linkEl = document.querySelector('.input-field-link').value

    if (!usernameEl || !idEl || !linkEl) {
        if (window.swal) swal.fire('Missing data', 'Please fill username, ID and link', 'warning')
        else alert('Please fill username, ID and link')

        return
    }

    USER.push(usernameEl)
    ID.push(idEl)
    LINK.push(linkEl)

    console.log(USER)
    console.log(ID)
    console.log(LINK)

    saveToStorage(STORAGE_KEY, { user: USER, id: ID, link: LINK })
    prepareLinks()
    window.location.href = 'selection.html'

}

// remove the https://ln.artisansonics.com/l/ link part and adding another https://ln.artisansonics.com/api/item/

function prepareLinks() {
    const link = loadFromStorage(STORAGE_KEY).link
    const preparedLinks = link.map(l => l.replace('https://ln.artisansonics.com/l/', 'https://ln.artisansonics.com/api/item/'))
    console.log(preparedLinks)
    saveToStorage(STORAGE_KEY, { user: USER, id: ID, link: preparedLinks })

    console.log('Prepared Links:', preparedLinks)

    getImageUrl(preparedLinks[0], ID[0], 0)
}

// need to adding the id on new URl and after adding need to add also /4/jpg/y shold be 
// https://ln.artisansonics.com/api/item/HPhu6NDYXfMdOqMuoSTH/{id}/{number of image}/jpg/y

function getImageUrl(link, id, imgNum) {
    const parts = link.split('/')
    console.log('Image URL Parts:', parts)

    // adding the id, number of image and /jpg/y
    parts.splice(6, 0, id)
    parts.splice(7, 0, imgNum)
    parts.push('jpg/y')

    console.log('Image URL Parts after changes:', parts)
    const finalUrl = parts.join('/')
    console.log('Final Image URL:', finalUrl)

    // שומרים את ה-URL הסופי במקום הקודם
    const currentData = loadFromStorage(STORAGE_KEY)
    currentData.finalImageUrl = finalUrl  // שומרים את ה-URL הסופי
    currentData.imageBaseUrl = link       // שומרים גם את הבסיס אם נצטרך
    saveToStorage(STORAGE_KEY, currentData)

    console.log('URL saved to storage!')

    return finalUrl
}

// write function for checkbox Remember me
function rememberMe() {
    const rememberEl = document.querySelector('.checkbox').checked
    console.log(rememberEl)
    localStorage.setItem('rememberMe', rememberEl)
    console.log('Remember me:', rememberEl)
    if (!rememberEl) {
        localStorage.removeItem(STORAGE_KEY)
    } else {
        const usernameEl = document.querySelector('.input-field-name').value
        const idEl = document.querySelector('.input-field-id').value
        const linkEl = document.querySelector('.input-field-link').value

        localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: usernameEl, id: idEl, link: linkEl }))
    }
    console.log('Remember me:', rememberEl)
    return rememberEl

}
