'use strict'

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Role';
const COLLECTION_NAME = 'Roles';



// grant List fetched from DB (to be converted to a valid grants object, internally)
// let grantList = [
//     { role: 'admin', resource: 'video', action: 'create:any', attributes: '* !views' },
//     { role: 'admin', resource: 'video', action: 'read:any', attributes: '*' },
//     { role: 'admin', resource: 'video', action: 'update:any', attributes: '* !views' },
//     { role: 'admin', resource: 'video', action: 'delete:any', attributes: '*' },

//     { role: 'user', resource: 'video', action: 'create:own', attributes: '* !rating !views' },
//     { role: 'user', resource: 'video', action: 'read:any', attributes: '*' },
//     { role: 'user', resource: 'video', action: 'update:own', attributes: '* !rating !views' },
//     { role: 'user', resource: 'video', action: 'delete:own', attributes: '*' }
// ];



const roleSchema = new Schema({
  rol_name: { type: String, default: 'user', enum : ['user','shop','admin']}, 
  rol_slug: { type: String, required: true }, ///000077
  rol_status: { type: String, default: 'active', enum: ['active', 'block','pending'] },
  rol_description: { type: String, default: '' },
  rol_grants: [
    {
      resource: { type: Schema.Types.ObjectId, ref: 'Resource' , required: true },
      actions: [{ type: String, required: true }], //create, read, update, delete
      attributes: { type: String, default: '*' }, //all, id, name, email, phone
    }
  ]
}, {
  timestamps: true,
  collection: COLLECTION_NAME,
})

module.exports = model(DOCUMENT_NAME, roleSchema);