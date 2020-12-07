let db, config

// Le require() envoie une fonction envoyant la class Members
// Permettant de définir des constantes dans le module venant du fichier principal
module.exports = (_db, _config) => {
    db = _db
    config = _config
    return Contact
}

let Contact = class {

   // Ajoute un membre avec son nom comme paramètre
    static add(name) {
        return new Promise((next) => {
            if (name != undefined && name.trim() != '') {
                name = name.trim()
                db.query('SELECT * FROM members WHERE name = ?', [name])
                    .then((result) => {
                        if (result[0] != undefined) {
                            next(new Error(config.errors.nameAlreadyTaken))
                        } else {
                            return db.query('INSERT INTO members(name) VALUES(?)', [name])
                        }
                    })
                    .then(() => {
                        return db.query('SELECT * FROM members WHERE name = ?', [name])
                    })
                    .then((result) => {
                        next({
                            id: result[0].id,
                            name: result[0].name
                        })
                    })
                    .catch((err) => next(err))
            } else {
                next(new Error(config.errors.noNameValue))
            }
        })

        

        
    }


     // Ajoute un membre avec son nom comme paramètre
   static newMessage2(infos) {

    console.log("Test infos : "+ infos.name)
    return new Promise((next) => {
        db.query('INSERT INTO contact (nom, prenom, societe, mail, tel, message) VALUES(?,?,?,?,?,?)', [infos.name, infos.firstname, infos.society, infos.email, infos.phone, infos.message])
            .then(() => {
                return db.query('SELECT * FROM contact WHERE phone = ?', [infos.phone])
            })
            .then((result) => {
                    next({
                        message : "All good !" + result + "."
                })
            })
            .catch((err) => next(err))
        })
    }

    static newMessage(nom, prenom, societe, mail, tel, message) {

        return new Promise((next) => {
            db.query('INSERT INTO contact (nom, prenom, societe, mail, tel, message) VALUES ("?","?","?","?","?","?"', [nom, prenom, societe, mail, parseInt(tel), message])
                    .then((result) => next(result))
                    .catch((err) => next(err))
        })

    }

}