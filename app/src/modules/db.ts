/* eslint-disable */
// @ts-nocheck

import Dexie from 'dexie'
import { DbSchema } from './types/db'
import { feedbackPeriodMs, formatDate, formatDateHours } from '@/consts'
import { KIND_ZAP_REQUEST } from './nostr'
import { add, format, setDay, startOfDay } from 'date-fns'
import { feedbackPeriodMs } from '@/consts'
import { Kinds } from './const/kinds'

export const db = new Dexie('nostrUniverseDB') as DbSchema

db.version(24).stores({
  tabs: 'id,pubkey,url,order,title,icon',
  pins: 'id,pubkey,url,appNaddr,order,title,icon',
  apps: '&naddr,name,picture,url,about',
  profiles: '&id,pubkey,kind,created_at',
  lastContacts: '[pubkey+contactPubkey],tm',
  flags: 'id,pubkey,name,value',
  readOnlyKeys: '&pubkey,current',
  nsecbunkerKeys: '&pubkey,localPubkey,token',
  perms: '[pubkey+app+name],[pubkey+app],value',
  contentFeedSettings: 'id, pubkey, settings_json',
  lastKindApps: 'id,pubkey,kind,naddr,app_json',
  signedEvents: 'id,pubkey,timestamp,url,kind,eventId,eventJson,eventZapHash',
  searchHistory: 'id,pubkey,timestamp,value',
  localRelayEvents: 'id,pubkey,kind,created_at',
  payments: 'id,pubkey,timestamp,url,walletId,walletName,amount,invoice,preimage,descriptionHash',
  searchClickHistory: 'id,pubkey,timestamp,addr,query,kind',
  selectAppHistory: 'timestamp,pubkey,kind,naddr,name,nextSuggestTime,numberOfLaunch',
  appOfTheDayHistory: 'id, app, date',
  syncTasks: 'id,pubkey,type,since,until'
})

