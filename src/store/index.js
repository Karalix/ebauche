import PouchDB from 'pouchdb'
import secret from '../../now.json'

PouchDB.plugin(require('pouchdb-find').default)

var db = new PouchDB('ebauche')
// var remoteCouch = 'http://admin:admin@localhost:5984/ebauche'
var remoteCouch = secret.env.couchdbURL

function syncError (err) {
  console.error(err)
}

function sync () {
  let opts = {live: true, retry: true}
  db.replicate.to(remoteCouch, opts, syncError)
  db.replicate.from(remoteCouch, opts, syncError)
}

sync()

db.createIndex({
  index: {fields: ['type']}
})

export default {
  db: db,
  sync: sync
}
