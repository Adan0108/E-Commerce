'use strict'

const { model, Schema } = require('mongoose');
const { resource } = require('../app');

const DOCUMENT_NAME = 'Role';
const COLLECTION_NAME = 'Roles';



const roleSchema = new Schema({
  rol_name: { type: String, default: 'user', enum : ['user','shop','admin']}, 
  rol_slug: { type: String, required: true }, ///000077
  rol_status: { type: String, default: 'active', enum: ['active', 'block','pending'] },
  rol_description: { type: String, default: '' },
  rol_grant: [
    {
      resource: { type: Schema.Types.ObjectId, ref: 'Resource' , required: true },
      action: { type: String, required: true }, //create, read, update, delete
      attribute: { type: String, default: '*' }, //all, id, name, email, phone
    }
  ]
}, {
  timestamps: true,
  collection: COLLECTION_NAME,
})

module.exports = model(DOCUMENT_NAME, roleSchema);