export const dbi = {
  setNextSuggestTime: async ({ nextTimestamp, app }) => {
    try {
      return await db.transaction('rw', db.selectAppHistory, async () => {
        const getItem = await db.selectAppHistory.where({ naddr: app.naddr, kind: app.kind }).first()

        if (getItem) {
          await db.selectAppHistory.where({ naddr: app.naddr, kind: app.kind }).modify((item) => {
            item.nextSuggestTime = nextTimestamp
          })
          console.log(`Update ${app.name} in DB in selectAppHistory`)

          return db.selectAppHistory.get(getItem.timestamp)
        } else {
          console.log(`Add ${app.name} to DB to selectAppHistory`)
        }
      })
    } catch (error) {
      console.log(`Add nextSuggestTime to DB error: ${error}`)
    }
  },

  addSelectAppHistory: async (app) => {
    try {
      return await db.transaction('rw', db.selectAppHistory, async () => {
        const getItem = await db.selectAppHistory.where({ naddr: app.naddr, kind: app.kind }).first()

        if (getItem) {
          await db.selectAppHistory.where({ naddr: app.naddr, kind: app.kind }).modify((item) => {
            item.numberOfLaunch += 1
          })

          console.log(`Update ${app.name} in DB in selectAppHistory`)

          return db.selectAppHistory.get(getItem.timestamp)
        } else {
          await db.selectAppHistory.add(app)
          console.log(`Add ${app.name} to DB to selectAppHistory`)

          return db.selectAppHistory.get(app.timestamp)
        }
      })
    } catch (error) {
      console.log(`Add selectAppHistory to DB error: ${error}`)
    }
  },
  getListSelectAppHistory: async (pubkey: string) => {
    try {
      return await db.selectAppHistory.where('pubkey').equals(pubkey).toArray()
    } catch (error) {
      console.log(`List selectAppHistory error: ${error}`)
      return []
    }
  },
  addSignedEvent: async (signedEvent) => {
    try {
      await db.signedEvents.add(signedEvent)
    } catch (error) {
      console.log(`Add signedEvent to DB error: ${error}`)
    }
  },
  listSignedZapRequests: async (pubkey: string) => {
    try {
      return (
        await db.signedEvents
          .where({
            pubkey,
            kind: Kinds.ZAP_REQUEST
          })
          .toArray()
      ).sort((a, b) => b.timestamp - a.timestamp)
    } catch (error) {
      console.log(`List signedEvents error: ${error}`)
      return []
    }
  },
  listSignedEvents: async (pubkey: string) => {
    try {
      return (await db.signedEvents.where('pubkey').equals(pubkey).toArray()).sort((a, b) => b.timestamp - a.timestamp)
    } catch (error) {
      console.log(`List signedEvents error: ${error}`)
      return []
    }
  },
  addPayment: async (payment) => {
    try {
      await db.payments.add(payment)
    } catch (error) {
      console.log(`Add payment to DB error: ${error}`)
    }
  },
  listPayments: async (pubkey: string) => {
    try {
      return (await db.payments.where('pubkey').equals(pubkey).toArray()).sort((a, b) => b.timestamp - a.timestamp)
    } catch (error) {
      console.log(`List payments error: ${error}`)
      return []
    }
  },
  updatePayment: async (id, preimage) => {
    try {
      await db.payments.where('id').equals(id).modify({
        preimage
      })
    } catch (error) {
      console.log(`Update payment in DB error: ${JSON.stringify(error)}`)
    }
  },
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
        title: pin.title,
        groupName: pin.groupName
      })
    } catch (error) {
      console.log(`Update pin in DB error: ${JSON.stringify(error)}`)
    }
  },
  bulkEditPins: async (pins) => {
    try {
      await db.pins.bulkPut(pins)
    } catch (error) {
      console.log(`Bulk edit pins in DB error: ${JSON.stringify(error)}`)
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
  },
  putLastKindApp: async (app) => {
    try {
      await db.lastKindApps.put(app)
    } catch (error) {
      console.log(`Put lastKindApp error: ${error}`)
    }
  },
  getLastKingApps: async (pubkey) => {
    try {
      const lastKindApps = await db.lastKindApps.where({ pubkey }).toArray()
      return lastKindApps.reduce((acc, current) => {
        return {
          ...acc,
          [current.kind]: {
            ...current,
            lastUsed: true,
            order: 10000
          }
        }
      }, {})
    } catch (error) {
      console.log(`Get lastKindApps error: ${error}`)
    }
  },
  addSearchTerm: async (searchTerm) => {
    try {
      const existingSearchTerm = await db.searchHistory.where('value').equals(searchTerm.value).first()

      if (existingSearchTerm) {
        existingSearchTerm.timestamp = Date.now()
        return await db.searchHistory.put(existingSearchTerm)
      }
      return await db.searchHistory.add(searchTerm)
    } catch (error) {
      console.log(`Add searchTerm to search history in DB error: ${error}`)
    }
  },
  deleteSearchTerm: async (id) => {
    try {
      if (!id) {
        throw new Error('ID is required!')
      }
      await db.searchHistory.delete(id)
    } catch (error) {
      console.log(`Delete searchTerm from search history in DB error: ${error}`)
    }
  },
  getSearchHistory: async (pubkey, limit) => {
    try {
      const currentPubkeySearchHistory = await db.searchHistory.where('pubkey').equals(pubkey).toArray()
      return currentPubkeySearchHistory.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit)
    } catch (error) {
      console.log(`Get search history in DB error: ${error}`)
    }
  },
  autoDeleteExcessSearchHistory: async (pubkey) => {
    try {
      const maxQueries = 30
      const queryCount = await db.searchHistory.where({ pubkey }).count()

      if (queryCount > maxQueries) {
        const queriesToDeleteCount = queryCount - maxQueries
        const queries = await db.searchHistory.where({ pubkey }).sortBy('timestamp')
        const queriesToDelete = queries.slice(0, queriesToDeleteCount)
        const queryIdsToDelete = queriesToDelete.map((query) => query.id)
        await db.searchHistory.bulkDelete(queryIdsToDelete)
      }

      const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
      const outdatedQueries = await db.searchHistory.where({ pubkey, timestamp: { '<': oneWeekAgo } }).toArray()

      if (outdatedQueries.length > 0) {
        await db.searchHistory.bulkDelete(outdatedQueries.map((query) => query.id))
      }
    } catch (error) {
      console.log(`Bulk delete excess search history in DB error: ${error}`)
    }
  },
  getNextFeedbackTime: async () => {
    return Number((await dbi.getFlag('', 'nextFeedbackTime')) || '0')
  },
  advanceFeedbackTime: async () => {
    await dbi.setFlag('', 'nextFeedbackTime', Date.now() + feedbackPeriodMs)
  },
  addSearchClickEvent: async (searchEvent) => {
    try {
      const existingEvent = await db.searchClickHistory
        .filter(
          (event) =>
            event.pubkey === searchEvent.pubkey && event.addr === searchEvent.addr && event.query === searchEvent.query
        )
        .first()

      if (existingEvent) {
        existingEvent.timestamp = searchEvent.timestamp
        await db.searchClickHistory.put(existingEvent)
      } else {
        await db.searchClickHistory.add(searchEvent)
      }
    } catch (error) {
      console.log(`Add searchEvent to DB error: ${error}`)
    }
  },
  listSearchClickHistory: async (pubkey) => {
    try {
      const list = await db.searchClickHistory.where('pubkey').equals(pubkey).toArray()

      return list.sort((a, b) => b.timestamp - a.timestamp).slice(0, 30)
    } catch (error) {
      console.log(`List searchClickHistory error: ${error}`)
      return []
    }
  },
  deleteSearchClickEvent: async (id) => {
    try {
      await db.searchClickHistory.delete(id)
    } catch (error) {
      console.log(`Delete searchClickEvent in DB error: ${JSON.stringify(error)}`)
    }
  },
  getAOTDShownDate: async () => {
    return (await dbi.getFlag('', 'appOfDayShownDate')) || ''
  },
  setAOTDShownDate: async () => {
    await dbi.setFlag('', 'appOfDayShownDate', format(startOfDay(new Date()), formatDate))
  },
  resetAOTDShownDate: async () => {
    await dbi.setFlag('', 'appOfDayShownDate', '')
  },
  listAOTDHistory: async () => {
    try {
      const list = await db.appOfTheDayHistory.toArray()
      return list
    } catch (error) {
      console.log(`Get listAOTDHistory in DB error: ${error}`)
      return []
    }
  },
  addAOTD: async (appInfo) => {
    try {
      const existingAOTD = await db.appOfTheDayHistory.where('date').equals(appInfo.date).first()

      if (existingAOTD) {
        await db.appOfTheDayHistory.update(existingAOTD.id, appInfo)
      } else {
        await db.appOfTheDayHistory.add(appInfo)
      }
    } catch (error) {
      console.log(`Add AOTD to history in DB error: ${error}`)
    }
  },
  getAOTDByShownDate: async (date) => {
    try {
      return await db.appOfTheDayHistory.where({ date }).first()
    } catch (error) {
      console.log(`Get AOTD to history in DB error: ${error}`)
    }
  },
  listLocalRelayEvents: async () => {
    try {
      return await db.localRelayEvents.toCollection().toArray()
    } catch (error) {
      console.log(`List localRelayEvents error: ${JSON.stringify(error)}`)
      return []
    }
  },
  putLocalRelayEvents: async (es) => {
    try {
      await db.localRelayEvents.bulkPut(es)
    } catch (error) {
      console.log(`Put localRelayEvents error: ${error}`)
    }
  },
  listSyncTasks: async (pubkey: string) => {
    try {
      return await db.syncTasks.where('pubkey').equals(pubkey).toArray()
    } catch (error) {
      console.log(`List syncTasks error: ${error}`)
      return []
    }
  },
  putSyncTasks: async (tasks) => {
    try {
      await db.syncTasks.bulkPut(tasks)
    } catch (error) {
      console.log(`Put syncTasks error: ${error}`)
    }
  },
  deleteSyncTask: async (id) => {
    try {
      await db.syncTasks.delete(id)
    } catch (error) {
      console.log(`Delete syncTasks in DB error: ${JSON.stringify(error)}`)
    }
  }
}
