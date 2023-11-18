const WeatherApp = class {
	constructor(apiKey, currentWeather, forecastWeather) {
		this.apiKey = apiKey;

		this.currentWeatherBlock = document.querySelector(currentWeather);
		this.currentForecastBlock = document.querySelector(forecastWeather);

		this.weatherLink = `https://api.openweathermap.org/data/2.5/weather?q={query}&appid=${this.apiKey}&units=metric`;
		this.forecastLink = `https://api.openweathermap.org/data/2.5/forecast?q={query}&appid=${this.apiKey}&units=metric`;

		this.currentWeather = undefined;
		this.currentForecast = undefined;
	}

	getWeather(query) {
		// this.weatherLink = `https://api.openweathermap.org/data/2.5/weather?q={query}&appid=${this.apiKey}&units=metric`;
		let url = this.weatherLink.replace('{query}', query);
		let req = new XMLHttpRequest();
		req.open('GET', url, true);
		req.send();
		req.addEventListener('load', () => {
			this.currentWeather = JSON.parse(req.responseText);
			this.drawWeather();
		});
	}

	getForecast(query) {
		// this.forecastLink = `https://api.openweathermap.org/data/2.5/forecast?q={query}&appid=${this.apiKey}&units=metric`;
		let url = this.forecastLink.replace('{query}', query);
		fetch(url)
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				this.currentForecast = data.list;
				console.log(data.list);
				this.drawWeather();
			})
			.catch((err) => {
				console.log(err);
			});
	}

	drawWeather() {
		this.currentWeatherBlock.innerHTML = '';
		this.currentForecastBlock.innerHTML = '';

		if (this.currentWeather) {
			const date = new Date(this.currentWeather.dt * 1000); // time in ms
			const block = this.createWeatherBlock(
				`${date.toLocaleDateString('pl-PL')} ${date.toLocaleTimeString(
					'pl-PL'
				)}`, // convert ms to date and time
				this.currentWeather.main.temp,
				this.currentWeather.main.feels_like,
				this.currentWeather.weather[0].icon,
				this.currentWeather.weather[0].description
			);
			this.currentWeatherBlock.appendChild(block);
		}

		if (this.currentForecast) {
			for (let i = 0; i < this.currentForecast.length; i++) {
				const date = new Date(this.currentForecast[i].dt * 1000); // time in ms
				const block = this.createWeatherBlock(
					`${date.toLocaleDateString('pl-PL')} ${date.toLocaleTimeString(
						'pl-PL'
					)}`, // convert ms to date and time
					this.currentForecast[i].main.temp,
					this.currentForecast[i].main.feels_like,
					this.currentForecast[i].weather[0].icon,
					this.currentForecast[i].weather[0].description
				);
				this.currentForecastBlock.appendChild(block);
			}
		}
	}

	createWeatherBlock(date, temp, feelTemp, icon, description) {
		const block = document.createElement('div');
		block.className = 'weather-block';

		const weatherDate = document.createElement('div');
		weatherDate.className = 'weather-date';
		weatherDate.innerText = date;

		const weatherIcon = document.createElement('img');
		weatherIcon.className = 'weather-icon';
		weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;

		const weatherTemp = document.createElement('div');
		weatherTemp.className = 'weather-temp';
		weatherTemp.innerText = temp;

		const weatherFeelTemp = document.createElement('div');
		weatherFeelTemp.className = 'weather-temp-feels-like';
		weatherFeelTemp.innerText = `Feels like: ${feelTemp}`;

		const weatherDescription = document.createElement('div');
		weatherDescription.className = 'weather-description';
		weatherDescription.innerText = description;

		block.appendChild(weatherDate);
		block.appendChild(weatherIcon);
		block.appendChild(weatherTemp);
		block.appendChild(weatherFeelTemp);
		block.appendChild(weatherDescription);

		return block;
	}
};

window.onload = () => {
	const app = new WeatherApp(
		'0f17b96b670fbdd5ab22265455ed7252',
		'#weather-result',
		'#forecast-results'
	);
	document.getElementById('search-btn').addEventListener('click', () => {
		const query = document.querySelector('#search-input').value;
		if (!query) {
			alert('Wprowadź nazwę miasta');
			return;
		}
		app.getWeather(query);
		app.getForecast(query);
	});
};
