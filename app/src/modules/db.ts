/* eslint-disable */
// @ts-nocheck

import Dexie from 'dexie'
import { DbSchema } from './types/db'

export const db = new Dexie('nostrUniverseDB') as DbSchema

db.version(12).stores({
  tabs: 'id,pubkey,url,order,title,icon',
  pins: 'id,pubkey,url,appNaddr,order,title,icon',
  apps: '&naddr,name,picture,url,about',
  profiles: '&id,pubkey,kind,created_at',
  lastContacts: '[pubkey+contactPubkey],tm',
  flags: 'id,pubkey,name,value',
  readOnlyKeys: '&pubkey,current',
  nsecbunkerKeys: '&pubkey,localPubkey,token',
  perms: '[pubkey+app+name],[pubkey+app],value',
  contentFeedSettings: 'id, pubkey, settings_json'
})

export const dbi = {
  addTab: async (tab) => {
    try {
      const keys = Object.keys(tab).filter((k) => k != 'ref')
      const t = {}
      for (const k of keys) t[k] = tab[k]
      await db.tabs.add(t)
    } catch (error) {
      console.log(`Add tab to DB error: ${JSON.stringify(error)}`)
    }
  },
  updateTab: async (tab) => {
    try {
      await db.tabs.where('id').equals(tab.id).modify({
        url: tab.url,
        icon: tab.icon,
        lastActive: tab.lastActive,
        order: tab.order
      })
    } catch (error) {
      console.log(`Update tab in DB error: ${JSON.stringify(error)}`)
    }
  },
  updatePinOrder: async (id, order) => {
    try {
      await db.pins.where('id').equals(id).modify({
        order
      })
    } catch (error) {
      console.log(`Update pin in DB error: ${JSON.stringify(error)}`)
    }
  },
  updateTabScreenshot: async (tab) => {
    try {
      await db.tabs.where('id').equals(tab.id).modify({
        screenshot: tab.screenshot
      })
    } catch (error) {
      console.log(`Update tab in DB error: ${JSON.stringify(error)}`)
    }
  },
  deleteTab: async (id) => {
    try {
      // Delete tab in DB by ID
      await db.tabs.delete(id)
    } catch (error) {
      console.log(`Delete tab in DB error: ${JSON.stringify(error)}`)
    }
  },
  addPin: async (pin) => {
    try {
      await db.pins.add(pin)
    } catch (error) {
      console.log(`Add pin to DB error: ${JSON.stringify(error)}`)
    }
  },
  deletePin: async (id) => {
    try {
      // Delete tab in DB by ID
      await db.pins.delete(id)
    } catch (error) {
      console.log(`Delete pin in DB error: ${JSON.stringify(error)}`)
    }
  },
  addNsecBunkerKey: async (key: NSBKey) => {
    try {
      await db.nsecbunkerKeys.add(key)
    } catch (error) {
      console.log(`Add nsb key to DB error: ${JSON.stringify(error)}`)
    }
  },
  getNsecBunkerLocalPubkey: async (pubkey: string) => {
    try {
      const keys = await db.nsecbunkerKeys.where('pubkey').equals(pubkey).toArray()
      return keys.length ? keys[0].localPubkey : ''
    } catch (error) {
      console.log(`List tabs error: ${JSON.stringify(error)}`)
    }
  },
  updatePin: async (pin) => {
    try {
      await db.pins.where('id').equals(pin.id).modify({
        title: pin.title
      })
    } catch (error) {
      console.log(`Update pin in DB error: ${JSON.stringify(error)}`)
    }
  },
  listTabs: async (pubkey) => {
    try {
      return await db.tabs.where('pubkey').equals(pubkey).toArray()
    } catch (error) {
      console.log(`List tabs error: ${JSON.stringify(error)}`)
    }
  },
  listPins: async (pubkey) => {
    try {
      return await db.pins.where('pubkey').equals(pubkey).toArray()
    } catch (error) {
      console.log(`List tabs error: ${JSON.stringify(error)}`)
    }
  },
  listApps: async () => {
    try {
      return await db.apps.toArray()
    } catch (error) {
      console.log(`List apps error: ${JSON.stringify(error)}`)
    }
  },
  listProfiles: async () => {
    try {
      return await db.profiles.toArray()
    } catch (error) {
      console.log(`List profiles error: ${JSON.stringify(error)}`)
      return []
    }
  },
  listLastContacts: async (pubkey) => {
    try {
      return await db.lastContacts.where('pubkey').equals(pubkey).toArray()
    } catch (error) {
      console.log(`List lastContacts error: ${JSON.stringify(error)}`)
    }
  },
  listPerms: async (pubkey) => {
    try {
      return await db.perms.where('pubkey').equals(pubkey).toArray()
    } catch (error) {
      console.log(`List perms error: ${JSON.stringify(error)}`)
      return []
    }
  },
  listReadOnlyKeys: async () => {
    try {
      return (await db.readOnlyKeys.toCollection().toArray()).map((k) => k.pubkey)
    } catch (error) {
      console.log(`List readOnlyKeys error: ${JSON.stringify(error)}`)
      return []
    }
  },
  listNsecbunkerKeys: async () => {
    try {
      return await db.nsecbunkerKeys.toCollection().toArray()
    } catch (error) {
      console.log(`List nsecbunkerKeys error: ${JSON.stringify(error)}`)
      return []
    }
  },
  putReadOnlyKey: async (pubkey) => {
    try {
      await db.readOnlyKeys.put({ pubkey })
    } catch (error) {
      console.log(`Put readOnlyKey to DB error: ${JSON.stringify(error)}`)
    }
  },
  putProfile: async (p) => {
    try {
      await db.profiles.put(p)
    } catch (error) {
      console.log(`Put profile to DB error: ${JSON.stringify(error)}`)
    }
  },
  updateLastContact: async (pubkey, contactPubkey) => {
    try {
      await db.lastContacts.put({
        pubkey,
        contactPubkey,
        tm: Date.now() / 1000
      })
    } catch (error) {
      console.log(`Put lastContact to DB error: ${JSON.stringify(error)}`)
    }
  },
  updatePerm: async (perm) => {
    try {
      await db.perms.put(perm)
    } catch (error) {
      console.log(`Put perms to DB error: ${JSON.stringify(error)}`)
    }
  },
  deletePerms: async (pubkey, app) => {
    try {
      // Delete tab in DB by ID
      const req = { pubkey }
      if (app) req.app = app
      await db.perms.where(req).delete()
    } catch (error) {
      console.log(`Delete perms in DB error: ${JSON.stringify(error)}`)
    }
  },
  getFlag: async (pubkey, name) => {
    try {
      const id = pubkey + name
      const flags = await db.flags.where({ id }).toArray()

      // ensure
      if (!flags.length) await db.flags.add({ id, pubkey, name, value: false })

      return flags.length ? flags[0].value : false
    } catch (error) {
      console.log(`Get flag error: ${error}`)
    }
  },
  setFlag: async (pubkey, name, value) => {
    try {
      const id = pubkey + name
      const n = await db.flags.where({ id }).modify({ value })
      if (!n) await db.flags.add({ id, pubkey, name, value })
    } catch (error) {
      console.log(`Set flag error: ${error}`)
    }
  },
  setContentFeedSettings: async (settings) => {
    try {
      await db.contentFeedSettings.add(settings)
    } catch (error) {
      console.log(`Set content feed settings error: ${error}`)
    }
  },
  checkPresenceOfSettings: async (pubkey) => {
    try {
      const count = await db.contentFeedSettings.where('pubkey').equals(pubkey).count()
      return count !== 0
    } catch (error) {
      console.log(`Check presence of content feed settings error: ${error}`)
    }
  },
  getContentFeedSettingsByPubkey: async (pubkey) => {
    try {
      const settings = await db.contentFeedSettings.where('pubkey').equals(pubkey).first()
      return settings?.settings_json || []
    } catch (error) {
      console.log(`List content feed settings error: ${error}`)
    }
  },
  updateContentFeedSettings: async (pubkey, feedSettings) => {
    try {
      await db.contentFeedSettings.where('pubkey').equals(pubkey).modify({
        settings_json: feedSettings
      })
    } catch (error) {
      console.log(`Update content feed settings error: ${error}`)
    }
  }
}
