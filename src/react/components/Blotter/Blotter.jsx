import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import SelectList from '../SelectList/SelectList.jsx';
import getRandomData from '../../utils/randomData';
import providers from '../../data/providers';
import './Blotter.scss';

const chartResolution = 7;

const Blotter = () => {
  const [selectedProviders, setSelectedProviders] = useState([]);
  const [providerChartData, setProviderChartData] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    const newChartData = selectedProviders.map(({ key, color }) => {
      const data = [];
      for (let i = 0; i < chartResolution; i++) {
        data.push(getRandomData());
      }
      return {
        label: key,
        backgroundColor: color,
        borderColor: color,
        data,
        fill: false
      };
    });
    setProviderChartData(newChartData);
  }, [selectedProviders]);

  useLayoutEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    const steps = [
      '22:37:52',
      '22:36:56',
      '22:34:03',
      '22:38:25',
      '22:35:48',
      '22:36:36',
      '22:38:41',
      '22:35:38'
    ];
    const config = {
      type: 'line',
      data: {
        labels: steps,
        datasets: [...providerChartData]
      },
      options: {
        responsive: true,
        title: {
          display: true,
          fontColor: 'white',
          fontSize: 25,
          text: 'Price vs Time'
        },
        legend: {
          labels: {
            fontColor: 'white'
          }
        },
        tooltips: {
          mode: 'index',
          intersect: false
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
        scales: {
          xAxes: [
            {
              display: true,
              gridLines: {
                color: '#4b779c',
                zeroLineColor: '#fff'
              },
              ticks: {
                fontColor: 'white'
              },
              scaleLabel: {
                display: false
              }
            }
          ],
          yAxes: [
            {
              display: true,
              gridLines: {
                color: '#4b779c',
                zeroLineColor: '#fff'
              },
              ticks: {
                fontColor: 'white'
              },
              scaleLabel: {
                display: false
              }
            }
          ]
        }
      }
    };
    const ctx = document.getElementById('chart').getContext('2d');
    chartRef.current = new Chart(ctx, config);
  }, [providerChartData]);

  return (
    <div className='Blotter'>
      <div className='header'>
        <div className='title'>
          <h1 className='title'>Your Blotter</h1>
          <span className='subtitle'>Trade Info</span>
        </div>
        <div className='parameters'>
          <SelectList
            label='provider'
            id='provider'
            options={providers}
            selected={selectedProviders}
            update={setSelectedProviders}
          />
          <button className='return' onClick={() => setSelectedProviders([])}>
            Return
          </button>
        </div>
        <div className='data'>
          <table>
            <tbody>
              <tr>
                <th>Date</th>
                <td>2018/10/23 22:38</td>
                <th>Price</th>
                <td>1.2988</td>
              </tr>
              <tr>
                <th>Pair</th>
                <td>EUR/GBP</td>
                <th>Quantity</th>
                <td>2000000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <canvas id='chart' width='400' height='225'></canvas>
    </div>
  );
};

export default Blotter;
