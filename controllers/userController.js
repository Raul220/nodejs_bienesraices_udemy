const loginForm = (req, res) => {
    res.render('auth/login', {
        page: 'Iniciar sección'
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