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

const transformInToMM = (inchValue) => {
  const factor = 25.4;
  const mmValue = parseFloat(inchValue * factor).toFixed(1);
  return mmValue;
}

const fillRainfall = ({ rainfall }) => {
  const { daily, event, hourly, monthly, rain_rate, weekly, yearly } = rainfall;
  const divDailyRain = document.getElementsByClassName('daily-rain')[0];
  divDailyRain.innerHTML = `
    <div>
      <p><strong>Taxa/hr (mm)</strong></p>
      <p style="font-size: 110%">${transformInToMM(rain_rate.value)}</p>
    </div>
    <div>
      <p><strong>Diária (mm)</strong></p>
      <p style="font-size: 110%;">${transformInToMM(daily.value)}</p>
    </div>
  `;

  const divDataRain = document.getElementsByClassName('data-rain')[0];
  divDataRain.innerHTML = `
    <div>
      <ul type="none">
        <li><strong>Agora:</strong> ${transformInToMM(event.value)} mm</li>
        <li><strong>Por Hora:</strong> ${transformInToMM(hourly.value)} mm</li>
        <li><strong>Semanal:</strong> ${transformInToMM(weekly.value)} mm</li>
        <li><strong>Mensal:</strong> ${transformInToMM(monthly.value)} mm</li>
        <li><strong>Anual:</strong> ${transformInToMM(yearly.value)} mm</li>
      </ul>
    </div>
  `;
}

const fillDatas = (data) => {
  fillOutdoorTable(data);
  fillIndoorTable(data);
  fillSolarAndUviTable(data);
  fillWindTable(data);
  fillPressureTable(data);
  fillRainfall(data);
}

const setLastUpdate = () => {
  const dateHour = new Date();
  
  let hour = dateHour.getHours();
  hour = hour > 9 ? hour : `0${hour}`;
  let minutes = dateHour.getMinutes();
  minutes = minutes > 9 ? minutes : `0${minutes}`;

  const hourP = `Última atualização às ${hour}:${minutes}`;
  const lastUpdateP = document.querySelector('#last-update span');
  lastUpdateP.innerHTML = `<i>&#9729;</i> 
    ${hourP}`;
}

const toggleMain = () => {
  const loader = document.getElementsByClassName('content')[0];
  if(!loader.classList.contains('content-hidden')) {
    loader.classList.add('content-hidden');
  } else {
    loader.classList.remove('content-hidden');
  }
}

const toggleFLoader = () => {
  const loader = document.getElementsByClassName('f-loader')[0];
  if(!loader.classList.contains('f-loader-hidden')) {
    loader.classList.add('f-loader-hidden');
  } else {
    loader.classList.remove('f-loader-hidden');
  }
}

const getData = async () => {
  const ps = fetch(createUrl())
    .then((response) => {
      return response.json();
    })
    .then((datas) => {   
      const data = datas.data;
      return data;      
    })
    .catch((error) => {
      console.log(error);
    });

  const data = await ps;
  return data;
}

const refresh = async () => {  
  const data = await getData();
  toggleFLoader(); // Hide
  toggleMain(); // Show
  setLastUpdate();
  fillDatas(data);
}

const reset = () => {
  toggleMain(); // Hide
  toggleFLoader(); // Show
}

(() => {
  setTimeout(() => {
    refresh();
  }, 2000);
  const timeRefresh = 300000;
  setInterval(() => {
    reset();
    refresh();
  }, timeRefresh);
})();