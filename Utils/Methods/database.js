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
      if (!(await exists(this.path))) return this.defaultData
      const db = await fs.readFile(this.path)
      if (db) return JSON.parse(db)
   }
   
   write = async (data) => {
      await fs.writeFile(this.path, JSON.stringify(data, null, 4))
   }
}

export class DB {
   constructor(path1 = './contacts.json', path2 = './ignore.json') {
      this.fileCta = new FileDataBase(path1)
      this.fileIgn = new FileDataBase(path2)
      this.contacts = new Map()
      this.ignore = new Set()
      this.modCta = false
      this.modIgn = false
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
      this.modIgn = true
      await this.sync()
   }
   
   delIgnore = async (id) => {
      if (!this.isIgnore(id)) return
      this.ignore.delete(id)
      this.modIgn = true
      await this.sync()
   }
   
   isContact = id => this.contacts.has(id)
   
   addContact = (data) => {
      if (this.isContact(data.id)) return
      this.modCta = true
      this.contacts.set(data.id, data)
   }
   
   delContact = async (id) => {
      if (!this.isContact(id)) return
      this.contacts.delete(id)
      this.modCta = true
      await this.sync()
   }
   
   syncCta = async () => {
      if (!this.modCta) return
      await this.fileCta.write([...this.contacts.values()].filter(i => Object.keys(i)?.length > 2))
      this.modCta = false
   }
   
   syncIgn = async () => {
      if (!this.modIgn) return
      await this.fileIgn.write([...this.ignore])
      this.modIgn = false
   }
   
   sync = async () => {
      await this.syncCta()
      await this.syncIgn()
   }
}