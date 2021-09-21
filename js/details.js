let json;

let baseUrl = (window.location).search;
let id = baseUrl.substring(baseUrl.lastIndexOf('=') + 1);

fetch('https://www.wiewarm.ch:443/api/v1/bad.json/' + id)
  .then(res => res.json())
  .then(data => json = data)
  .then(appendBeckenlisteToHtmlTable)

function appendBeckenlisteToHtmlTable() {
  let badname = json['badname'];
  let badOrt = json['ort'];
  let badPreis = json['preise'].replaceAll(/(\n)+/g, '<br />');
  let badAdresse = json['adresse2'];
  let badPLZ = json['plz'];

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
  const becken = json['becken'];
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
