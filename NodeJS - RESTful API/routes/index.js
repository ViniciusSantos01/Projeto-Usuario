module.exports = (app)=>{

    //para cada chamada do usuario uma resposta
    app.get('/', (req, res) => {

        res.statusCode = 200;
        res.setHeader('Content-type', 'text/html');
        res.end('<h1>Olá</h1>');
    });

};