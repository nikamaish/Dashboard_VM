import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-moment';
import './CryptoRest.css';
import { Link } from 'react-router-dom';

function CryptoMonth() {
  const [cryptoData, setCryptoData] = useState([]);
  const [selectedCryptos, setSelectedCryptos] = useState(['bitcoin']);
  const [chartData, setChartData] = useState({labels: [], datasets: [],});

  // labels: [], datasets: [], these are properties of the chartData object. 
  //  The purpose of initializing chartData with an empty state object is to provide a structure that can later be populated with data retrieved from the CoinGecko API.
  
  const [selectedInterval, setSelectedInterval] = useState('1M'); // Default interval is 1 day
  const [loading, setLoading] = useState(false);

// what is difference between useEffect and useState?  useEffect is used to perform side effects in your functional components. 

// what is difference between cryptodata and chartData?  cryptoData is an array of objects that contain the price data for the selected cryptocurrencies. chartData is an object that contains the data structure required by the Chart.js library to render the line chart. why need seperate cryptoData and chartData?  The cryptoData array is used to store the raw price data retrieved from the CoinGecko API. The chartData object is used to store the data structure required by the Chart.js library to render the line chart. The chartData object is populated based on the cryptoData array.


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setCryptoData([]);
        setChartData({ labels: [], datasets: [] });

        const intervalDays = {
          // '1D': 1,
          '1M': 30,
          '7D': 7,
          '3M': 90,
          // here we can add more intervals as needed, we did mappping of intervalDays with selectedInterval
          // Add more intervals as needed
        };

        const requests = selectedCryptos.map(crypto => { // selectedCryptos is an array of strings that contain the symbols of the cryptocurrencies selected by the user.
// we are using map function to iterate over the selectedCryptos array and create an array of promises. Each promise is a request to the CoinGecko API to retrieve the price data for a specific cryptocurrency.
          return axios.get(`https://api.coingecko.com/api/v3/coins/${crypto}/market_chart`, {
            params: {
              vs_currency: 'usd',
              days: intervalDays[selectedInterval],
              interval: 'daily',
              // why we used interval: 'daily'?  We use the interval query parameter to specify the time interval for the price data. In this case, we use the daily interval to retrieve the price data for each day within the specified time range.
              // what is vs_currency: 'usd'?  The vs_currency query parameter is used to specify the currency in which the price data is returned. In this case, we specify usd to retrieve the price data in US dollars.
            },
          });
        });

        const responses = await Promise.all(requests);
        //  here why we used promises?  We use promises to make multiple requests to the CoinGecko API to retrieve the price data for the selected cryptocurrencies. We use the Promise.all method to wait for all the requests to complete before updating the state with the retrieved data.

        const cryptoDatas = responses.map(response => response.data.prices);
        //  here we used map function to iterate over the responses array and extract the price data from each response. The price data is stored in the prices property of the response data object.

        const timestamps = cryptoDatas[0].map(item => new Date(item[0]).toLocaleString());
        // here we used map function to iterate over the price data for the first cryptocurrency in the cryptoDatas array and extract the timestamps. We use the new Date method to convert the timestamps from Unix time to a human-readable date format.
        // why first cryptocurrency?  We use the price data for the first cryptocurrency in the cryptoDatas array to extract the timestamps because the timestamps are the same for all the cryptocurrencies.
        // what is timestamps?  The timestamps array contains the human-readable date format of the timestamps extracted from the price data for the first cryptocurrency in the cryptoDatas array.
        // new Date(item[0]).toLocaleString() is used to convert the timestamps from Unix time to a human-readable date format.

        const newData = timestamps.map((timestamp, index) => {
          const dataPoint = { timestamp };
          cryptoDatas.forEach((cryptoData, cryptoIndex) => {
            const cryptoSymbol = selectedCryptos[cryptoIndex];
            dataPoint[`${cryptoSymbol}Price`] = cryptoData[index][1];
          });
          return dataPoint;
        });

        setCryptoData(newData);
        setChartDataFromCryptoData(newData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCryptos, selectedInterval]);

  const setChartDataFromCryptoData = data => {
    if (data.length > 0) {
      const labels = data.map(item => item.timestamp);

      const color1 = '#008000'; // Green
      const color2 = '#008000'; // Blue

      const datasets = selectedCryptos.map((crypto, index) => {
        return {
          label: `${crypto} Price (USD)`,
          data: data.map(item => item[`${crypto}Price`]),
          borderColor: index === 0 ? color1 : color2,
          fill: true,
          backgroundColor: 'rgba(0, 128, 0, 0.1)',
          pointRadius: 0,
        };
      });

      setChartData({
        labels,
        datasets,
      });
    }
  };

  const handleCryptoSelection = event => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedCryptos(selectedOptions);
  };

  const handleIntervalChange = interval => {
    setSelectedInterval(interval);
  };

  const options = [
    { value: 'bitcoin', label: 'Bitcoin' },
    { value: 'ethereum', label: 'Etherium' },
    { value: 'binancecoin', label: 'BNB' },
    { value: 'solana', label: 'SOLANA' },
    { value: 'ripple', label: 'XRP' },
  ];

  return (
    <div className="rectangle-page">
      <div className="graph-container">
        <h1 style={{ textAlign: 'center', marginTop: '2vh' }}>Real-Time Crypto Price Chart</h1>

        <div className="timeRest">
          <ul style={{ listStyle: "none" }}>
            <Link to='/cryptorest' style={{ textDecoration: 'none', color:'#000' }}><li>1D</li></Link>
            <li onClick={() => handleIntervalChange('7D')}>7D</li>
            <li onClick={() => handleIntervalChange('1M')}>1M</li>
            <li onClick={() => handleIntervalChange('3M')}>3M</li>
          </ul>
        </div>

        <div multiple value={selectedCryptos} onChange={handleCryptoSelection} style={{ textAlign: 'end', marginTop: '20px', marginRight: '20px' }} >
          <select style={{ height: '40px', width: '120px', fontWeight: '600', fontSize: '16px' }}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p>Loading data...</p>
        ) : (
          <Line
            data={chartData}
            options={{
              responsive: true,
              layout: {
                padding: {
                  left: 20, // Adjust the left padding as needed
                  right: 20, // Adjust the right padding as needed
                  top: 0,
                  bottom: 0,
                }
              },
              scales: {
                x: {
                  type: 'time',
                  time: {
                    unit: 'day',
                    stepSize: 1,
                    displayFormats: {
                      day: 'MMM DD',
                    },
                  },
                  grid: {
                    display: false,
                    drawBorder: false,
                  },
                },
                y: {
                  beginAtZero: false,
                  min: Math.min(...cryptoData.map(item => Math.min(...selectedCryptos.map(crypto => item[`${crypto}Price`])))),
                  max: Math.max(...cryptoData.map(item => Math.max(...selectedCryptos.map(crypto => item[`${crypto}Price`])))),
                  ticks: {
                    stepSize: null,
                    precision: 3,
                    callback: value => `$${value.toFixed(3)}`,
                  },
                  grid: {
                    display: false,
                    drawBorder: false,
                  },
                },
              },
              plugins: {
                legend: {
                  display: true,
                },
                tooltip: {
                  mode: 'index',
                  intersect: false,
                },
              },
            }}
          />
        )}
      </div>
    </div>
  );
}

export default CryptoMonth;
