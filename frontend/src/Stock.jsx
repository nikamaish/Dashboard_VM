import React, { useEffect, useState, useRef } from 'react';

const Stock = () => {
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiKey = 'df5a8fbf04msh3edf50e3129a73ap1747cfjsnc2f84df542cd';
        const symbol = 'AMRN'; // Replace with the desired stock symbol
        const apiUrl = `https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v3/get-historical-data?symbol=${symbol}&region=US`;

        const options = {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
          },
        };

        const response = await fetch(apiUrl, options);

        if (!response.ok) {
          throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }

        const data = await response.json();

        // Check if the required properties exist
        if (data && data.prices) {
          // Extract relevant information from the response, e.g., closing prices
          const historicalPrices = data.prices.map((priceData) => ({
            timestamp: new Date(priceData.date * 1000),
            close: priceData.close,
          }));

          setHistoricalData(historicalPrices);
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
    console.log('Historical Data:', historicalData);
  }, [historicalData]);

  return (
    <div>
      {loading ? (
        <p>Loading historical data...</p>
      ) : (
        <p>Check the console for historical data</p>
      )}
    </div>
  );
};

export default Stock;
