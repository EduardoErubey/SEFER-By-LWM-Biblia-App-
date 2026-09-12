// SEFER — registro de versiones bíblicas
window.SEFER_BIBLE_VERSIONS = {
  rv1960:  { id:'rv1960',  label:'Reina-Valera 1960', short:'RV1960',  group:'Reina Valera', default:true  },
  rv1909:  { id:'rv1909',  label:'Reina-Valera 1909', short:'RV1909',  group:'Reina Valera', default:false },
  rva2015: { id:'rva2015', label:'Reina Valera Actualizada 2015', short:'RVA2015', group:'Reina Valera', default:false },
  nvi:     { id:'nvi',     label:'Nueva Versión Internacional (Español latino)', short:'NVI', group:'NVI', default:false },
  ntv:     { id:'ntv',     label:'Nueva Traducción Viviente', short:'NTV', group:'NTV', default:false },
  tla:     { id:'tla',     label:'Traducción en Lenguaje Actual', short:'TLA', group:'TLA', default:false }
};
window.SEFER_GET_BIBLE = function(versionId){
  var id = (versionId || 'rv1960').toLowerCase();
  var map = {
    rv1960: window.BIBLE_DATA_RV1960,
    rv1909: window.BIBLE_DATA_RV1909,
    nvi: window.BIBLE_DATA_NVI,
    ntv: window.BIBLE_DATA_NTV,
    tla: window.BIBLE_DATA_TLA,
    rva2015: window.BIBLE_DATA_RVA2015
  };
  return map[id] || window.BIBLE_DATA_RV1960 || window.BIBLE_DATA || {};
};
