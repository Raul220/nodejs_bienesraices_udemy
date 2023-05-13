const loginForm = (req, res) => {
    res.render('auth/login', {
        page: 'Iniciar sesión'
    })
}

const registryForm = (req, res) => {
    res.render('auth/registry', {
        page: 'Crear cuenta'
    })
}

const registry = (req, res) => {
    console.log(req.body)
}

const forgotPasswordForm = (req, res) => {
    res.render('auth/forgot-password', {
        page: 'Recuperar contraseña'
    })
}

export {
    loginForm,
    registryForm,
    registry,
    forgotPasswordForm
}