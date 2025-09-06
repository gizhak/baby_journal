'use strict'

function onInit() {
    console.log('login controller')

    // במקום 'rememberedUser', נשתמש ב-'user' כמו ששומרים
    const rememberedUser = loadFromStorage('user')  // <-- שינוי כאן

    if (rememberedUser) {
        // הנתונים נשמרים כמערכים, אז ניקח את הראשון
        document.querySelector('.input-field-name').value = rememberedUser.user[0] || ''
        document.querySelector('.input-field-id').value = rememberedUser.id[0] || ''
        document.querySelector('.input-field-link').value = rememberedUser.link[0] || ''
        document.querySelector('.checkbox').checked = true
    }
}

function onLoginClicked() {
    console.log('login clicked')
    rememberMe()
    loginClicked()
}





