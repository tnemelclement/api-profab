let db, config

// Le require() envoie une fonction envoyant la class Members
// Permettant de définir des constantes dans le module venant du fichier principal
module.exports = (_db, _config) => {
    db = _db
    config = _config
    return Gonflables
}

let Gonflables = class {

    // Envoie un membre via son ID
    static getByID(id) {
        return new Promise((next) => {
            db.query('SELECT * FROM jeuxEnStock WHERE id = ?', [id])
                .then((result) => {
                    if (result[0] != undefined)
                        next(result[0])
                    else
                        next(new Error(config.errors.wrongID))
                })
                .catch((err) => next(err))
        })
    }

     // Envoie les gonflables d'une categorie
     static getByCategorie(id) {
        return new Promise((next) => {
            db.query('SELECT _ref, img1, prix, ref FROM gonflables WHERE categorie = ?', [id])
                .then((result) => {
                    if (result[0] != undefined)
                        next(result)
                    else
                        next(new Error(config.errors.wrongID))
                })
                .catch((err) => next(err))
        })
    }

    // Envoie tous les gonflables (avec un maximum optionnel)
    static getAllGonf(max) {
        return new Promise((next) => {
            if (max != undefined && max > 0) {
                db.query('SELECT * FROM jeuxEnStock LIMIT 0, ?', [parseInt(max)])
                    .then((result) => next(result))
                    .catch((err) => next(err))
            } else if (max != undefined) {
                next(new Error('Wrong max value'))
            } else {
                db.query('SELECT * FROM jeuxEnStock')
                    .then((result) => next(result))
                    .catch((err) => next(err))
            }
        })
    }

    

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

    // Modifie le nom d'un membre via son ID
    static update(id, name) {
        return new Promise((next) => {
            if (name != undefined && name.trim() != '') {
                name = name.trim()
                db.query('SELECT * FROM members WHERE id = ?', [id])
                    .then((result) => {
                        if (result[0] != undefined) {
                            return db.query('SELECT * FROM members WHERE name = ? AND id != ?', [name, id])
                        } else {
                            next(new Error(config.errors.wrongID))
                        }
                    })
                    .then((result) => {
                        if (result[0] != undefined) {
                            next(new Error(config.errors.sameName))
                        } else {
                            return db.query('UPDATE members SET name = ? WHERE id = ?', [name, id])
                        }
                    })
                    .then(() => next(true))
                    .catch((err) => next(err))
            } else {
                next(new Error(config.errors.noNameValue))
            }
        })
    }

    // Supprime un membre via son ID
    static delete(id) {
        return new Promise((next) => {
            db.query('SELECT * FROM members WHERE id = ?', [id])
                .then((result) => {
                    if (result[0] != undefined) {
                        return db.query('DELETE FROM members WHERE id = ?', [id])
                    } else {
                        next(new Error(config.errors.wrongID))
                    }
                })
                .then(() => next(true))
                .catch((err) => next(err))
        })
    }



    /******************* FCTs TEMPORAIRES *******************/

    // Récupère tous les jeux en Stock
    static getAllEnStock(tri) {
        return new Promise((next) => {
            if (tri == 1) {
                db.query('SELECT * FROM jeuxEnStock ORDER BY prix_ht ASC')
                    .then((result) => next(result))
                    .catch((err) => next(err))
            } else if (tri == 2) {
                db.query('SELECT * FROM jeuxEnStock ORDER BY prix_ht DESC')
                    .then((result) => next(result))
                    .catch((err) => next(err))
            } else if (tri > 2 || tri < 0) {
                next(new Error('Wrong value : croissant = 1 | decroissant = 2'))
            } else {
                db.query('SELECT * FROM jeuxEnStock')
                    .then((result) => next(result))
                    .catch((err) => next(err))
            }
        })
    }
    
    // Récupère un jeu En Stock
    static getEnStockByID(id) {
        return new Promise((next) => {
            db.query('SELECT * FROM jeuxEnStock WHERE id = ?', [id])
                .then((result) => {
                    if (result[0] != undefined)
                        next(result[0])
                    else
                        next(new Error(config.errors.wrongID + "ahhhhh"))
                })
                .catch((err) => next(err))
        })
    }

    

} 