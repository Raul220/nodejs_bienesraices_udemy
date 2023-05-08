const loginForm = (req, res) => {
    res.render('auth/login', {
    })
}

const registryForm = (req, res) => {
    res.render('auth/registry', {
    })
}

export {
    loginForm,
    registryForm
}