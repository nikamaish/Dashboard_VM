import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import { Line } from 'react-chartjs-2';

function CryptoGraphs() {
  const [cryptoData, setCryptoData] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Bitcoin Price (USD)',
        data: [],
        borderColor: 'blue',
        fill: false,
      },
    ],
  });

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const apiKey = '2bef53cce2bbcf3a5f288ac7215437101d6159c792f8743e1b2c2c568d6a608c';
    const websocketURL = `wss://streamer.cryptocompare.com/v2?api_key=${apiKey}`;
    const newSocket = new WebSocket(websocketURL);

    newSocket.onopen = (event) => {
      console.log('WebSocket opened:', event);
      setSocket(newSocket);

      const subscriptions = [
        '5~CCCAGG~BTC~USD',
        // '0~Coinbase~ETH~USD',
        // Add more subscriptions for other data streams
      ];

      subscriptions.forEach((sub) => {
        newSocket.send(JSON.stringify({
          action: 'SubAdd',
          subs: [sub],
        }));
      });
    };

    newSocket.onmessage = (event) => {
      console.log('WebSocket message received:', event.data);

      const data = JSON.parse(event.data);
      const currentDateTime = new Date().toLocaleString();

      const priceData = {
        timestamp: currentDateTime,
        price: data.PRICE,
        symbol: data.FROMSYMBOL === 'BTC' ? 'Bitcoin' : 'Ethereum',
      };

      setCryptoData((prevData) => {
        const newData = [...prevData, priceData].slice(-8); // Keep only the latest 10 points
        setChartDataFromCryptoData(newData);
        return newData;
      });
    };

    newSocket.onerror = (event) => {
      console.error('WebSocket error:', event);
    };

    return () => {
      if (socket) {
        socket.close();
      }
    };

  }, []); // Empty dependency array to open the WebSocket once

  const setChartDataFromCryptoData = (data) => {
    if (data.length > 0) {
      const labels = data.map((item) => item.timestamp);
      const bitcoinPrices = data
        .filter((item) => item.symbol === 'Bitcoin')
        .map((item) => item.price);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Bitcoin Price (USD)',
            data: bitcoinPrices,
            borderColor: 'green',
            fill: false,
          },
        ],
      });
    }
  };

 

  // const yAxisFixedPoints = [39800, 39840, 39880, 39920, 39960, 40000, 40040, 40080, 40120];


  return (
    <div style={{ backgroundColor: '#fff' }} className="rectangle-page">
      <h1 style={{textAlign:'center', margin:'20px 0'}}>Real-Time Crypto Price Chart</h1>
      {cryptoData.length > 0 ? (
        <Line data={chartData} options={{
  responsive: true,
  scales: {
    y: {
      beginAtZero: false,
      min: 60000.00,
      max: 75000.00,
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

export default CryptoGraphs;