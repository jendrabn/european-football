document.addEventListener('DOMContentLoaded', function () {
	M.AutoInit();

	switch (getFileName(window.location.href)) {
		case 'competition':
			renderMatches();
			renderTeams();
			renderStandings();
			break;
		case 'saved':
			renderSavedTeams();
			renderSavedMacthes();
			break;
		default:
			break;
	}

	if ('serviceWorker' in navigator) {
		window.addEventListener('load', () => {
			navigator.serviceWorker.register('/services-worker.js')
				.then(() => { console.log('Berhasil mendaftarkan services worker') })
				.catch(() => { console.log('Gagal mendaftarkan services worker') })
		});
	}

	if ('PushManager' in window) {
		navigator.serviceWorker.getRegistration().then(registration => {
			registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: urlBase64ToUint8Array('BOIH646NXjWMKuB1q_tvkd0Zz74APYkZY07U5Hy-lCxRMfB5DvIk9ekAYQgzGoPxVeTQbHCa88QBcUdLIVYDPRM')
			}).then(subscribe => {
				console.log('Berhasil melakukan subscribe dengan endpoint: ', subscribe.endpoint);
				console.log('Berhasil melakukan subscribe dengan p256dh key: ', btoa(String.fromCharCode.apply(
					null, new Uint8Array(subscribe.getKey('p256dh')))));
				console.log('Berhasil melakukan subscribe dengan auth key: ', btoa(String.fromCharCode.apply(
					null, new Uint8Array(subscribe.getKey('auth')))));
			}).catch(function (e) {
				console.error('Tidak dapat melakukan subscribe ', e.message);
			});
		});
	}

});


function renderStandings() {
	let contentHtml = ``;
	const table = (content, group) => {
		let groupName = ``;
		if (group) groupName = `<div class="group_name"><p>${group}</p></div>`;
		return `
		${groupName}
		<div style="overflow-x:auto;">
			<table class="striped" style="margin-bottom: 30px;">
				<thead>
				<tr>
					<th>Team</th>
					<th></th>
					<th>M</th>
					<th>M</th>
					<th>S</th>
					<th>K</th>
					<th>GM</th>
					<th>GA</th>
					<th>SG</th>
					<th>Poin</th>
				</tr>
				</thead>
				<tbody class="klasemen">
					${content}
				</tbody>
			</table>
		</div>`;
	}
	const wrapperElement = document.getElementById('klasemen');
	wrapperElement.innerHTML = displayLoading();
	getStandings(id).then(response => {
		const standings = response.standings;
		for (let i = 0; i < standings.length; i += 3) {
			let standingsHtml = ``;
			standings[i].table.forEach(standing => {
				standingsHtml += `
					<tr>
						<td style="text-align: center">${standing.position}</td>
						<td style="display: flex; align-items: center">
							<img src="${toHttps(standing.team.crestUrl)}" alt="${standing.team.name}" 
								onerror="this.onerror=null;this.src='img/404.png';">
							${standing.team.name}
						</td>
						<td>${standing.playedGames}</td>
						<td>${standing.won}</td>
						<td>${standing.draw}</td>
						<td>${standing.lost}</td>
						<td>${standing.goalsFor}</td>
						<td>${standing.goalsAgainst}</td>
						<td>${standing.goalDifference}</td>
						<td>${standing.points}</td>
					</tr>`;
			});
			if (standings[i].group !== null) {
				const groupName = name => 'Grup ' + name[name.length - 1];
				contentHtml += table(standingsHtml, groupName(standings[i].group));
			}
			contentHtml += table(standingsHtml);
		}

		const date = time => new Date(time).getFullYear();
		document.getElementById('_leaguename').innerHTML = `
			<h1 class="page_title">${response.competition.name}</h1>
			<p>Musim ${date(response.season.startDate)} - ${date(response.season.endDate)}</p>
		`;
		if (contentHtml === ``) contentHtml = displayError('No Data');
		wrapperElement.innerHTML = contentHtml;
	}).catch(error => {
		document.getElementById('klasemen').innerHTML = displayError(error);
	});
}

