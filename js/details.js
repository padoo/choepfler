import {getBadiPicture} from "./search.util.js";
import {addFavoriteBadi, deleteFavoriteBadi, isFavorite} from "./util.js";

function appendBeckenlisteToHtmlTable(data) {
  let badname = data['badname'];
  let badOrt = data['ort'];
  let badPreis = data['preise'].replaceAll(/(\n)+/g, '<br />');
  let badAdresse = data['adresse2'];
  let badPLZ = data['plz'];

  $("#badname").html(badname + ' ' + badOrt);

  let preis = '';
  if (badPreis.length > 0) {
    preis += badPreis;
  } else
    preis = 'Keine Angaben vorhanden.'

  $("#badpreise").html(preis);

  let adresse = `<p>${badname} <br>`;
  if (badAdresse.length > 0) {
    adresse += `${badAdresse} <br>`;
  }
  adresse += `${badPLZ} ${badOrt}</p>`

  $('#badAdresse').append(adresse);

  const beckenliste = [];
  const becken = data['becken'];
  for (const [key, value] of Object.entries(becken)) {
    const beckendetails = {
      beckenname: value.beckenname,
      temperatur: value.temp,
      dateLastUpdate: new Date(value.date)
    };
    beckenliste.push(beckendetails);
  }

  beckenliste.forEach(function (becken) {
    $('#beckenListe').append(`
    <tr>
      <th scope="row">${becken.beckenname}</th>
      <td>${becken.temperatur} °C </td>
      <td>${becken.dateLastUpdate.toLocaleString()}</td>
    </tr>
    `)
  });
}


const baseUrl = (window.location).search;
const id = parseInt(baseUrl.substring(baseUrl.lastIndexOf('=') + 1));

const response = await fetch('https://www.wiewarm.ch:443/api/v1/bad.json/' + id);
const data = await response.json();
appendBeckenlisteToHtmlTable(data);

const badiInfo = {
  bildUrl: await getBadiPicture(id),
  id: id,
  name: data.badname,
  ort: data.ort
};

let isFav = isFavorite(badiInfo);

if (isFav) {
  $('#favorit').html('<h3><i class="bi-star-fill text-warning"></i></h3>');
}

$('#favorit').click(function (event) {
  event.preventDefault();
  if (isFav) {
    isFav = false;
    deleteFavoriteBadi(badiInfo);
    $('#favorit').html('<h3><i class="bi-star text-warning"></i></h3>');
  } else {
    isFav = true;
    addFavoriteBadi(badiInfo);
    $('#favorit').html('<h3><i class="bi-star-fill text-warning"></i></h3>');
  }
})
