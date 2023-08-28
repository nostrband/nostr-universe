/* 
pins are known apps that are attached to the taskbar,
when pin is clicked, a tab is created that has same appNaddr,
when close is clicked, tab is destroyed,
when pin is clicked for which a tab exists - tab is shown

 */

import Dexie from 'dexie';

export const db = new Dexie('nostrUniverseDB');

db.version(7).stores({
  tabs: 'id,pubkey,url,appNaddr,order,title,icon',
  pins: 'id,pubkey,url,appNaddr,order,title,icon',
  apps: '&naddr,name,picture,url,about',
  profiles: '&id,pubkey,kind,created_at',
  lastContacts: '[pubkey+contactPubkey],tm',
  flags: 'id,pubkey,name,value',
  readOnlyKeys: '&pubkey,current',
});

export const dbi = {
  addTab: async (tab) => {
    try {
      const keys = Object.keys(tab).filter(k => k != "ref");
      const t = {};
      for (const k of keys)
	t[k] = tab[k];
      await db.tabs.add(t)
    } catch (error) {
      console.log(`Add tab to DB error: ${JSON.stringify(error)}`)
    }
  },
  updateTab: async (tab) => {
    try {
      await db.tabs.where('id').equals(tab.id).modify({url: tab.url, icon: tab.icon, order: tab.order});
    } catch (error) {
      console.log(`Update tab in DB error: ${JSON.stringify(error)}`);
    }
  },
  deleteTab: async (id) => {
    try {
      // Delete tab in DB by ID
      await db.tabs.delete(id);
    } catch (error) {
      console.log(`Delete tab in DB error: ${JSON.stringify(error)}`);
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
      await db.pins.delete(id);
    } catch (error) {
      console.log(`Delete pin in DB error: ${JSON.stringify(error)}`);
    }
  },
  listTabs: async (pubkey) => {
    try {
      return await db.tabs.where('pubkey').equals(pubkey).toArray();
    } catch (error) {
      console.log(`List tabs error: ${JSON.stringify(error)}`);
    }
  },
  listPins: async (pubkey) => {
    try {
      return await db.pins.where('pubkey').equals(pubkey).toArray();
    } catch (error) {
      console.log(`List tabs error: ${JSON.stringify(error)}`);
    }
  },
  listApps: async () => {
    try {
      return await db.apps.toArray();
    } catch (error) {
      console.log(`List apps error: ${JSON.stringify(error)}`);
    }
  },
  listProfiles: async () => {
    try {
      return await db.profiles.toArray();
    } catch (error) {
      console.log(`List profiles error: ${JSON.stringify(error)}`);
    }
  },
  listLastContacts: async (pubkey) => {
    try {
      return await db.lastContacts.where('pubkey').equals(pubkey).toArray();
    } catch (error) {
      console.log(`List lastContacts error: ${JSON.stringify(error)}`);
    }
  },
  listReadOnlyKeys: async () => {
    try {
      return (await db.readOnlyKeys.toCollection().toArray()).map(k => k.pubkey);
    } catch (error) {
      console.log(`List readOnlyKeys error: ${JSON.stringify(error)}`);
      return [];
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
      await db.lastContacts.put({pubkey, contactPubkey, tm: Date.now() / 1000})
    } catch (error) {
      console.log(`Put lastContact to DB error: ${JSON.stringify(error)}`)
    }
  },
  getFlag: async (pubkey, name) => {
    try {
      const id = pubkey+name;
      const flags = await db.flags.where({id}).toArray();

      // ensure
      if (!flags.length)
	await db.flags.add({id, pubkey, name, value: false});

      return flags.length ? flags[0].value : false;
    } catch (error) {
      console.log(`Get flag error: ${error}`);
    }
  },
  setFlag: async (pubkey, name, value) => {
    try {
      const id = pubkey+name;
      const n = await db.flags.where({id}).modify({value});
      if (!n)
	await db.flags.add({id, pubkey, name, value});    
    } catch (error) {
      console.log(`Set flag error: ${error}`);
    }
  }
};
