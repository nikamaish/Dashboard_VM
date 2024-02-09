import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';

const Stock = () => {
  const [stockData, setStockData] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiKey = 'ID1ZPSB5LDTYDMDX';
        const symbol = 'AAPL'; // Replace with your desired stock symbol
        const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        // Extract relevant information (e.g., closing prices)
        const dates = Object.keys(data['Time Series (Daily)']);
        const prices = dates.map(date => data['Time Series (Daily)'][date]['4. close']);

        setStockData({ dates, prices });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Once stockData is updated, create or update the chart
    if (stockData.dates && stockData.prices) {
      // Destroy the previous chart instance
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      const ctx = document.getElementById('stockChart').getContext('2d');

      // Create a new Chart instance
      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: stockData.dates.reverse(),
          datasets: [{
            label: 'Stock Price',
            data: stockData.prices.reverse(),
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 2,
            fill: false,
          }],
        },
      });
    }
  }, [stockData]);

  return (
    <div>
      <canvas id="stockChart" width="800" height="400"></canvas>
    </div>
  );
};

export default Stock;