function renderTeams() {
	const wrapperElement = document.getElementById('_teams');
	wrapperElement.innerHTML = displayLoading();
	getTeams(id).then(async response => {
		const teamsDb = await getAll('teams').then(response => response).catch(() => null);
		let teamsHtml = ``;
		response.teams.forEach(team => {
			const btnAction = () => {
				let btnAdd = true;
				if (teamsDb !== null) {
					teamsDb.forEach(val => {
						if (val.id == team.id) {
							btnAdd = false;
						}
					});
				}
				if (btnAdd === true) {
					return `
					<div class="add_favorite_team tooltipped action_btn" data-position="top" data-id="${team.id}" data-tooltip="Add Favorite Team">     
						<i class="small material-icons">favorite</i>
					</div>
					`;
				}
				return `
				<div class="favorite_team tooltipped action_btn" data-position="top" data-id="${team.id}" data-tooltip="My Favorite Team">     
					<i class="small material-icons">favorite</i>
				</div>
				`;
			}
			teamsHtml += `
			<div class="col s6 m4 l2">
				<div class="card team_card" style="position: relative">
					${btnAction()}
					<div class="card-image">
						<img src="${toHttps(team.crestUrl)}" alt="" onerror="this.onerror=null;this.src='img/404.png';">
					</div>
					<div class="card-content">
						<p>${team.shortName}</p>
						<p style="margin-top: 5px"><b>Est.</b> ${team.founded}</p>
					</div>
					<a href="#modal" class="modal-trigger detail_team_btn" data-id="${team.id}">
						<div class="detail_btn">     
							<i class="small material-icons">remove_red_eye</i>
						</div>
					</a>
				</div>
			</div>`;
		});
		if (teamsHtml === ``) teamsHtml = displayError('No Data');
		wrapperElement.innerHTML = teamsHtml;
		M.AutoInit();
		document.querySelectorAll('.add_favorite_team').forEach(elm => {
			elm.addEventListener('click', function () {
				showModalAlert();
				getTeam(this.dataset.id).then(response => {
					add('teams', response).then(response =>
						displayAlertMessage({
							status: response.status,
							title: 'Berhasil Disimpan',
							message: 'Berhasil menambahkan tim favorit'
						}, renderTeams)
					).catch(response =>
						displayAlertMessage({
							status: response.status,
							title: 'Gagal Disimpan',
							message: 'Gagal menambahkan tim favorit'
						})
					);
				}).catch(error =>
					displayAlertMessage({
						status: 'failed',
						title: 'Gagal Disimpan',
						message: 'Gagal menambahkan tim favorit ' + error
					}));
			});
		});
		renderTeamDetails();
	}).catch(error => {
		wrapperElement.innerHTML = displayError(error);
	});
}

