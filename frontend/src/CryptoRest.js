import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import 'chartjs-adapter-moment';
import './CryptoRest.css';
import { Link } from 'react-router-dom';

function CryptoRest() {
  const [cryptoData, setCryptoData] = useState([]);
  const [selectedCryptos, setSelectedCryptos] = useState(['BTC']);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [selectedGraphType, setSelectedGraphType] = useState('line'); // Default to line graph

  const currentDate = new Date();
  const oneMonthAgo = new Date(currentDate);
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requests = selectedCryptos.map(crypto => {
          return axios.get(`https://min-api.cryptocompare.com/data/v2/histominute?fsym=${crypto}&tsym=USD&limit=530`);
        });

        const responses = await Promise.all(requests);
        const cryptoDatas = responses.map(response => response.data.Data);

        const timestamps = cryptoDatas[0].Data.map(item => new Date(item.time * 1000).toLocaleString());

        const newData = timestamps.map((timestamp, index) => {
          const dataPoint = { timestamp };
          cryptoDatas.forEach((cryptoData, cryptoIndex) => {
            const cryptoSymbol = selectedCryptos[cryptoIndex];
            const prices = cryptoData.Data.map(item => item.close);
            // Assuming volume data is available, modify this part accordingly
            const volumes = cryptoData.Data.map(item => item.volumeto);
            dataPoint[`${cryptoSymbol}Price`] = prices[index];
            dataPoint[`${cryptoSymbol}Volume`] = volumes[index];
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
  }, [selectedCryptos]); // Fetch data whenever selectedCryptos change

  const setChartDataFromCryptoData = data => {
    if (data.length > 0) {
      const labels = data.map(item => item.timestamp);

      const color1 = '#008000'; // Green
      const color2 = '#008000'; // Blue
      const color3 = '#FFA500'; // Orange

      const lineDatasets = selectedCryptos.map((crypto, index) => {
        return {
          label: `${crypto} Price (USD)`,
          data: data.map(item => item[`${crypto}Price`]),
          borderColor: index === 0 ? color1 : color2,
          fill: true,
          backgroundColor: 'rgba(0, 128, 0, 0.1)',
          pointRadius: 0,
        };
      });

      const barDatasets = selectedCryptos.map((crypto, index) => {
        return {
          label: `${crypto} Volume`,
          data: data.map(item => item[`${crypto}Volume`]),
          backgroundColor: color3,
        };
      });

      setChartData({
        labels,
        datasets: selectedGraphType === 'line' ? lineDatasets : barDatasets,
      });
    }
  };

  const handleCryptoSelection = event => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedCryptos(selectedOptions);
  };

  const options = [
    { value: "BTC", label: 'Bitcoin' },
    { value: 'ETH', label: 'Etherium' },
    { value: 'BNB', label: 'BNB' },
    { value: 'SOL', label: 'SOLANA' },
    { value: 'XRP', label: 'XRP' },
  ];

  return (
    <div className="rectangle-page">
      <div className="graph-container">
        <h1 style={{ textAlign: 'center', marginTop: '2vh' }}> 1 Minute Crypto Price Chart</h1>

        <div className="timeRest">
          <ul style={{ listStyle: "none" }}>
            <Link to='/cryptorest' style={{ textDecoration: 'none' }}><li>1D</li></Link>
            <li>7D</li>
            <Link to='/cryptomonth' style={{ textDecoration: 'none' }}><li>1M</li></Link>
            <li>3M</li>
          </ul>
        </div>

        <div multiple value={selectedCryptos} onChange={handleCryptoSelection} style={{ textAlign: 'end', marginTop: '20px', marginRight: '60px' }}>
          <select style={{ height: '40px', width: '120px', fontWeight: '600', fontSize: '16px', cursor: 'pointer', borderRadius: '5px', paddingLeft: '7px' }}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <label style={{ marginRight: '10px' }}>Graph Type:</label>
          <select
            value={selectedGraphType}
            onChange={(e) => setSelectedGraphType(e.target.value)}
            style={{ height: '30px', cursor: 'pointer', borderRadius: '5px', paddingLeft: '7px' }}
          >
            <option value="line">Line</option>
            <option value="bar">Bar</option>
          </select>
        </div>

        {cryptoData.length > 0 ? (
          <>
            {selectedGraphType === 'line' ? (
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
                        unit: 'hour',
                        stepSize: 0.5,
                        displayFormats: {
                          hour: 'HH:00',
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
                        precision: 2,
                        callback: value => `$${value}`,
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
                  scales: {
                    x: {
                      type: 'time',
                      time: {
                        unit: 'hour',
                        stepSize: 0.5,
                        displayFormats: {
                          hour: 'HH:00',
                        },
                      },
                      grid: {
                        display: false,
                        drawBorder: false,
                      },
                    },
                    y: {
                      beginAtZero: true,
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
          </>
        ) : (
          <p>Loading data...</p>
        )}
      </div>
    </div>
  );
}

export default CryptoRest;
