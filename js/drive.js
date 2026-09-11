/* SEFER module: drive.js — script clásico (sin import/export) */

/* --- SEFER drive.js lines 4795-5039 --- */
/* =========================================================
   GOOGLE DRIVE — appDataFolder (solo CLIENT_ID en frontend)
   NUNCA pongas el client_secret en código del navegador.
   ========================================================= */
const GDRIVE_CLIENT_ID = '393493986978-kfkbq0k64uhjed43q9tbg8ivpn6sv2n1.apps.googleusercontent.com';
const GDRIVE_SCOPES = 'https://www.googleapis.com/auth/drive.appdata openid email profile';
const GDRIVE_DISCOVERY = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const GDRIVE_FILE_NAME = 'sefer_datos_biblia.json';

let gdriveTokenClient = null;
let gapiReady = false;
let gisReady = false;
let gdriveFileId = null;
let driveSaveTimer = null;

function setNubeStatus(msg){
  // feedback solo en tooltip del botón (sin texto visible al lado)
  const btn = document.getElementById('btn-login-google');
  if(btn && msg){
    btn.title = msg;
    btn.setAttribute('data-tooltip', msg);
  }
  const el = document.getElementById('estado-nube');
  if(el) el.textContent = '';
}

function gapiLoaded(){
  if(typeof gapi === 'undefined') return;
  gapi.load('client', async ()=>{
    try{
      await gapi.client.init({ discoveryDocs: [GDRIVE_DISCOVERY] });
      gapiReady = true;
      maybeEnableDriveBtn();
    }catch(e){ console.error('GAPI init', e); setNubeStatus('Error GAPI'); }
  });
}
function gisLoaded(){
  if(typeof google === 'undefined' || !google.accounts) return;
  gdriveTokenClient = google.accounts.oauth2.initTokenClient({
    client_id: GDRIVE_CLIENT_ID,
    scope: GDRIVE_SCOPES,
    callback: ()=>{},
  });
  gisReady = true;
  maybeEnableDriveBtn();
}
function maybeEnableDriveBtn(){
  if(gapiReady && gisReady) setNubeStatus('Nube lista');
}

function collectLocalData(){
  // reunir plan progreso
  const plan = {};
  for(let i=0;i<localStorage.length;i++){
    const k = localStorage.key(i);
    if(k && k.startsWith('plan_')) plan[k] = localStorage.getItem(k);
  }
  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    favorites: store.get('bp_favorites', store.get('bp_highlights', {})),
    notes: store.get('bp_notes', {}),
    meanings: store.get('bp_meanings', store.get('bp_saved_meanings', {})),
    customSermons: store.get('bp_custom_sermons', []),
    theme: store.get('bp_theme', 'mexico'),
    planMode: store.get('bp_plan_mode', 'calendar'),
    planStart: store.get('bp_plan_start', null),
    planOrder: store.get('bp_plan_order', 'canonical'),
    achievements: achState,
    googleProfile: googleProfile,
    plan
  };
}

function applyCloudData(data){
  if(!data || typeof data !== 'object') return;
  if(data.favorites){ favorites = data.favorites; saveFavorites(); }
  if(data.notes){ notes = data.notes; saveNotes(); }
  if(data.meanings){
    try{
      if(typeof savedMeanings !== 'undefined'){
        Object.assign(savedMeanings, data.meanings);
        if(typeof saveMeaningsStore === 'function') saveMeaningsStore();
      } else {
        store.set('bp_meanings', data.meanings);
      }
    }catch(e){}
  }
  if(data.theme && VALID_THEMES.includes(data.theme)){
    currentTheme = data.theme;
    document.body.setAttribute('data-theme', currentTheme);
    store.set('bp_theme', currentTheme);
    document.querySelectorAll('.theme-dot').forEach(d=> d.classList.toggle('active', d.dataset.t===currentTheme));
    try{ applyThemeIcons(); }catch(e){}
  }
  if(data.planMode){ store.set('bp_plan_mode', data.planMode); planMode = data.planMode; }
  if(data.planStart){ store.set('bp_plan_start', data.planStart); planStartDate = data.planStart; }
  if(data.planOrder){
    planOrder = data.planOrder;
    store.set('bp_plan_order', planOrder);
    PLAN_ANUAL = buildPlanByOrder(planOrder);
  }
  if(data.achievements && typeof data.achievements === 'object'){
    achState = data.achievements;
    store.set('bp_achievements', achState);
  }
  if(data.googleProfile){ googleProfile = data.googleProfile; saveGoogleProfile(); }
  if(data.plan && typeof data.plan === 'object'){
    Object.keys(data.plan).forEach(k=> localStorage.setItem(k, data.plan[k]));
  }
  if(typeof renderReader === 'function' && !showWelcome) renderReader();
}

