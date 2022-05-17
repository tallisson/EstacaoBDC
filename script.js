const createUrl = () => {
  const urlBase = 'https://api.ecowitt.net/api/v3/device/real_time?';
  const appKey = 'application_key=C8F4FB6018C47C4331D9F1AEB765AB68';
  const apiKey ='api_key=bb7008ec-9fb1-44ca-b8be-46387b40b46b'
  const mac ='mac=C4:5B:BE:6E:51:D1';
  const cb ='call_back=all'
  const tmpUnit = 'temp_unitid=1';
  const pUnit = 'pressure_unitid=5'
  const wSpeed = 'wind_speed_unitid=7';
  const finalUrl = `${urlBase}${appKey}&${apiKey}&${mac}&${cb}&${tmpUnit}&${pUnit}&${wSpeed}`;
  return finalUrl;
}

const fillOutdoorTable = ({ outdoor }) => {
  const tbody = document.querySelector('#table-outdoor tbody');
  tbody.innerHTML = `
    <tr>
      <td>${outdoor.temperature.value} ºC</td>
      <td>${outdoor.feels_like.value} ºC</td>
      <td>${outdoor.humidity.value} %</td>
      <td>${outdoor.dew_point.value} ºC</td>
    </tr>
  `;
}

const fillIndoorTable = ({ indoor }) => {
  const tbody = document.querySelector('#table-indoor tbody');
  tbody.innerHTML = `
    <tr>
      <td>${indoor.temperature.value} ºC</td>
      <td>${indoor.humidity.value} %</td>
    </tr>
  `;
}

const fillSolarAndUviTable = ({ solar_and_uvi }) => {
  const tbody = document.querySelector('#table-solar-uvi tbody');
  tbody.innerHTML = `
    <tr>
      <td>
        ${solar_and_uvi.solar.value} 
        w/m<sup>2</sup>
      </td>
      <td>${solar_and_uvi.uvi.value} %</td>
    </tr>
  `;
}

const fillWindTable = ({ wind }) => {
  const tbody = document.querySelector('#table-wind tbody');
  const { wind_direction, wind_gust, wind_speed } = wind;
  tbody.innerHTML = `
    <tr>
      <td>${wind_direction.value}&deg;</td>      
      <td>${wind_speed.value} km/h</td>
      <td>${wind_gust.value} km/h</td>
    </tr>
  `;
}

const fillPressureTable = ({ pressure }) => {
  const tbody = document.querySelector('#table-pressure tbody');
  const { absolute, relative } = pressure;
  tbody.innerHTML = `
    <tr>
      <td>${absolute.value} mmHg</td>      
      <td>${relative.value} mmHg</td>
    </tr>
  `;
}

const fillTables = (data) => {
  fillOutdoorTable(data);
  fillIndoorTable(data);
  fillSolarAndUviTable(data);
  fillWindTable(data);
  fillPressureTable(data);
}

const setLastUpdate = () => {
  const dateHour = new Date();
  
  let hour = dateHour.getHours();
  hour = hour > 9 ? hour : `0{hour}`;
  let minutes = dateHour.getMinutes();
  minutes = minutes > 9 ? minutes : `0${minutes}`;

  const hourP = `Última atualização às ${hour}:${minutes}`;
  const lastUpdateP = document.querySelector('#last-update span');
  lastUpdateP.innerHTML = `<i>&#9729;</i> 
    ${hourP}`;
}

const getData = (url) => {
  fetch(url())
    .then((response) => {
      return response.json();
    })
    .then((datas) => {   
      const data = datas.data;
      fillTables(data);
      setLastUpdate();
    })
    .catch((error) => {
      console.log(error);
    });
}

(() => {
  getData(createUrl)
  setInterval(() => getData(createUrl), 1000 * 50);
})();