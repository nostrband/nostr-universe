/* 
pins are known apps that are attached to the taskbar,
when pin is clicked, a tab is created that has same appNaddr,
when close is clicked, tab is destroyed,
when pin is clicked for which a tab exists - tab is shown

 */

import Dexie from 'dexie';

export const db = new Dexie('nostrUniverseDB');

db.version(2).stores({
  tabs: 'id,pubkey,url,appNaddr,order,title,icon',
  pins: 'id,pubkey,url,appNaddr,order,title,icon',
  flags: 'id,pubkey,name,value',
});

export async function addTab(tab) {
  try {
    const keys = Object.keys(tab).filter(k => k != "ref");
    const t = {};
    for (const k of keys)
      t[k] = tab[k];
    await db.tabs.add(t)
  } catch (error) {
    console.log(`Add tab to DB error: ${JSON.stringify(error)}`)
  }
}

export async function updateTab(tab) {
  try {
    await db.tabs.where('id').equals(tab.id).modify({url: tab.url});
  } catch (error) {
    console.log(`Update tab in DB error: ${JSON.stringify(error)}`);
  }
}

export async function deleteTab(id) {
  try {
    // Delete tab in DB by ID
    await db.tabs.delete(id);
  } catch (error) {
    console.log(`Delete tab in DB error: ${JSON.stringify(error)}`);
  }
}

export async function addPin(pin) {
  try {
    await db.pins.add(pin)
  } catch (error) {
    console.log(`Add pin to DB error: ${JSON.stringify(error)}`)
  }
}

export async function deletePin(id) {
  try {
    // Delete tab in DB by ID
    await db.pins.delete(id);
  } catch (error) {
    console.log(`Delete pin in DB error: ${JSON.stringify(error)}`);
  }
}

export async function listTabs(pubkey) {
  try {
    return await db.tabs.where('pubkey').equals(pubkey).toArray();
  } catch (error) {
    console.log(`List tabs error: ${JSON.stringify(error)}`);
  }
}

export async function listPins(pubkey) {
  try {
    return await db.pins.where('pubkey').equals(pubkey).toArray();
  } catch (error) {
    console.log(`List tabs error: ${JSON.stringify(error)}`);
  }
}

export async function getFlag(pubkey, name) {
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
}

export async function setFlag(pubkey, name, value) {
  try {
    const id = pubkey+name;
    const n = await db.flags.where({id}).modify({value});
    if (!n)
      await db.flags.add({id, pubkey, name, value});    
  } catch (error) {
    console.log(`Set flag error: ${error}`);
  }
}
