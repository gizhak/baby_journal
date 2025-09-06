'use strict'

function onInit() {
    console.log('Selection page initialized')
    // טוען את התמונות אוטומטית בטעינת העמוד
    onGetImages()
}

function renderImages(images) {
    console.log('Rendering images:', images)

    const container = document.querySelector('.images')
    if (!container) {
        console.error('Images container not found')
        return
    }

    // מנקה את התמונות הדמו
    container.innerHTML = ''

    // יוצר כרטיס לכל תמונה
    images.forEach(imageData => {
        const card = document.createElement('a')
        card.href = '#'
        card.className = 'category-card'
        card.onclick = (e) => {
            e.preventDefault()
            selectImage(imageData.index)
        }

        const img = document.createElement('img')
        img.src = imageData.url
        img.alt = `Image ${imageData.index}`
        img.loading = 'lazy' // טעינה עצלה לביצועים טובים יותר

        card.appendChild(img)
        container.appendChild(card)
    })

    console.log(`Rendered ${images.length} images`)
}

function selectImage(index) {
    console.log('Selected image:', index)
    // כאן תוסיף לוגיקה לבחירת תמונה
    // לשמירה במערך של תמונות נבחרות
}

function onGetImages() {
    console.log('Getting images...')

    // מציג הודעת טעינה
    const container = document.querySelector('.images')
    if (container) {
        container.innerHTML = '<div style="text-align: center; padding: 20px;">טוען תמונות...</div>'
    }

    onGetRepoImages()
        .then(images => {
            console.log('Images loaded:', images)
            renderImages(images)
        })
        .catch(err => {
            console.error('Error fetching images:', err)
            if (container) {
                container.innerHTML = '<div style="text-align: center; padding: 20px; color: red;">שגיאה בטעינת התמונות</div>'
            }
        })
}

function onRefreshImages() {
    console.log('Force refreshing images...')

    const container = document.querySelector('.images')
    if (container) {
        container.innerHTML = '<div style="text-align: center; padding: 20px;">מרענן תמונות...</div>'
    }

    forceRefreshImages()
        .then(images => {
            console.log('Images refreshed:', images)
            renderImages(images)

            // הודעה שהרענון הצליח
            if (window.Swal) {
                Swal.fire({
                    icon: 'success',
                    title: 'התמונות עודכנו!',
                    timer: 1500,
                    showConfirmButton: false
                })
            }
        })
        .catch(err => {
            console.error('Error refreshing images:', err)
            if (container) {
                container.innerHTML = '<div style="text-align: center; padding: 20px; color: red;">שגיאה ברענון התמונות</div>'
            }
        })
}