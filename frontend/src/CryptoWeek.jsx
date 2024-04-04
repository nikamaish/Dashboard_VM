import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';

function CryptoWeek() {
  const [selectedCryptos, setSelectedCryptos] = useState(['BTC']);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [selectedGraphType, setSelectedGraphType] = useState('line');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requests = selectedCryptos.map(crypto => {
          return axios.get(`https://min-api.cryptocompare.com/data/v2/histohour?fsym=${crypto}&tsym=USD&limit=168`);
        });

        const responses = await Promise.all(requests);
        const cryptoDatas = responses.map(response => response.data.Data.Data);

        const hourlyData = cryptoDatas.map(cryptoData => {
          return cryptoData.map(item => ({
            time: new Date(item.time * 1000).toLocaleString('en-US', {
              month: 'short',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            }),
            price: item.close,
          }));
        });
        

        setChartData({
          labels: hourlyData[0].map(data => data.time),
          datasets: hourlyData.map((data, index) => ({
            label: `${selectedCryptos[index]} Price (USD)`,
            data: data.map(entry => entry.price),
            fill: true,
            backgroundColor: 'rgba(0, 128, 0, 0.1)',
            borderColor: 'darkgreen',
            borderWidth: 1,
            pointRadius: 0,
          })),
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedCryptos]);

  const handleGraphTypeChange = event => {
    const newGraphType = event.target.value;
    setSelectedGraphType(newGraphType);
  };

  const handleCryptoSelection = event => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedCryptos(selectedOptions);
  };

  const options = [
    { value: "BTC", label: 'Bitcoin' },
    { value: 'ETH', label: 'Ethereum' },
    { value: 'BNB', label: 'BNB' },
    { value: 'SOL', label: 'SOLANA' },
    { value: 'XRP', label: 'XRP' },
  ];

  return (
    <div className="rectangle-page">
      <div className="graph-container">
        <p style={{ textAlign: 'center', marginTop: '2vh' }}>Hourly Crypto Prices</p>
        
        <div className="timeRest">
          <ul style={{ listStyle: "none" }}>
           
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
            onChange={handleGraphTypeChange}
            style={{ height: '30px', cursor: 'pointer', borderRadius: '5px', paddingLeft: '7px' }}
          >
            <option value="line">Line</option>
            <option value="bar">Bar</option>
          </select>
        </div>


        {/* <div className="graph-type">
          <label>Graph Type:</label>
          <select value={selectedGraphType} onChange={handleGraphTypeChange}>
            <option value="line">Line</option>
            <option value="bar">Bar</option>
          </select>
        </div> */}

<div className="chart-container">
          {chartData.datasets.length > 0 ? (
            selectedGraphType === 'line' ? (
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
                      },
                    },
                    y: {
                        ticks: {
                            callback: value => `$${value}`,
                        },
                      grid: {
                        display: false,
                      },
                      
                    },
                  },
                }}
              />
            ) : (
              <Bar
              data={chartData}
              options={{
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
                    },
                  },
                  y: {
                    grid: {
                      display: false,
                    },
                  },
                },
              }}
            />
            )
          ) : (
            <p>Loading data...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CryptoWeek;
