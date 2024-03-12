import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2'; // Import both Line and Bar
import 'chartjs-adapter-moment';
import './CryptoRest.css';
import { Link } from 'react-router-dom';

function CryptoMonth() {
  const [cryptoData, setCryptoData] = useState([]);
  const [selectedCryptos, setSelectedCryptos] = useState(['bitcoin']);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [selectedInterval, setSelectedInterval] = useState('1M');
  const [loading, setLoading] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState('1M');
  const [chartType, setChartType] = useState('line'); // New state for chart type (line or bar)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setCryptoData([]);
        setChartData({ labels: [], datasets: [] });

        const intervalDays = {
          '1M': 30,
          '7D': 7,
          '3M': 90,
        };

        const requests = selectedCryptos.map((crypto) => {
          return axios.get(`https://api.coingecko.com/api/v3/coins/${crypto}/market_chart`, {
            params: {
              vs_currency: 'usd',
              days: intervalDays[selectedInterval],
              interval: 'daily',
            },
          });
        });

        const responses = await Promise.all(requests);
        const cryptoDatas = responses.map((response) => response.data.prices);

        const timestamps = cryptoDatas[0].map((item) => new Date(item[0]).toLocaleString());

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

  const setChartDataFromCryptoData = (data) => {
    if (data.length > 0) {
      const labels = data.map((item) => item.timestamp);

      const color1 = '#008000'; // Green
      const color2 = '#008000'; // Blue

      const datasets = selectedCryptos.map((crypto, index) => {
        return {
          label: `${crypto} Price (USD)`,
          data: data.map((item) => item[`${crypto}Price`]),
          borderColor: index === 0 ? color1 : color2,
          fill: true,
          backgroundColor: 'rgba(0, 128, 0, 0.1)',
          pointRadius: 0,
        };
      });

      setChartData({ labels, datasets });
    }
  };

  const handleCryptoSelection = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
    setSelectedCryptos(selectedOptions);
  };

  const handleIntervalChange = (interval) => {
    setSelectedInterval(interval);
    setSelectedBlock(interval);
  };

  const handleChartTypeChange = (type) => {
    setChartType(type);
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
          <ul style={{ listStyle: 'none' }}>
            <Link to="/cryptorest" style={{ textDecoration: 'none', color: '#000' }}>
              <li onClick={() => handleIntervalChange('1D')} className={selectedBlock === '1D' ? 'selected' : ''}>
                1D
              </li>
            </Link>
            <li onClick={() => handleIntervalChange('7D')} className={selectedBlock === '7D' ? 'selected' : ''}>
              7D
            </li>
            <li onClick={() => handleIntervalChange('1M')} className={selectedBlock === '1M' ? 'selected' : ''}>
              1M
            </li>
            <li onClick={() => handleIntervalChange('3M')} className={selectedBlock === '3M' ? 'selected' : ''}>
              3M
            </li>
          </ul>
        </div>

        <div
          multiple
          value={selectedCryptos}
          onChange={handleCryptoSelection}
          style={{ textAlign: 'end', marginTop: '20px', marginRight: '20px' }}
        >
          <select style={{ height: '40px', width: '120px', fontWeight: '600', fontSize: '16px' }}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ marginRight: '10px' }}>Chart Type:</label>
          <select onChange={(e) => handleChartTypeChange(e.target.value)}>
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
          </select>
        </div>

        {loading ? (
          <p>Loading data...</p>
        ) : chartType === 'line' ? (
          <Line
            data={chartData}
            options={{
              responsive: true,
              layout: {
                padding: {
                  left: 20,
                  right: 20,
                  top: 0,
                  bottom: 0,
                },
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
                  min: Math.min(...cryptoData.map((item) => Math.min(...selectedCryptos.map((crypto) => item[`${crypto}Price`])))),
                  max: Math.max(...cryptoData.map((item) => Math.max(...selectedCryptos.map((crypto) => item[`${crypto}Price`])))),
                  ticks: {
                    stepSize: null,
                    precision: 3,
                    callback: (value) => `$${value.toFixed(3)}`,
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
          <Bar
            data={chartData}
            options={{
              responsive: true,
              layout: {
                padding: {
                  left: 20,
                  right: 20,
                  top: 0,
                  bottom: 0,
                },
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
                  min: Math.min(...cryptoData.map((item) => Math.min(...selectedCryptos.map((crypto) => item[`${crypto}Price`])))),
                  max: Math.max(...cryptoData.map((item) => Math.max(...selectedCryptos.map((crypto) => item[`${crypto}Price`])))),
                  ticks: {
                    stepSize: null,
                    precision: 3,
                    callback: (value) => `$${value.toFixed(3)}`,
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
