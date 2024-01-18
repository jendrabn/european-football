const options = {
    method: 'GET',
    mode: 'cors',
    headers: {
        'X-Auth-Token': 'ac5219d962fd4e9189359095f1365269'
    }
}

const baseUrl = 'https://api.football-data.org/v2';
const id = new URLSearchParams(window.location.search).get('league');

function getMatches(id) {
    return new Promise(async (resolve, reject) => {
        let status = false;
        if ('caches' in window) {
            await caches.match(`${baseUrl}/competitions/${id}/matches`).then(response => {
                if (response) {
                    status = true;
                    response.json().then(response => {
                        console.log('mengambil data matches dari cache');
                        return resolve(response);
                    });
                }
            });
        }

        if (status === false) {
            fetch(`${baseUrl}/competitions/${id}/matches`, options)
                .then(response => {
                    if (!response) throw new Error(response.status);
                    return response.json()
                })
                .then(response => {
                    console.log('mengambil data matches dari server');
                    return resolve(response);
                })
                .catch(error => {
                    return reject(error)
                });
        }
    });
}

function getMatch(id) {
    return new Promise(async (resolve, reject) => {
        let status = false;
        if ('caches' in window) {
            await caches.match(`${baseUrl}/matches/${id}`).then(response => {
                if (response) {
                    status = true;
                    response.json().then(response => {
                        console.log('mengambil data match dari cache');
                        return resolve(response);
                    });
                }
            });
        }

        if (status === false) {
            fetch(`${baseUrl}/matches/${id}`, options)
                .then(response => {
                    if (!response) throw new Error(response.status);
                    return response.json()
                })
                .then(response => {
                    console.log('mengambil data match dari server');
                    return resolve(response);
                })
                .catch(error => {
                    return reject(error)
                });
        }
    });
}

function getTeams(id) {
    return new Promise(async (resolve, reject) => {
        let status = false;
        if ('caches' in window) {
            await caches.match(`${baseUrl}/competitions/${id}/teams`).then(response => {
                if (response) {
                    status = true;
                    response.json().then(response => {
                        console.log('mengambil data teams dari cache');
                        return resolve(response);
                    });
                }
            });
        }

        if (status === false) {
            fetch(`${baseUrl}/competitions/${id}/teams`, options)
                .then(response => {
                    if (!response) throw new Error(response.status);
                    return response.json()
                })
                .then(response => {
                    console.log('mengambil data teams dari server');
                    return resolve(response);
                })
                .catch(error => {
                    return reject(error)
                });
        }
    });
}

function getTeam(id) {
    return new Promise(async (resolve, reject) => {
        let status = false;
        if ('caches' in window) {
            await caches.match(`${baseUrl}/teams/${id}`).then(response => {
                if (response) {
                    status = true;
                    response.json().then(response => {
                        console.log('mengambil data team dari cache');
                        return resolve(response);
                    });
                }
            });
        }

        if (status === false) {
            fetch(`${baseUrl}/teams/${id}`, options)
                .then(response => {
                    if (!response) throw new Error(response.status);
                    return response.json()
                })
                .then(response => {
                    console.log('mengambil data team dari server');
                    return resolve(response);
                })
                .catch(error => {
                    return reject(error)
                });
        }
    });
}

function getStandings(id) {
    return new Promise(async (resolve, reject) => {
        let status = false;
        if ('caches' in window) {
            await caches.match(`${baseUrl}/competitions/${id}/standings`).then(response => {
                if (response) {
                    status = true;
                    response.json().then(response => {
                        console.log('get standings from cache');
                        return resolve(response);
                    });
                }
            });
        }

        if (status === false) {
            fetch(`${baseUrl}/competitions/${id}/standings`, options)
                .then(response => {
                    if (!response) throw new Error(response.status);
                    return response.json()
                })
                .then(response => {
                    console.log('mengambil data standings dari server');
                    return resolve(response);
                })
                .catch(error => {
                    return reject(error)
                });
        }
    });
}