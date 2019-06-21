module.exports = {

    send: (err, req, res, code = 400) =>{

        //erro de solicitação de envio do usuario (400)
        console.log(`Error: ${err}`);
        res.status(code).json({
            error: err
        });

    }

};