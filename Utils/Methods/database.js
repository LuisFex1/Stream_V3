import fs from 'node:fs/promises'
import { exists } from './funcs.js'

class FileDataBase {
   constructor(path = './db.json') {
      this.path = path
      this.defaultData = []
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
   constructor(path1 = './contacts.json', path2 = './ignore.json') {
      this.fileCta = new FileDatabase(path1)
      this.fileIgn = new FileDatabase(path2)
      this.contacts = new Map()
      this.ignore = new Set()
   }
   
   init = async () => {
      await this.fileCta.init()
      await this.fileIgn.init()
      const dbCta = await this.fileCta.load()
      const dbIgn = await this.fileIgn.load()
      this.contacts = new Map(dbCta.map(i => [i.id, i]))
      this.ignore = new Set(dbIgn)
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
      await this.fileCta.write([...this.contacts.values()].filter(i => Object.keys(i)?.length > 2))
      await this.fileIgn.write([...this.ignore])
      await this.init()
   }
}