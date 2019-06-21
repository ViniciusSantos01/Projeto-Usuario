class UserController {
    
    constructor(formIdCreate, formIdUpdate, tableId){

        this.formEl = document.getElementById(formIdCreate);
        this.formUpdateEl = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableId);

        this.onSubmit();
        this.onEdit();
        this.selectAll();
        this.preview();
        
    }
    
    //metodo para cancelar a edição do formulário
    onEdit(){

        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e=>{

            this.showPanelCreate();

        });

        this.formUpdateEl.addEventListener("submit", event =>{

            event.preventDefault();

            let btn = this.formUpdateEl.querySelector("[type=submit]");

            btn.disabled = true;

            let values = this.getValues(this.formUpdateEl);

            let index = this.formUpdateEl.dataset.trIndex;

            //para pegar a linha da tr a partir do index
            let tr = this.tableEl.rows[index];

            let userOld = JSON.parse(tr.dataset.user);

            //Object.assign copia os valores dos atributos de um objeto e cria um objeto destino, retornando este objeto.
            //Os objetos da direita sobrescrevem os da esquerda.
            let result = Object.assign({}, userOld, values);

            this.getPhoto(this.formUpdateEl).then(
                (content) => {

                    if (!values.photo) {
                        result._photo = userOld._photo;
                    } else {
                        result._photo = content;
                    }

                    //para passar os dados sem o _
                    let user = new User();

                    user.loadFromJSON(result);

                    user.save().then(user => {

                        this.getTr(user, tr);

                        this.updateCount();
    
                        this.formUpdateEl.reset();
    
                        btn.disabled = false;
    
                        this.showPanelCreate();

                    });

                }, 
                (e) => {
                    
                    console.error(e);

                }

            );

        });

    }

    //para enviar os dados do formulario para o sistema quando apertar enviar
    onSubmit(){

        this.formEl.addEventListener("submit", event =>{

            //para cancelar o evento padrão do evento(no caso submit)
            event.preventDefault();

            let btn = this.formEl.querySelector("[type=submit]");

            btn.disabled = true;

            let values = this.getValues(this.formEl);

            if (!values) return false;

            this.getPhoto(this.formEl).then(
                (content) => {

                    values.photo = content;
                    
                    values.save().then(user => {

                        this.addLine(user);

                        this.formEl.reset();

                        this.formEl.querySelector(".profile-image").src = "dist/img/boxed-bg.jpg"

                        btn.disabled = false;

                    });

                }, 
                (e) => {
                    console.error(e);
                }

            );

        });
    }

    //para fazer o upload da foto
    getPhoto(formEl){

        return new Promise((resolve, reject) => {

            let fileReader = new FileReader();

            let elements = [...formEl.elements].filter(item => {

                if (item.name === "photo"){
                    return item 
                }

            });

            let file = elements[0].files[0];

            fileReader.onload = () => {

                resolve(fileReader.result);

            };

            fileReader.onerror = (e) => {

                reject(e);

            }

            if (file){
                fileReader.readAsDataURL(file);         
            } else {
                resolve("dist/img/boxed-bg.jpg");
            }

        });

    }

    preview() {
 
        let elements = [
            {
                id: "exampleInputFile",
                form: this.formEl
            },
            {
                id: "exampleEditFile-update",
                form: this.formUpdateEl
            }
        ];
        
        elements.forEach(
            (element) => {
                this.addPreviewEvent(element.id, element.form);
            }
        )        
 
    }
 
        addPreviewEvent(id, form) {
            document.getElementById(id).addEventListener("change", (event) => {
    
                    this.getPhoto(form).then(
                        (content) => {
                            form.querySelector(".profile-image").src = content;
                        },
                        (e) => {
                            console.error(e);
                        });
    
            });
        }

    //para validar e receber os dados do novo usuario para serem enviados
    getValues(formEl){
        
        let user = {};
        let isValid = true;
        
        //[] para dizer que é um array (para poder funcionar o forEach) 
        //... é o operador Spread que facilita para não precisar dizer quantos itens tem no array
        [...formEl.elements].forEach(function(field, index) {

            if (['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value) {

                field.parentElement.classList.add('has-error');
                isValid = false

            }
            
            if (field.name == "gender") {
        
                if (field.checked) {
                    user[field.name] = field.value;
                }
        
            } else if(field.name == "admin") {

                user[field.name] = field.checked;

            } else {
        
                user[field.name] = field.value;
        
            }
            
        });

        if (!isValid){
            return false;
        }
    
        return new User(user.name, user.gender, user.birth, user.country, user.email, user.password, user.photo, user.admin);

    }

    //para listar todos os dados do BD
    selectAll(){

        User.getUsersStorage().then(data => {

            data.users.forEach(dataUser => {

                let user = new User();
    
                user.loadFromJSON(dataUser);
    
                this.addLine(user);
    
            });

        });

    }

    //adicionar uma nova linha tr na tabela de usuarios
    addLine(dataUser) {

        let tr = this.getTr(dataUser);        
        
        this.tableEl.appendChild(tr); 

        this.updateCount();
           
    };

    //Comando = é usado para valor padrão, tornando-o opcional
    //getTr seleciona a tr que será gerada
    getTr(dataUser, tr = null){

        if (tr === null) tr = document.createElement('tr');

        //JSON.stringfy é para transformar os dados em string sem perder os dados
        //dataset permite leitura e escrita em elementos com data-
        tr.dataset.user = JSON.stringify(dataUser);

        tr.innerHTML = `
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin) ? "Sim" : "Não"}</td>
            <td>${Utils.dateFormat(dataUser.register)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
            </td>`; 

        this.addEventTr(tr);

        return tr;
    }

    addEventTr(tr){
        tr.querySelector(".btn-delete").addEventListener("click", e=>{
           
            if (confirm("Deseja realmente excluir?")) {

                let user = new User;

                user.loadFromJSON(JSON.parse(tr.dataset.user));

                user.remove().then(data => {
                    
                    //remove() exclui o array
                    tr.remove();

                    this.updateCount();

                });

                //remove() exclui o array
                tr.remove();

                this.updateCount();

            }

        });
        
        tr.querySelector(".btn-edit").addEventListener("click", e=>{

            let json = JSON.parse(tr.dataset.user);

            //rowIndex conta a posição do elemento baseado no total, e começa do 1 e nao do 0
            //sectionRowIndex começa do 0
            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;

            //para alterar cada um dos campos com os dados do usuario que já estavam salvos
            //for in percorre linha por linha
            for (let name in json){

                //para buscar o campo que tem o mesmo nome que esta no json
                let field = this.formUpdateEl.querySelector("[name="+ name.replace("_", "") +"]");

                if (field){

                    //para preencher os dados no formulario "user-update" com os dados que já estavam salvos
                    switch (field.type) {
                        case 'file':
                            continue;
                            break;
                        case 'radio':
                            field = formEl.querySelector("[name="+ name.replace("_", "") +"][value=" + json[name] + "]");
                            field.checked = true;
                            break;

                        case "checkbox":
                            field.checked = json[name];
                            break;

                        default:
                            field.value = json[name];
                            
                    }
                    
                }

            }

            this.formUpdateEl.querySelector(".profile-image").src = json._photo;

            this.showPanelUpdate();
            

        });
    }

    showPanelCreate(){

        document.querySelector("#box-user-create").style.display = "block"
        document.querySelector("#box-user-update").style.display = "none"

    }

    showPanelUpdate(){

        document.querySelector("#box-user-create").style.display = "none"
        document.querySelector("#box-user-update").style.display = "block"

    }


    //metodo para contar os usuarios / atualizar as estatísticas
    updateCount(){

        let numberUsers = 0;

        let numberAdmin = 0;

        [...this.tableEl.children].forEach(tr=>{

            //++ é para somar mais um cada vez que fizer o forEach
            numberUsers++;

            //parse é para interpretar os dados da string como um objeto
            let user = JSON.parse(tr.dataset.user);

            if (user._admin) numberAdmin++;

        });

        document.querySelector("#number-users").innerHTML = numberUsers;
        document.querySelector("#number-users-admin").innerHTML = numberAdmin;
    }

}