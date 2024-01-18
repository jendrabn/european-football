const dbPromise = idb.open('db-football', 1, function (upgradeDb) {
    const matchesObjectStore = upgradeDb.createObjectStore('matches', {
        keyPath: 'id'
    });

    const teamsObjectStore = upgradeDb.createObjectStore('teams', {
        keyPath: 'id'
    })
    matchesObjectStore.createIndex('id', 'id', { unique: true });
    teamsObjectStore.createIndex('id', 'id', { unique: true });
});


function get(storeName, id) {
    return new Promise((resolve, reject) => {
        dbPromise.then(db => {
            const tx = db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            return store.get(id);
        }).then(response => {
            if (Object.keys(response).length !== 0) return resolve(response);
            return reject(`data ${storeName} tidak ditemukan`);
        });
    });
}

function getAll(storeName) {
    return new Promise((resolve, reject) => {
        dbPromise.then(db => {
            const tx = db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            return store.getAll();
        }).then(response => {
            if (Object.keys(response).length !== 0) return resolve(response);
            return reject(`data ${storeName} tidak ditemukan`);
        });
    });
}

function add(storeName, data) {
    return new Promise((resolve, reject) => {
        dbPromise.then(db => {
            const tx = db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            store.put(data);
            return tx.complete;
        })
            .then(() => resolve({ status: 'success' }))
            .catch(() => reject({ status: 'failed' }));
    });
}

function destroy(storeName, id) {
    return new Promise((resolve, reject) => {
        dbPromise.then(db => {
            const tx = db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            if (id) {
                store.delete(id);
            } else {
                store.clear();
            }
            return tx.complete;
        })
            .then(() => resolve({ status: 'success' }))
            .catch(() => reject({ status: 'failed' }));
    });
}
