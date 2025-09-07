'use strict'

let currentModalIndex = 0
let allImages = []

function onInit() {
    console.log('Selection page initialized')
    initSelectedImages() // מאתחל את התמונות הנבחרות
    onGetImages()
}

function renderImages(images) {
    console.log('Rendering images:', images)

    const container = document.querySelector('.images')
    if (!container) {
        console.error('Images container not found')
        return
    }

    container.innerHTML = ''
    allImages = images

    // יוצר כרטיס לכל תמונה
    images.forEach(imageData => {
        const card = document.createElement('div')
        card.className = 'image-card'
        card.dataset.index = imageData.index

        // בודק אם התמונה נבחרה
        if (isImageSelected(imageData.index)) {
            card.classList.add('selected')
        }

        card.onclick = () => selectImage(imageData)
        card.ondblclick = () => openModal(imageData.index)

        const img = document.createElement('img')
        img.src = imageData.url
        img.alt = `Image ${imageData.index}`
        img.loading = 'lazy'

        // מוסיף את הלב
        const heart = document.createElement('div')
        heart.className = 'heart-indicator'
        heart.innerHTML = '❤️'

        card.appendChild(img)
        card.appendChild(heart)
        container.appendChild(card)
    })

    updateSelectionCounter()
    console.log(`Rendered ${images.length} images`)
}

function selectImage(imageData) {
    console.log('Selecting image:', imageData.index)

    const result = toggleImageSelection(imageData)
    const card = document.querySelector(`[data-index="${imageData.index}"]`)

    if (result === true) {
        // התמונה נבחרה
        card.classList.add('selected')
    } else if (result === false) {
        // הבחירה בוטלה
        card.classList.remove('selected')
    }
    // אם result === null, לא עושים כלום (הגענו למקסימום)

    updateSelectionCounter()
}

function updateSelectionCounter() {
    const count = getSelectedCount()
    let counter = document.querySelector('.selection-counter')

    if (!counter) {
        // יוצרים את הקאונטר אם לא קיים
        const mainSelection = document.querySelector('.main-selection')
        counter = document.createElement('div')
        counter.className = 'selection-counter'
        mainSelection.appendChild(counter)
    }

    counter.innerHTML = `
        <span class="counter-text">נבחרו: ${count}/${MAX_IMAGES}</span>
        ${count > 0 ? `
            <button class="carousel-btn" onclick="onGoToCarousel()">
                צפה בקרוסלה (${count})
            </button>
            <button class="clear-btn" onclick="onClearSelection()">
                נקה בחירה
            </button>
        ` : ''}
    `
}

function onGoToCarousel() {
    const count = getSelectedCount()

    if (window.Swal) {
        Swal.fire({
            title: 'מעבר לקרוסלה?',
            text: `נבחרו ${count} תמונות`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'כן, עבור לקרוסלה',
            cancelButtonText: 'המשך לבחור'
        }).then((result) => {
            if (result.isConfirmed) {
                goToCarousel()
            }
        })
    } else {
        if (confirm(`להציג ${count} תמונות בקרוסלה?`)) {
            goToCarousel()
        }
    }
}

function onClearSelection() {
    if (window.Swal) {
        Swal.fire({
            title: 'לנקות את הבחירה?',
            text: 'כל התמונות שנבחרו יבוטלו',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'כן, נקה',
            cancelButtonText: 'ביטול'
        }).then((result) => {
            if (result.isConfirmed) {
                clearSelection()
                document.querySelectorAll('.image-card.selected').forEach(card => {
                    card.classList.remove('selected')
                })
                updateSelectionCounter()
            }
        })
    } else {
        if (confirm('לנקות את כל הבחירה?')) {
            clearSelection()
            document.querySelectorAll('.image-card.selected').forEach(card => {
                card.classList.remove('selected')
            })
            updateSelectionCounter()
        }
    }
}

function onGetImages() {
    console.log('Getting images...')

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

// פונקציה לפתיחת המודל
function openModal(index) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalHeart = document.querySelector('.modal-heart');

    currentModalIndex = index;
    modal.style.display = "block";
    modalImg.src = allImages[index].url;

    // בדיקה אם התמונה נבחרה
    if (isImageSelected(index)) {
        modalHeart.classList.add('active');
    } else {
        modalHeart.classList.remove('active');
    }
}

// סגירת המודל
document.querySelector('.modal-close').onclick = function () {
    document.getElementById('imageModal').style.display = "none";
}

// ניווט בין תמונות
document.querySelector('.modal-prev').onclick = function () {
    currentModalIndex = (currentModalIndex - 1 + allImages.length) % allImages.length;
    openModal(currentModalIndex);
}

document.querySelector('.modal-next').onclick = function () {
    currentModalIndex = (currentModalIndex + 1) % allImages.length;
    openModal(currentModalIndex);
}

// לחיצה על הלב במודל
document.querySelector('.modal-heart').onclick = function () {
    selectImage(allImages[currentModalIndex]);
    openModal(currentModalIndex); // רענון התצוגה
}

// ניווט עם מקלדת
document.onkeydown = function (e) {
    const modal = document.getElementById('imageModal');
    if (modal.style.display === "block") {
        if (e.key === "ArrowLeft") {
            document.querySelector('.modal-prev').click();
        } else if (e.key === "ArrowRight") {
            document.querySelector('.modal-next').click();
        } else if (e.key === "Escape") {
            modal.style.display = "none";
        }
    }
}