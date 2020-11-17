const {checkAndChange} = require('./assets/functions')
const mysql = require('promise-mysql')
const bodyParser = require('body-parser')
const express = require('express')
const morgan = require('morgan')('dev')
const config = require('./assets/config')

mysql.createConnection({
    host: config.db.host,
    database: config.db.database,
    user: config.db.user,
    password: config.db.password,
    port: config.db.port
}).then((db) => {

    console.log('Connected.')

    const app = express()

   
    let GonflablesRouter = express.Router()
    let Gonflables = require('./assets/classes/gonflables-class')(db, config)

    let ContactRouter = express.Router()
    let Contact = require('./assets/classes/contact-class')(db, config)

    app.use(morgan)
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    GonflablesRouter.route('/')

        .get(async (req, res) => {
            let allGonflables = await Gonflables.getAllGonf(req.params.max)
            res.header("Access-Control-Allow-Origin", "*")
            res.json(checkAndChange(allGonflables))
            
        })

    GonflablesRouter.route('/byid/:id')

        // Récupère un membre avec son ID
        .get(async (req, res) => {
            let gonflable = await Gonflables.getByID(req.params.id)
            res.header("Access-Control-Allow-Origin", "*")
            res.json(checkAndChange(gonflable))
        })

        /* Modifie un membre avec ID
        .put(async (req, res) => {
            let updateMember = await Members.update(req.params.id, req.body.name)
            res.json(checkAndChange(updateMember))
        })

        // Supprime un membre avec ID
        .delete(async (req, res) => {
            let deleteMember = await Members.delete(req.params.id)
            res.json(checkAndChange(deleteMember))
        })*/

        GonflablesRouter.route('/categorie/:id')

        // Récupère un membre avec son ID
        .get(async (req, res) => {
            let categorie = await Gonflables.getByCategorie(req.params.id)
            res.header("Access-Control-Allow-Origin", "*")
            res.json(checkAndChange(categorie))
        })


        /********************** Fonctions Temporaires ***********************/

        GonflablesRouter.route('/enstockTri:tri')

        .get(async (req, res) => {
            let gonfEnStock = await Gonflables.getAllEnStock(req.params.tri)
            res.header("Access-Control-Allow-Origin", "*")
            res.json(checkAndChange(gonfEnStock))
            
        })

        GonflablesRouter.route('/enstock/:id')

        // Récupère un membre avec son ID
        .get(async (req, res) => {
            let enstock = await Gonflables.getEnStockByID(req.params.id)
            res.header("Access-Control-Allow-Origin", "*")
            res.json(checkAndChange(enstock))
        })

        ContactRouter.route('/')
        // Ajoute un membre avec son nom
        .post(async (req, res) => {
            console.log("Test APP infos : "+ req.body.name)
            req.header("Access-Control-Allow-Origin", "*")
            let addForm = await Contact.add(req.body)
            res.header("Access-Control-Allow-Origin", "*")
            res.json(checkAndChange(addForm))
        })

   

    app.use(config.rootAPI+'gonflables', GonflablesRouter)
    app.use(config.rootAPI+'contact', ContactRouter)

    app.listen(config.port, () => console.log('Started on port '+config.port))

}).catch((err) => {
    console.log('Error during database connection')
    console.log(err.message)
    console.log(config.db.database)
})