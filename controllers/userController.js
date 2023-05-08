const loginForm = (req, res) => {
    res.render('auth/login', {
        authenticated: true
    })
}

export {
    loginForm
}