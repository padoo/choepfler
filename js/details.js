let json;
let badname = '';
let badOrt = '';

let baseUrl = (window.location).search;
let id = baseUrl.substring(baseUrl.lastIndexOf('=') + 1);

fetch('https://www.wiewarm.ch:443/api/v1/bad.json/'+id)
  .then(res => res.json())
  .then(data => json = data)
  .then(appendBeckenlisteToHtmlTable)


function appendBeckenlisteToHtmlTable(){
  badname = json['badname'];
  badOrt = json['ort'];
  $("#badname").html(badname + ' ' + badOrt);

  const beckenliste = [];
  const becken = json['becken'];
  for (const [key, value] of Object.entries(becken)) {
    const beckendetails = {
      beckenname: value.beckenname,
      temperatur: value.temp
    };
    beckenliste.push(beckendetails);
  }


  beckenliste.forEach(function (becken) {
    $('#beckenListe').append(`
    <tr>
      <th scope="row">${becken.beckenname}</th>
      <td>${becken.temperatur} °C</td>
    </tr>
    `)
  });
}