function renderMatches() {
	const container = document.getElementById('_pertandingan');
	container.innerHTML = displayLoading();
	getMatches(id).then(async response => {
		const matchDb = await getAll('matches').then(response => response).catch(() => null);
		let matchesHtml = ``;
		response.matches.forEach(match => {
			const btnAction = () => {
				let btnAdd = false;
				if (matchDb !== null) {
					matchDb.forEach(val => {
						if (val.id === match.id) {
							btnAdd = true;
						}
					});
				}

				if (btnAdd === true) {
					return `<button class="saved_match tooltipped" data-position="top" data-tooltip="Jadwal Telah Disimpan" data-id="${match.id}"><i class="material-icons">check_circle</i></button>`;
				}
				return `<button class="add_match tooltipped" data-position="top" data-tooltip="Simpan Jadwal" data-id="${match.id}"><i class="material-icons">add_circle</i></button>`;
			}
			const homeTeamScore = match.score.fullTime.homeTeam != null ? match.score.fullTime.homeTeam : '';
			const awayTeamScore = match.score.fullTime.awayTeam != null ? match.score.fullTime.awayTeam : '';
			const date = new Date(Date.parse(match.utcDate)).toLocaleString('en-US', { timeZone: 'UTC' });
			matchesHtml += `
			<div class="col s12 m6 l6 match_wrapper">
				<div>
					<div><i class="tiny material-icons">access_time</i>&nbsp; &nbsp;${date}</div>
					<div>${match.status}</div>
				</div>
				<table>
					<tbody>
						<tr>
							<td>${match.homeTeam.name}</td>
							<td class="score">${homeTeamScore}</td>
						</tr>
						<tr>
							<td>${match.awayTeam.name}</td>
							<td class="score">${awayTeamScore}</td>
						</tr>
					</tbody>
				</table>
				<div class="match-action-wrapper">
					${btnAction()}
				</div>
			</div>`;
		});

		if (matchesHtml === ``) matchesHtml = displayError('No Data');
		document.getElementById('_pertandingan').innerHTML = matchesHtml;
		M.AutoInit();
		document.querySelectorAll('.add_match').forEach(elm => {
			elm.addEventListener('click', function () {
				showModalAlert();
				getMatch(this.dataset.id).then(response => {
					add('matches', response.match).then((response) =>
						displayAlertMessage({
							status: response.status,
							title: 'Berhasil Disimpan',
							message: 'Berhasil Menyimpan Jadwal Pertandingan'
						}, renderMatches)
					).catch(response =>
						displayAlertMessage({
							status: response.status,
							title: 'Berhasil Disimpan',
							message: 'Berhasil Menyimpan Jadwal Pertandingan'
						})
					)
				}).catch(error =>
					displayAlertMessage({
						status: 'failed',
						title: 'Gagal Disimpan',
						message: 'Gagal Menyimpan Jadwal Pertandingan ' + error
					}));;
			});
		});
	}).catch(error => {
		document.getElementById('_pertandingan').innerHTML = displayError(error);
	});
}

function renderTeamDetails() {
	document.querySelectorAll('.detail_team_btn').forEach(elm => {
		elm.addEventListener('click', function () {
			const wrapperElement = document.querySelector('.team-details');
			wrapperElement.innerHTML = `
			<div class="progress" style="margin-top: 25%;">
				<div class="indeterminate"></div>
			</div>
			`;
			getTeam(this.dataset.id).then(team => {
				wrapperElement.innerHTML = `
				<h4>${team.shortName}</h4>
				<div class="row">
					<div class="col s12 m5">
						<img src="${toHttps(team.crestUrl)}" onerror="this.onerror=null;this.src='img/404.png';">
					</div>
					<div class="col s12 m7">
						<table class="team-table">
							<tbody>
								<tr>
									<td><b>Name</b></td>
									<td>${team.name}</td>
								</tr>
									<tr>
										<td><b>Founded</b></td>
										<td>${team.founded}</td>
									</tr>
									<tr>
										<td><b>Country</b></td>
										<td>${team.area.name}</td>
									</tr>
									<tr>
										<td><b>Stadion</b></td>
										<td>${team.venue}</td>
									</tr>
									<tr>
										<td><b>Website</b></td>
										<td><a href="${team.website}" target="blank">${team.website}</a></td>
									</tr>
									<tr>
										<td><b>Email</b></td>
										<td>${team.email}</td>
									</tr>
									<tr>
										<td><b>Phone</b></td>
										<td>${team.phone}</td>
									</tr>
									<tr>
										<td><b>Address</b></td>
										<td>${team.address}</td>
									</tr>
							</tbody>
						</table>
					</div>
				</div>`;
			}).catch(error => {
				wrapperElement.innerHTML = displayError(error);
			});
		});
	});
}

