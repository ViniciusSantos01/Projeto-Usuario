module.exports = {

    user: (app, req, res) => {

        //assert é para verificar os campos do body
        //o primeiro parametro é o nome do campo e o segundo a menssagem de erro
        //notEmpty é a validação do erro, no caso se o campo name for vazio aparece a msg de erro
        req.assert('_name', 'O nome é obrigatório').notEmpty();
        req.assert('_email', 'O e-mail é inválido').notEmpty().isEmail();
        req.assert('_password', 'A senha é obrigatório').notEmpty();

        let errors = req.validationErrors();

        if (errors) {

            app.utils.error.send(errors, req, res);
            return false;

        } else {
            return true;
        }

    }

};