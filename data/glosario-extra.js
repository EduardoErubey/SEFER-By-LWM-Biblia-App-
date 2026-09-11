/* SEFER data — glosario-extra.js (extraído de index.html, sin cambios de lógica) */
const GLOSARIO_EXTRA = [
  {palabra:'Contumaz', definicion:'Obstinado, rebelde, que se resiste con dureza a corregirse o a obedecer a Dios.'},
  {palabra:'Dura cerviz', definicion:'Expresión bíblica para describir a alguien tercamente rebelde, que no se somete a Dios (como un animal que no acepta el yugo).'},
  {palabra:'Cuitado', definicion:'Afligido, angustiado, lleno de pena o dificultad.'},
  {palabra:'Tardo', definicion:'Lento, pesado para entender o para actuar; en la Biblia a veces se dice «tardo para oír» o «tardos de corazón».'},
  {palabra:'Inicuo', definicion:'Malvado, injusto, que practica la iniquidad (el pecado y la maldad).'},
  {palabra:'Vil', definicion:'Despreciable, de poco valor moral; persona o acción degradada.'},
  {palabra:'Prevaricador', definicion:'Quien se desvía de la rectitud o de la ley de Dios; traiciona lo correcto.'},
  {palabra:'Perverso', definicion:'Corrompido, torcido en su camino; contrario a lo bueno y justo.'},
  {palabra:'Réprobo', definicion:'Rechazado o desaprobado; en sentido bíblico, quien se endurece y no aprueba retener a Dios en su conocimiento.'},
  {palabra:'Fementido', definicion:'Falso, traidor, que falta a la fe o a la palabra dada.'},
  {palabra:'Altivo', definicion:'Orgulloso, arrogante, que se ensalza a sí mismo.'},
  {palabra:'Lisonjero', definicion:'Que adula o halaga con palabras falsas para ganar favor (a veces escrito «lisongero» en textos antiguos).'},
  {palabra:'Lisongero', definicion:'Forma antigua de «lisonjero»: adulador, que halaga con engaño.'},
  {palabra:'Fatuo', definicion:'Necio, vano, sin juicio; persona superficial o insensata.'},
  {palabra:'Escarnecedor', definicion:'Quien se burla, ridiculiza o desprecia lo sagrado o a los justos.'},
  {palabra:'Impío', definicion:'Sin temor de Dios; irreverente, que vive lejos de la piedad y de la obediencia a Dios.'},
  {palabra:'Gracia', definicion:'Favor inmerecido otorgado por Dios al pecador.'},
  {palabra:'Redención', definicion:'Rescate pagado para liberar; el sacrificio de Cristo nos redime.'},
  {palabra:'Justificación', definicion:'Acto por el cual Dios declara justo al que cree en Jesús.'},
  {palabra:'Santificación', definicion:'Proceso de ser apartados para Dios y transformados a su imagen.'},
  {palabra:'Fe', definicion:'Confianza en Dios y en su Palabra; instrumento para recibir la salvación.'},
  {palabra:'Arrepentimiento', definicion:'Cambio de mente y corazón que aparta del pecado hacia Dios.'},
  {palabra:'Pacto', definicion:'Alianza solemne de Dios con su pueblo (Antiguo y Nuevo Pacto).'},
  {palabra:'Evangelio', definicion:'Buenas noticias de salvación por la muerte y resurrección de Cristo.'},
  {palabra:'Iglesia', definicion:'Asamblea de los redimidos; cuerpo de Cristo en la tierra.'},
  {palabra:'Reino de Dios', definicion:'Señorío de Dios; presente en Cristo y consumado en su venida.'},
  {palabra:'Diácono', definicion:'Servidor de la iglesia. En el Nuevo Testamento, los diáconos atienden necesidades prácticas de la congregación (comida, ayuda a viudas y necesitados) para que los apóstoles o ancianos puedan dedicarse a la oración y a la Palabra (Hechos 6; 1 Timoteo 3:8-13). Viene del griego diákonos, «servidor» o «ministro».'},
  {palabra:'Diáconos', definicion:'Plural de diácono: servidores de la iglesia encargados del servicio práctico en la congregación (Hechos 6; 1 Timoteo 3:8-13).'},
];
function buildGlosarioList(){
  const list = [...GLOSARIO_EXTRA];
  if(typeof DICTIONARY === 'object' && DICTIONARY){
    Object.keys(DICTIONARY).forEach(k=>{
      if(!list.some(x=>x.palabra.toLowerCase()===k.toLowerCase())){
        list.push({palabra: k.charAt(0).toUpperCase()+k.slice(1), definicion: DICTIONARY[k]});
      }
    });
  }
  list.sort((a,b)=>a.palabra.localeCompare(b.palabra,'es'));
  return list;
}
window.GLOSARIO_EXTRA = GLOSARIO_EXTRA;
window.buildGlosarioList = buildGlosarioList;