function renderSavedTeams() {
	const wrapperElement = document.getElementById('favorites_teams');
	const btnDeleteAll = document.getElementById('delete_all_teams');
	wrapperElement.innerHTML = displayLoading();
	getAll('teams').then(response => {
		let teamsHtml = ``;
		response.forEach(team => {
			teamsHtml += `
			<div class="col s6 m4 l2">
				<div class="card team_card" style="position: relative">
					<div class="delete_team tooltipped" data-position="top" data-id="${team.id}" data-tooltip="Hapus Tim Favorit">     
						<i class="small material-icons">delete_forever</i>
					</div>
					<div class="card-image">
						<img src="${toHttps(team.crestUrl)}" alt="" onerror="this.onerror=null;this.src='img/404.png';">
					</div>
					<div class="card-content">
						<p>${team.shortName}</p>
						<p style="margin-top: 5px"><b>Est.</b> ${team.founded}</p>
					</div>
					<a href="#modal" class="modal-trigger detail_team_btn" data-id="${team.id}">
						<div class="detail_btn">     
							<i class="small material-icons">remove_red_eye</i>
						</div>
					</a>
				</div>
			</div>`;
		});
		wrapperElement.innerHTML = teamsHtml;
		M.AutoInit();
		renderTeamDetails();

		// hapus tim
		document.querySelectorAll('.delete_team').forEach(elm => {
			elm.addEventListener('click', function () {
				showModalAlert();
				destroy('teams', Number(this.dataset.id)).then(response =>
					displayAlertMessage({
						status: response.status,
						title: 'Berhasil Dihapus',
						message: 'Berhasil Menghapus Tim Favorit Yang Dipilih'
					}, renderSavedTeams)
				).catch(response =>
					displayAlertMessage({
						status: response.status,
						title: 'Berhasil Dihapus',
						message: 'Berhasil Menghapus Tim Favorit Yang Dipilih'
					}));
			});
		});

		//hapus semua tim
		btnDeleteAll.addEventListener('click', () => {
			showModalAlert();
			destroy('teams').then(response =>
				displayAlertMessage({
					status: response.status,
					title: 'Berhasil Dihapus',
					message: 'Berhasil Menghapus Semua Tim Favorit'
				}, renderSavedTeams)
			).catch(() =>
				displayAlertMessage({
					status: response.status,
					title: 'Gagal Dihapus',
					message: 'Gagal Menghapus Semua Tim Favorit'
				}));
		});

	}).catch(error => {
		btnDeleteAll.setAttribute('disabled', true);
		wrapperElement.innerHTML = displayError(error);
	});
}

function renderSavedMacthes() {
	const wrapperElement = document.getElementById('saved_matches');
	const btnDeleteAll = document.getElementById('delete_all_matches');
	wrapperElement.innerHTML = displayLoading();
	getAll('matches').then(response => {
		let matchesHtml = ``;
		response.forEach(match => {
			const homeTeamScore = match.score.fullTime.homeTeam != null ? match.score.fullTime.homeTeam : '';
			const awayTeamScore = match.score.fullTime.awayTeam != null ? match.score.fullTime.awayTeam : '';
			const date = new Date(Date.parse(match.utcDate)).toLocaleString('en-US', { timeZone: 'UTC' });
			matchesHtml += `
			<div class="col s12 m6 l6 match_wrapper" style="margin-bottom: 20px">
				<div>
					<div><i class="tiny material-icons">access_time</i>&nbsp; &nbsp;${date}</div>
					<div>${match.status}</div>
				</div>
				<table>
					<tbody>
						<tr>
							<td>${match.homeTeam.name}</td>
							<td class="score">${homeTeamScore}</td>
						</tr>
						<tr>
							<td>${match.awayTeam.name}</td>
							<td class="score">${awayTeamScore}</td>
						</tr>
					</tbody>
				</table>
				<div class="match-action-wrapper">
					<button class="delete_match tooltipped" data-position="top" data-tooltip="Hapus Pertandingan" data-id="${match.id}"><i class="material-icons">delete_forever</i></button>
				</div>
			</div>`;
		});
		wrapperElement.innerHTML = matchesHtml;
		M.AutoInit();

		// hapus pertandingan
		document.querySelectorAll('.delete_match').forEach(elm => {
			elm.addEventListener('click', function () {
				showModalAlert();
				destroy('matches', Number(this.dataset.id)).then(response =>
					displayAlertMessage({
						status: response.status,
						title: 'Berhasil Dihapus',
						message: 'Berhasil Menghapus Jadwal Pertandingan Yang Dipilih'
					}, renderSavedMacthes)
				).catch(() =>
					displayAlertMessage({
						status: response.status,
						title: 'Gagal Dihapus',
						message: 'Gagal Menghapus Jadwal Pertandingan Yang Dipilih'
					}));
			});
		});

		//hapus semua pertandingan
		btnDeleteAll.addEventListener('click', () => {
			showModalAlert();
			destroy('matches').then(response => {
				console.log(response)
				displayAlertMessage({
					status: response.status,
					title: 'Berhasil Dihapus',
					message: 'Berhasil Menghapus Semua Jadwal Pertandingan'
				}, renderSavedMacthes)
			}).catch(() =>
				displayAlertMessage({
					status: response.status,
					title: 'Gagal Dihapus',
					message: 'Gagal Menghapus Semua Jadwal Pertandingan'
				}))
		});
	}).catch(error => {
		btnDeleteAll.setAttribute('disabled', true);
		wrapperElement.innerHTML = displayError(error);
	});
}

