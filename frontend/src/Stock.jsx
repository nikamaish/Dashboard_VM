import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';

const Stock = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiKey = 'IIEA0R92T57JMYKW';
        const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=1min&apikey=${apiKey}`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        // Check if the required properties exist
        if (data && data['Time Series (1min)']) {
          const dates = Object.keys(data['Time Series (1min)']);
          const prices = dates.map(date => data['Time Series (1min)'][date]['4. close']);

          setStockData({ dates, prices });
        } else {
          console.error('Error: Unexpected data format from API');
          console.log('Actual API response structure:', data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
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
            borderColor: 'green',
            borderWidth: 2,
            fill: false,
          }],
        },
      });
    }
  }, [stockData]);

  return (
    <div>
      {loading ? (
        <p>Loading stock data...</p>
      ) : (
        <canvas id="stockChart" width="800" height="400"></canvas>
      )}
    </div>
  );
};

export default Stock;
