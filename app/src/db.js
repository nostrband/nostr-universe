import Dexie from 'dexie';

export const db = new Dexie('nostrUniverseDB');
db.version(1).stores({
  tabsList: 'id, publicKey',
});

export async function addTabToDB(tabItem, list) {
  try {
    const currentAlias = list ? list.currentAlias : 'without publicKey'
    await db.tabsList.add({
      id: tabItem.id,
      app: tabItem.app,
      url: tabItem.url,
      publicKey: currentAlias,
      order: tabItem.order
    })
  } catch (error) {
    console.log(`Add item to DB error: ${JSON.stringify(error)}`)
  }
}

export async function updateTabDB(tab) {
  try {
    // get tab from DB by id
    const [getOpenTab] = await db.tabsList.where('id').equals(tab.id).toArray();
    // if tab exist, update url in DB
    if (getOpenTab.url !== tab.url) {
      await db.tabsList.update(tab.id, { url: tab.url });
    }
  } catch (error) {
    console.log(`Update item in DB error: ${JSON.stringify(error)}`);
  }
}

export async function deleteTabDB(id) {
  try {
    // Delete tab in DB by ID
    await db.tabsList.delete(id);
  } catch (error) {
    console.log(`Delete item in DB error: ${JSON.stringify(error)}`);
  }
}

export async function listTabs(pubkey) {
  try {
    return await db.tabsList.where('publicKey').equals(pubkey).toArray();
  } catch (error) {
    console.log(`List tabs error: ${JSON.stringify(error)}`);
  }
}