function getFileName(url) {
	if (url) {
		var m = url.toString().match(/.*\/(.+?)\./);
		if (m && m.length > 1) {
			return m[1];
		}
	}
	return '';
}

function urlBase64ToUint8Array(base64String) {
	const padding = '='.repeat((4 - base64String.length % 4) % 4);
	const base64 = (base64String + padding)
		.replace(/-/g, '+')
		.replace(/_/g, '/');
	const rawData = window.atob(base64);
	let outputArray = new Uint8Array(rawData.length);
	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

function displayError(error) {
	return `
	<div class="error_wrapper">
		<h6>${error}</h6>
		<p><a href="index.html">Back To Home</a> OR <a href="">Refresh</a></p>
	</div>`;
}

function displayLoading() {
	return `
	<div class="loading_wrapper">	
		<div class="preloader-wrapper active">
			<div class="spinner-layer spinner-blue-only">
				<div class="circle-clipper left">
					<div class="circle"></div>
				</div><div class="gap-patch">
					<div class="circle"></div>
				</div><div class="circle-clipper right">
					<div class="circle"></div>
				</div>
			</div>            
		</div>
	</div>`;
}

function displayAlertMessage(data, callback) {
	const modalElement = document.getElementById('modal_alert');
	modalElement.innerHTML = `
		<div class="modal-content">
			<h4 style="font-weight: 500">${data.title}</h4>
			<p>${data.message}</p>
		</div>  
		<div class="modal-footer">
			<a href="#!" id="close_modal" class="modal-close waves-effect ${data.status == 'success' ? 'blue accent-2' : 'red darken-2 '} white-text btn-flat">Oke</a>
		</div>`;
	document.getElementById('close_modal').addEventListener('click', () => {
		callback();
	});
}

function showModalAlert() {
	const modalElement = document.getElementById('modal_alert');
	modalElement.innerHTML = `
	<div class="modal-content modal-loading">
		<div class="preloader-wrapper active">
			<div class="spinner-layer spinner-blue">
			<div class="circle-clipper left">
				<div class="circle"></div>
			</div><div class="gap-patch">
				<div class="circle"></div>
			</div><div class="circle-clipper right">
				<div class="circle"></div>
			</div>
			</div>
		</div>
		<div>
			<p>Tunggu Sebentar...</p>
		</div>
	</div>`;
	M.Modal.init(modalElement, { dismissible: false, preventScrolling: false }).open();
}

function toHttps(url) {
	if (url) {
		url = url.replace(/^http:\/\//i, 'https://');
		return url;
	}
	return 'img/404.png';
}