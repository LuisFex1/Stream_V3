import fs from 'node:fs/promises'
import { exists } from './funcs.js'

class FileDatabase {
   constructor(path = './db.json') {
      this.path = path
      this.defaultData = {
         contacts: [],
         ignore: []
      }
   }
   
   init = async () => {
      const isDB = await exists(this.path)
      if (!isDB) await this.write(this.defaultData)
   }
   
   load = async () => {
     if(!(await exists(this.path))) return this.defaultData
      const db = await fs.readFile(this.path)
      return JSON.parse(db)
   }
   
   write = async (data) => {
      await fs.writeFile(this.path, JSON.stringify(data, null, 4))
   }
}

export class DB {
   constructor(path = './db.json') {
      this.file = new FileDatabase(path)
      this.contacts = new Map()
      this.ignore = new Set()
   }
   
   init = async () => {
      await this.file.init()
      const db = await this.file.load()
      this.contacts = new Map(db.contacts.map(i => [i.id, i]))
      this.ignore = new Set(db.ignore)
   }
   
   isIgnore = id => this.ignore.has(id)
   
   addIgnore = async (id) => {
      if (this.isIgnore(id)) return
      this.ignore.add(id)
      await this.sync()
   }
   
   delIgnore = async (id) => {
      if (!this.isIgnore(id)) return
      this.ignore.delete(id)
      await this.sync()
   }
   
   isContact = id => this.contacts.has(id)
   
   addContact = async (data) => {
      if (this.isContact(data.id)) return
      this.contacts.set(data.id, data)
      await this.sync()
   }
   
   delContact = async (id) => {
      if (!this.isContact(id)) return
      this.contacts.delete(id)
      await this.sync()
   }
   
   sync = async () => {
      const data = {
         contacts: [...this.contacts.values()].filter(i => i?.length > 2),
         ignore: [...this.ignore]
      }
      await this.file.write(data)
   }
}