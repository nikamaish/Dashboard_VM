import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';

const Stock = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiKey = '_fzSFz3KWjdpvpVq8XjjJOkJegWhpJwa';
        const symbol = 'TSLA'; // Replace with your desired stock symbol
        const date = '2024-02-08'; // Replace with the specific date
        const apiUrl = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/minute/${date}/${date}?adjusted=true&apiKey=${apiKey}`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        // Check if the required properties exist
        if (data && data.results) {
          const minutesData = data.results.map(result => ({
            timestamp: new Date(result.t),
            close: result.c,
          }));

          setStockData(minutesData);
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
    if (stockData.length > 0) {
      // Destroy the previous chart instance
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      const ctx = document.getElementById('stockChart').getContext('2d');

      // Create a new Chart instance
      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: stockData.map(dataPoint => dataPoint.timestamp),
          datasets: [{
            label: 'Stock Price',
            data: stockData.map(dataPoint => dataPoint.close),
            borderColor: 'green',
            borderWidth: 2,
            fill: false,
          }],
        },
        options: {
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'minute',
                displayFormats: {
                  minute: 'HH:mm',
                },
              },
            },
          },
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
