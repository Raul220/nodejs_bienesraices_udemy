const loginForm = (req, res) => {
    res.render('auth/login', {
    })
}

const registryForm = (req, res) => {
    res.render('auth/registry', {
        page: 'Crear cuenta'
    })
}

export {
    loginForm,
    registryForm
}