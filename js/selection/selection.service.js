'use strict'


const LOAD_USER = loadFromStorage('user') || { user: [], id: [], finalImageUrl: [], link: [] }
const USER = LOAD_USER.user
const ID = LOAD_USER.id
const FINAL_IMAGE_URL = LOAD_USER.finalImageUrl
const LINK = LOAD_USER.link
const STORAGE_KEY = 'user'

const gCache = []

console.log('Loaded User:', LOAD_USER)

function buildImageUrl(imageNumber) {
    // בונה URL לתמונה מסוימת
    const userData = loadFromStorage('user')
    if (!userData || !userData.link || !userData.id) {
        console.error('Missing user data')
        return null
    }

    // מחלץ את ה-session ID מהלינק
    const link = userData.link[0]
    const sessionId = link.split('/').pop()
    const userId = userData.id[0]

    // בונה את ה-URL המלא
    const imageUrl = `https://ln.artisansonics.com/api/item/${sessionId}/${userId}/${imageNumber}/jpg/y`
    console.log(`Image ${imageNumber} URL:`, imageUrl)

    return imageUrl
}

function loadAllImages() {
    console.log('Starting to load images...')
    const images = []
    let currentImage = 0
    const maxImages = 30 // מקסימום תמונות לבדוק

    return new Promise((resolve) => {
        let failedCount = 0

        function checkImage(imageNum) {
            if (imageNum >= maxImages || failedCount >= 3) {
                // אם הגענו למקסימום או נכשלנו 3 פעמים רצוף
                console.log(`Found ${images.length} images total`)
                resolve(images)
                return
            }

            const imageUrl = buildImageUrl(imageNum)
            if (!imageUrl) {
                resolve(images)
                return
            }

            // יוצרים אלמנט תמונה זמני לבדיקה
            const img = new Image()

            img.onload = function () {
                console.log(`✓ Image ${imageNum} loaded successfully`)
                images.push({
                    url: imageUrl,
                    index: imageNum
                })
                failedCount = 0 // מאפסים את מונה הכישלונות
                checkImage(imageNum + 1) // בודקים את התמונה הבאה
            }

            img.onerror = function () {
                console.log(`✗ Image ${imageNum} failed to load`)
                failedCount++
                checkImage(imageNum + 1) // ממשיכים לבדוק
            }

            // מתחילים לטעון את התמונה
            img.src = imageUrl
        }

        // מתחילים מתמונה 0
        checkImage(0)
    })
}

// פונקציה שקוראים לה מה-controller
function onGetRepoImages() {
    return loadAllImages()
}