async function findOrCreateDriveFile(){
  const list = await gapi.client.drive.files.list({
    spaces: 'appDataFolder',
    fields: 'files(id, name)',
    pageSize: 20,
    q: `name='${GDRIVE_FILE_NAME}'`
  });
  const files = (list.result && list.result.files) || [];
  if(files.length){
    gdriveFileId = files[0].id;
    return gdriveFileId;
  }
  // crear
  const boundary = 'sefer_boundary';
  const meta = { name: GDRIVE_FILE_NAME, parents: ['appDataFolder'] };
  const content = JSON.stringify(collectLocalData());
  const body =
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n` +
    JSON.stringify(meta) + `\r\n` +
    `--${boundary}\r\nContent-Type: application/json\r\n\r\n` +
    content + `\r\n` +
    `--${boundary}--`;
  const res = await gapi.client.request({
    path: '/upload/drive/v3/files',
    method: 'POST',
    params: { uploadType: 'multipart' },
    headers: { 'Content-Type': `multipart/related; boundary=${boundary}` },
    body
  });
  gdriveFileId = res.result.id;
  return gdriveFileId;
}

async function loadFromDrive(){
  setNubeStatus('Sincronizando…');
  await findOrCreateDriveFile();
  const res = await gapi.client.drive.files.get({
    fileId: gdriveFileId,
    alt: 'media'
  });
  // gapi may return body as string or result
  let data = res.result;
  if(typeof res.body === 'string' && res.body){
    try{ data = JSON.parse(res.body); }catch(e){ data = res.result; }
  }
  if(data && data.version){
    applyCloudData(data);
    setNubeStatus('✅ Sincronizado');
    try{ if(typeof setAchProgress==='function') setAchProgress('cloud_1', 1); }catch(e){}
    try{ if(typeof fetchGoogleProfile==='function') fetchGoogleProfile(); }catch(e){}
  } else {
    // archivo vacío o nuevo: subir local
    await saveToDrive();
    setNubeStatus('✅ Nube lista');
  }
}

async function saveToDrive(){
  if(!gapi.client.getToken()) return;
  try{
    if(!gdriveFileId) await findOrCreateDriveFile();
    const content = JSON.stringify(collectLocalData());
    await gapi.client.request({
      path: `/upload/drive/v3/files/${gdriveFileId}`,
      method: 'PATCH',
      params: { uploadType: 'media' },
      headers: { 'Content-Type': 'application/json' },
      body: content
    });
    setNubeStatus('✅ Guardado en Drive');
    try{ if(typeof setAchProgress==='function') setAchProgress('cloud_1', 1); }catch(e){}
  }catch(e){
    console.error('saveToDrive', e);
    setNubeStatus('Error al guardar');
  }
}

function scheduleDriveSave(){
  if(!gapi.client || !gapi.client.getToken()) return;
  clearTimeout(driveSaveTimer);
  driveSaveTimer = setTimeout(()=> saveToDrive(), 1500);
}

function handleGoogleLogin(){
  if(!gdriveTokenClient){
    setNubeStatus('Cargando Google…');
    gisLoaded(); gapiLoaded();
    setTimeout(handleGoogleLogin, 800);
    return;
  }
  gdriveTokenClient.callback = async (resp)=>{
    if(resp.error){
      console.error(resp);
      setNubeStatus('Login cancelado');
      return;
    }
    const btn = document.getElementById('btn-login-google');
    if(btn){ btn.title = 'Conectado a Google Drive — clic para sincronizar'; btn.setAttribute('data-tooltip', 'Conectado · clic para sincronizar'); }
    try{
      if(typeof fetchGoogleProfile==='function') await fetchGoogleProfile();
      if(typeof setAchProgress==='function') setAchProgress('cloud_1', 1);
      await loadFromDrive();
    }catch(e){
      console.error(e);
      setNubeStatus('Error Drive');
    }
  };
  // consent para pedir también perfil/email si aún no están
  gdriveTokenClient.requestAccessToken({ prompt: 'consent' });
}

document.getElementById('btn-login-google')?.addEventListener('click', handleGoogleLogin);

// Inicializar APIs cuando estén disponibles
function bootGoogle(){
  if(typeof gapi !== 'undefined') gapiLoaded();
  if(typeof google !== 'undefined' && google.accounts) gisLoaded();
}
bootGoogle();
setTimeout(bootGoogle, 1000);
setTimeout(bootGoogle, 2500);

// Auto-guardar en Drive cuando cambian favoritos/notas (si conectado)
const _origSaveFavorites = typeof saveFavorites === 'function' ? saveFavorites : null;
const _origSaveNotes = typeof saveNotes === 'function' ? saveNotes : null;
if(_origSaveFavorites){
  window.saveFavorites = function(){ _origSaveFavorites(); scheduleDriveSave(); };
}
if(_origSaveNotes){
  window.saveNotes = function(){ _origSaveNotes(); scheduleDriveSave(); };
}

