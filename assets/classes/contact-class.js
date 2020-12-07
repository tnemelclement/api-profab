let db, config

// Le require() envoie une fonction envoyant la class Members
// Permettant de définir des constantes dans le module venant du fichier principal
module.exports = (_db, _config) => {
    db = _db
    config = _config
    return Contact
}

let Contact = class {
    // Ajoute une nouvelle entrée dans le formulaire
    static newMessage(nom, prenom, societe, mail, tel, message) {
        return new Promise((next) => {
            db.query('INSERT INTO contact (nom, prenom, societe, mail, tel, message) VALUES (?,?,?,?,?,?)', [nom, prenom, societe, mail, parseInt(tel), message])
                    .then((result) => next(result))
                    .catch((err) => next(err))
        })

    }


     // Récupère toutes les entrées du formulaires
     static getContact() {
        return new Promise((next) => {
                db.query('SELECT * FROM contact')
                    .then((result) => next(result))
                    .catch((err) => next(err))
        })
    }

}