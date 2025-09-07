'use strict'

const STORAGE_KEY = 'user'
const SELECTED_IMAGES_KEY = 'selectedImages'

function loadAllImages() {
    console.log('Starting to load images...')
    const imageForCarousel = loadFromStorage(SELECTED_IMAGES_KEY)
    console.log('Loaded image for carousel from storage:', imageForCarousel)
    if (!imageForCarousel) {
        console.error('No images found in storage.')
        return Promise.resolve([])
    }
    console.log('Image for carousel:', imageForCarousel)
    return new Promise((resolve) => {
        const images = imageForCarousel.map((imgUrl, index) => ({
            index,
            url: imgUrl
        }))
        console.log(`Found ${images.length} images for carousel`)
        resolve(images)
    })
}