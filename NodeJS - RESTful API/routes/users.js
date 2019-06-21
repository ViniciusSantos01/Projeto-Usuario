//para criar um banco de dados
let NeDB = require('nedb');
let db = new NeDB({
    filename: 'users.db',
    autoload: true
});

module.exports = (app)=>{

    let route = app.route('/users');

    route.get((req, res) => {

        //para pegar informações do banco de dados.
        //sort é para listar os dados e 1 para indicar de forma crescente
        //exec para executar segundo os parametros
        db.find({}).sort({name:1}).exec((err, users)=>{

            if (err){
                app.utils.error.send(err, req, res);
            } else {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json({
                    users //assim ele entender que é users: users
                });
            }
        
        });

    });

    route.post((req, res) => {

        if (!app.utils.validator.user(app, req, res)) return false;

        //no insert, primeiro é o objeto json que eu quero salvar e depois uma função
        db.insert(req.body, (err, user)=>{

            if (err) {

                app.utils.error.send(err, req, res);

            } else {

                res.status(200).json(user);

            }

        });

    });

    let routeID = app.route('/users/:id');

    routeID.get((req, res) => {

        //findeOne localiza apenas um refistro
        db.findOne({_id: req.params.id}).exec((err, user) => {

            if (err) {

                app.utils.error.send(err, req, res);

            } else {

                res.status(200).json(user);

            }

        });

    });

    //put é o metodo para alteração
    routeID.put((req, res) => {

        if (!app.utils.validator.user(app, req, res)) return false;

        //update atualiza os dados do usuario
        //e possui 3 parametros
        db.update({_id: req.params.id}, req.body, err => {

            if (err) {

                app.utils.error.send(err, req, res);

            } else {

                res.status(200).json(Object.assign(req.params, req.body));

            }

        });

    });

    //para deletar um usuario
    routeID.delete((req, res) => {

        db.remove({_id: req.params.id}, {}, err => {

            if (err) {

                app.utils.error.send(err, req, res);

            } else {

                res.status(200).json(req.params);

            }

        });

    });

};