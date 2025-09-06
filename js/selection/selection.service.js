'use strict'


const LOAD_USER = loadFromStorage('user') || { user: [], id: [], finalImageUrl: [], link: [] }
const USER = LOAD_USER.user
const ID = LOAD_USER.id
const FINAL_IMAGE_URL = LOAD_USER.finalImageUrl
const LINK = LOAD_USER.link
const STORAGE_KEY = 'user'

const gCache = []

const IMAGES_CACHE_KEY = 'cachedImages'
const CACHE_EXPIRY_KEY = 'cacheExpiry'
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 שעות במילישניות

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

function isCacheValid() {
    // בודק אם הקאש תקף
    const expiry = localStorage.getItem(CACHE_EXPIRY_KEY)
    if (!expiry) return false

    const now = new Date().getTime()
    const expiryTime = parseInt(expiry)

    // בודק אם הקאש עדיין תקף
    const isValid = now < expiryTime
    console.log('Cache valid:', isValid)

    return isValid
}

function getCachedImages() {
    // מביא תמונות מהקאש
    const cached = localStorage.getItem(IMAGES_CACHE_KEY)
    if (!cached) return null

    try {
        const images = JSON.parse(cached)
        console.log(`Loaded ${images.length} images from cache`)
        return images
    } catch (e) {
        console.error('Error loading cached images:', e)
        return null
    }
}

function saveImagesToCache(images) {
    // שומר תמונות בקאש
    try {
        localStorage.setItem(IMAGES_CACHE_KEY, JSON.stringify(images))

        // מגדיר זמן תפוגה
        const expiry = new Date().getTime() + CACHE_DURATION
        localStorage.setItem(CACHE_EXPIRY_KEY, expiry.toString())

        console.log(`Saved ${images.length} images to cache`)
    } catch (e) {
        console.error('Error saving to cache:', e)
    }
}

function clearImagesCache() {
    // מנקה את הקאש (אם צריך)
    localStorage.removeItem(IMAGES_CACHE_KEY)
    localStorage.removeItem(CACHE_EXPIRY_KEY)
    console.log('Images cache cleared')
}

// פונקציה שקוראים לה מה-controller
function onGetRepoImages() {
    // קודם בודק אם יש קאש תקף
    if (isCacheValid()) {
        const cachedImages = getCachedImages()
        if (cachedImages && cachedImages.length > 0) {
            console.log('Using cached images')
            return Promise.resolve(cachedImages)
        }
    }

    // אם אין קאש או שהוא לא תקף - טוען מהשרת
    console.log('Loading images from server...')
    return loadAllImages().then(images => {
        // שומר בקאש לפעם הבאה
        if (images.length > 0) {
            saveImagesToCache(images)
        }
        return images
    })
}

// פונקציה לרענון כפוי (אם רוצים כפתור רענון)
function forceRefreshImages() {
    clearImagesCache()
    return loadAllImages().then(images => {
        if (images.length > 0) {
            saveImagesToCache(images)
        }
        return images
    })
}