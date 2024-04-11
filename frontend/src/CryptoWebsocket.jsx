import React, { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { Link } from 'react-router-dom';
import './CryptoRest.css';

function CryptoWebsocket() {
  const [cryptoData, setCryptoData] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [selectedCrypto, setSelectedCrypto] = useState('BTC'); // Default to Bitcoin symbol
  const socketRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const apiKey = '2bef53cce2bbcf3a5f288ac7215437101d6159c792f8743e1b2c2c568d6a608c';
    const websocketURL = `wss://streamer.cryptocompare.com/v2?api_key=${apiKey}`;
    const newSocket = new WebSocket(websocketURL);
    socketRef.current = newSocket;

    newSocket.onopen = () => {
      console.log('WebSocket opened');
      const subscriptions = [
        `5~CCCAGG~${selectedCrypto}~USD`,
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
        symbol: data.FROMSYMBOL,
      };

      setCryptoData((prevData) => {
        const newData = [...prevData, priceData].slice(-8); // Keep only the latest 8 points
        setChartDataFromCryptoData(newData);
        return newData;
      });
    };

    newSocket.onerror = (event) => {
      console.error('WebSocket error:', event);
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };

  }, [selectedCrypto]);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = document.getElementById('cryptoChart');
    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: {
        responsive: true,
        scales: {
          y: {
            min: 0, // Set the minimum value of the y-axis
            max: 80000, // Set the maximum value of the y-axis
            beginAtZero: false,
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [chartData]);


  const setChartDataFromCryptoData = (data) => {
    if (data.length > 0) {
      const labels = data.map((item) => item.timestamp);
      const cryptoPrices = data
        .filter((item) => item.symbol === selectedCrypto)
        .map((item) => item.price);

      setChartData({
        labels,
        datasets: [
          {
            label: `${selectedCrypto} Price (USD)`,
            data: cryptoPrices,
            borderColor: 'green',
            fill: false,
          },
        ],
      });
    }
  };

  const handleCryptoChange = (event) => {
    setSelectedCrypto(event.target.value);
  };

  return (
    <div style={{ backgroundColor: '#fff', position: 'relative' }} className="rectangle-page">
      <h1 style={{ textAlign: 'center', margin: '20px 0' }}>Real-Time Crypto Price Chart</h1>

    
        {/* <label htmlFor="cryptoSelect">Select Cryptocurrency: </label> */}

        <div className="oneline">
          <div className='timeRest'>
            <ul>
              <Link to='/cryptoWebsocket'  ><li style={{ backgroundColor: '#3498db' }} >1S</li></Link>
              <Link to='/cryptoOneday'  ><li >1D</li></Link>
              <Link to='/cryptoweek'  ><li >7D</li></Link>
              <Link to='/cryptomonth'  ><li >1M</li></Link>
              <Link to='/cryptothreemonths'   ><li>3M</li></Link>
            </ul>
          </div>



          <div style={{marginRight:'20px'}}>
            <select className="cryptoSelect" value={selectedCrypto} onChange={handleCryptoChange}>
              <option value="BTC">Bitcoin</option>
              <option value="ETH">Ethereum</option>
              <option value="BNB">Binance</option>
              <option value="SOL">Solana</option>
              <option value="BCH">Bitcoin Cash</option>
              <option value="DOGE">Dogecoin</option>
              <option value="USDT">Tether</option>
              <option value="XRP">XRP</option>
              <option value="ADA">Cardano</option>
              <option value="AVAX">Avalanche</option>
              <option value="DOT">Polkadot</option>
              <option value="TRX">Tron</option>
              <option value="LTC">Litecoin</option>
              <option value="LINK">Chainlink</option>
            </select>
          </div>
        </div>

      <div >
        {cryptoData.length > 0 ? (
          <Line
            data={chartData}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: false,
                  min: 0.00,
                  max: 75000.00,
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

export default CryptoWebsocket;
