const DBName = 'TDP_DB';
const DBVersion = 1;
const StoreName = 'TDP_DB_editor_data';
const IndexedDB = window.indexedDB;
type TData = {
    id: string;
    data: any;
};
// 打开数据库
export const openDBAsync = async (
    dbName = DBName,
    version = DBVersion,
    storeName = StoreName
): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const req = IndexedDB.open(dbName, version);
        req.onsuccess = function (event: any) {
            console.info(`DB named ${dbName} open success, event:`, event);
            const db = event.target.result as IDBDatabase;
            resolve(db);
        };
        req.onerror = function (event) {
            console.error(`DB named ${dbName} open error, event:`, event);
            reject(event);
        };
        req.onupgradeneeded = function (event: any) {
            console.info(`DB named ${dbName} upgradeneeded, event:`, event);
            const db = event.target.result as IDBDatabase;
            openStore(db, storeName);
        };
    });
};

// 打开表
export const openStore = (db: IDBDatabase, name = StoreName) => {
    if (!db.objectStoreNames.contains(name)) {
        return db.createObjectStore(name, { keyPath: 'id' });
    }
};

// 添加数据
export const addDataAsync = async (
    db: IDBDatabase,
    data: TData,
    storeName = StoreName
): Promise<IDBValidKey> => {
    return new Promise((resolve, reject) => {
        const req = db.transaction(storeName, 'readwrite').objectStore(storeName).add(data);
        req.onsuccess = function (event: any) {
            console.info(`store named ${storeName} [add data] success, event:`, event);
            resolve(req.result);
        };
        req.onerror = function (event) {
            console.error(`store named ${storeName} [add data] error, event:`, event);
            reject(event);
        };
    });
};

// 修改数据
export const updateDataAsync = async (
    db: IDBDatabase,
    data: TData,
    storeName = StoreName
): Promise<IDBValidKey> => {
    return new Promise((resolve, reject) => {
        const req = db.transaction(storeName, 'readwrite').objectStore(storeName).put(data);
        req.onsuccess = function (event: any) {
            console.info(`store named ${storeName} [update data] success, event:`, event);
            resolve(req.result);
        };
        req.onerror = function (event) {
            console.error(`store named ${storeName} [update data] error, event:`, event);
            reject(event);
        };
    });
};

// 查找数据
export const getDataAsync = async (
    db: IDBDatabase,
    key: string,
    storeName = StoreName
): Promise<TData> => {
    return new Promise((resolve, reject) => {
        const req = db.transaction(storeName).objectStore(storeName).get(key);
        req.onsuccess = function (event: any) {
            console.info(`store named ${storeName} [get data] success, event:`, event);
            resolve(req.result);
        };
        req.onerror = function (event) {
            console.error(`store named ${storeName} [get data] error, event:`, event);
            reject(event);
        };
    });
};

// 删除数据
export const deleteDataAsync = async (
    db: IDBDatabase,
    data: any,
    storeName = StoreName
): Promise<void> => {
    return new Promise((resolve, reject) => {
        const req = db.transaction(storeName, 'readwrite').objectStore(storeName).delete(data);
        req.onsuccess = function (event: any) {
            console.info(`store named ${storeName} [add data] success, event:`, event);
            resolve();
        };
        req.onerror = function (event) {
            console.error(`store named ${storeName} [add data] error, event:`, event);
            reject(event);
        };
    });
};

// 有则修改，无则添加
export const setDataAsync = async (
    db: IDBDatabase,
    data: TData,
    storeName = StoreName
): Promise<void> => {
    const _d = await getDataAsync(db, data.id, storeName).catch();
    if (!_d) {
        await addDataAsync(db, data, storeName).catch();
    } else {
        await updateDataAsync(db, data, storeName).catch();
    }
};
