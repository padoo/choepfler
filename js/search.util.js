async function getSearchResult(searchString) {
  try {
    const response = await fetch('https://www.wiewarm.ch:443/api/v1/bad.json?search=' + searchString);
    return await response.json();
  } catch (e) {
    return Promise.resolve([]);
  }
}

async function getAllBecken() {
  try {
    const response = await fetch('https://www.wiewarm.ch:443/api/v1/temperature/all_current.json/0');
    return await response.json();
  } catch (e) {
    return Promise.resolve([]);
  }
}

async function badiOverviewInformationForKanton(kanton) {
  const becken = await getAllBecken();
  const beckenImKanton = becken.filter(b => b.kanton.toUpperCase() === kanton.toUpperCase());
  const einBeckenProBadi = [];

  beckenImKanton.forEach(b1 => {
    if (!einBeckenProBadi.find(b2 => b1.badid === b2.badid)) {
      einBeckenProBadi.push(b1);
    }
  });

  einBeckenProBadi.sort((a, b) => a.ort === b.ort ? 0 : a.ort < b.ort ? -1 : 1);

  return await Promise.all(einBeckenProBadi.map(async function (becken) {
    const badiInfo = {};
    badiInfo.name = becken['bad'];
    badiInfo.ort = becken['ort'];
    badiInfo.id = becken['badid'];
    badiInfo.bildUrl = await getBadiPicture(badiInfo.id);
    return badiInfo;
  }));
}

async function badiOverviewInformation(data) {
  return await Promise.all(data.map(async function (badi) {
      const badiInfo = {};
      badiInfo.name = badi['badname'];
      badiInfo.ort = badi['ort'];
      badiInfo.id = badi['badid'];
      badiInfo.bildUrl = await getBadiPicture(badiInfo.id);
      return badiInfo;
    }
  ));
}

async function getBadiPicture(badId) {
  const response = await fetch('https://www.wiewarm.ch:443/api/v1/image.json/' + badId);
  const data = await response.json();
  let bildUrl = "https://www.bern.com/assets/images/1/marzili_03-7ece01a1.jpg";
  if (data.length > 0) {
    let imageUrl = data[0].image;
    bildUrl = "https://www.wiewarm.ch/" + imageUrl;
  }
  return bildUrl;
}

function update_list(suchergebnisse, jqueryId = '#badiliste') {
  $(jqueryId).empty();
  if (suchergebnisse.length === 0) {
    $(jqueryId).append(`<p>Keine Badi gefunden.</p>`);
    return;
  }

  suchergebnisse.forEach(function (suchergebnis) {
    $(jqueryId).append(`
<a href="details?id=${suchergebnis.id}" class="hiddenlink">
  <div class="card mb-3">
    <div class="card-body">
      <div class="col-md-6">
        <div class="container">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 py-2">
              <div class="d-flex">
                <img src="${suchergebnis.bildUrl}" class="img-fluid">
              </div>
            </div>
            <div class="align-middle col-sm-12 col-md-6 col-lg-6 py-2">
              <div class="text-center">
                <h5>${suchergebnis.name}</h5>
                <p>${suchergebnis.ort}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</a>
    `)
  });
}

export {getSearchResult, badiOverviewInformation, badiOverviewInformationForKanton, getBadiPicture, update_list};
