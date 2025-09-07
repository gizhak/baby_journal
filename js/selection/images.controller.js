'use strict'


function onInit() {
    console.log('Images page initialized')
    onGetImages()
}

function onGetImages() {
    loadAllImages().then(images => {
        console.log('Loaded images:', images)
        renderImagesToConsole(images)
    }).catch(error => {
        console.error('Error loading images:', error)
    })
}

// --- החלפה פשוטה של הפונקציה כדי להבטיח שה-src יקבל מחרוזת URL ---
function _isString(v) {
    return Object.prototype.toString.call(v) === '[object String]'
}

function getUrlFromData(imageData) {
    if (!imageData) return ''

    // אם מה שנשלח הוא כבר מחרוזת (הפשטה קלה)
    if (_isString(imageData)) return imageData

    // שדות נפוצים בפרויקט
    if (imageData.url) {
        if (_isString(imageData.url)) return imageData.url
        if (imageData.url.url && _isString(imageData.url.url)) return imageData.url.url
        if (Array.isArray(imageData.url) && imageData.url[0]) return imageData.url[0]
    }

    if (imageData.finalImageUrl) {
        if (_isString(imageData.finalImageUrl)) return imageData.finalImageUrl
        if (Array.isArray(imageData.finalImageUrl) && imageData.finalImageUrl[0]) return imageData.finalImageUrl[0]
    }

    // אולי נשמר כ-array פשוט
    if (Array.isArray(imageData) && imageData[0]) return imageData[0]

    // במקרה שלא נמצא URL תקין
    return ''
}

function renderImagesToConsole(images) {
    console.log('Rendering images:', images)
    const elBox = document.querySelector('.box')
    console.log('elBox:', elBox)
    if (!elBox) {
        console.error('Box container not found')
        return
    }

    const strHTMLs = images.map(imageData => {
        const url = getUrlFromData(imageData)
        const idx = (imageData && imageData.index != null) ? imageData.index : ''
        if (!url) {
            console.warn('Missing URL for imageData:', imageData)
            return `<span class="no-image" data-index="${idx}">No image</span>`
        }
        return `<span style="--i:${idx}" data-index="${idx}">
                    <img src="${url}" alt="Image ${idx}" loading="lazy">
                </span>`
    })

    console.log('strHTMLs:', strHTMLs)
    elBox.innerHTML = strHTMLs.join('')
    console.log('elBox innerHTML:', elBox.innerHTML)
}