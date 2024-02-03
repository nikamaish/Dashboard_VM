import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-moment';
import './CryptoRest.css';
import { Link } from 'react-router-dom';

function CryptoMonth() {
  const [cryptoData, setCryptoData] = useState([]);
  const [selectedCryptos, setSelectedCryptos] = useState(['bitcoin']);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [selectedInterval, setSelectedInterval] = useState('1D'); // Default interval is 1 day

  useEffect(() => {
    const fetchData = async () => {
      try {
        const intervalDays = {
          // '1D': 1,
          '1M': 30,
          '7D': 7,
          '3M': 90,
          // Add more intervals as needed
        };

        const requests = selectedCryptos.map(crypto => {
          return axios.get(`https://api.coingecko.com/api/v3/coins/${crypto}/market_chart`, {
            params: {
              vs_currency: 'usd',
              days: intervalDays[selectedInterval],
              interval: 'daily', // Adjust if you want hourly data, etc.
            },
          });
        });

        const responses = await Promise.all(requests);
        const cryptoDatas = responses.map(response => response.data.prices);

        const timestamps = cryptoDatas[0].map(item => new Date(item[0]).toLocaleString());

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
      }
    };

    fetchData();
  }, [selectedCryptos, selectedInterval]); // Fetch data whenever selectedCryptos or selectedInterval change

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
            <Link to='/cryptorest' style={{ textDecoration: 'none' }}><li>1D</li></Link>
            <li onClick={() => handleIntervalChange('1M')}>1M</li>
            <li onClick={() => handleIntervalChange('7D')}>7D</li>
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

        {cryptoData.length > 0 ? (
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
        ) : (
          <p>Loading data...</p>
        )}
      </div>
    </div>
  );
}

export default CryptoMonth;
