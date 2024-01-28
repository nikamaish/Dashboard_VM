import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-moment';

function CryptoRest() {
  const [cryptoData, setCryptoData] = useState([]);
  const [selectedCryptos, setSelectedCryptos] = useState(['BTC']);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

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
            dataPoint[`${cryptoSymbol}Price`] = prices[index];
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

      const datasets = selectedCryptos.map((crypto, index) => {
        return {
          label: `${crypto} Price (USD)`,
          data: data.map(item => item[`${crypto}Price`]),
          borderColor: index === 0 ? color1 : color2,
          fill: false,
          pointRadius:0,
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


  const options = [
    {value:"BTC", label: 'Bitcoin' },
    { value: 'ETH', label: 'Etherium' },
    { value: 'BNB', label: 'BNB' },
    { value: 'SOL', label: 'SOLANA' },
    { value: 'XRP', label: 'XRP' },
  ];

  return (
    <div>
      <h1 style={{textAlign:'center', marginTop:'2vh'}}>Real-Time Crypto Price Chart</h1>
    
    <div multiple value={selectedCryptos} onChange={handleCryptoSelection} style={{ textAlign: 'end', marginTop: '20px', marginRight:'20px'}} >
    {/* <label>Select an option:</label> */}
      <select   style={{ height: '40px', width: '120px',fontWeight:'600', fontSize:'16px'}}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
    
      {/* <div>
       
        <select multiple value={selectedCryptos} onChange={handleCryptoSelection}>
          <option value="BTC">Bitcoin</option>
          <option value="ETH">Ethereum</option>
         
        </select>
      </div> */}
      {cryptoData.length > 0 ? (
        <Line
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
              },
              y: {
                beginAtZero: false,
                min: Math.min(
                  ...cryptoData.map(item => Math.min(...selectedCryptos.map(crypto => item[`${crypto}Price`])))
                ),
                max: Math.max(
                  ...cryptoData.map(item => Math.max(...selectedCryptos.map(crypto => item[`${crypto}Price`])))
                ),
                ticks: {
                  stepSize: null,
                  precision: 2,
                  callback: value => `$${value}`,
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
  );
}

export default CryptoRest;
