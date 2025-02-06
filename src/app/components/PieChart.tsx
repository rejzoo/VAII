'use client';

import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { ServerData } from '@/types/types';

//Register so we can use the chart 
ChartJS.register(ArcElement, Tooltip, Legend);

type CircleGraphProps = {
    region: string;
    data: ServerData[];
};

export default function CircleGraph({ region, data }: CircleGraphProps) {
    const formattedLabels = data.map((server) =>
        server.server === '203'
            ? 'EU3'
            : server.server === '204'
            ? 'EU4'
            : server.server === '303'
            ? 'NA1'
            : server.server === '304'
            ? 'NA2'
            : server.server === '501'
            ? 'ASIA'
            : server.server
    );

    const chartData = {
        labels: formattedLabels,
        datasets: [
            {
                label: 'Players Online',
                data: data.map((server) => server.players_online),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    font: {
                        size: 16,
                    },
                    color: '#fff',
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        return `${context.label}: ${context.raw} players`;
                    },
                },
            },
        },
    };

    return (
        <div className="flex justify-center items-center p-4 md:p-10">
          <div className="bg-gradient-to-b from-indigo-800 to-purple-800 rounded-lg shadow-lg p-6 md:p-8 w-full max-w-md md:max-w-xl border border-purple-600">
            <h1 className="text-xl md:text-2xl font-bold text-center mb-4 md:mb-6 text-purple-100">
              {region}
            </h1>
      
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 md:mb-6">
              {data.map((server, index) => (
                <div
                  key={server.server}
                  className="bg-gradient-to-r from-indigo-700 to-purple-700 p-4 rounded-lg text-white flex flex-col sm:flex-row justify-between items-start sm:items-center overflow-hidden"
                >
                  <span className="font-bold text-sm md:text-base lg:text-lg truncate sm:w-auto w-full">
                    {formattedLabels[index]}
                  </span>
                  <span className="text-sm md:text-base lg:text-lg mt-2 sm:mt-0 text-right truncate w-full sm:w-auto">
                    {server.players_online.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
      
            <div className="relative h-64 md:h-80 lg:h-96">
              <Doughnut data={chartData} options={options} />
            </div>
          </div>
        </div>
    );
}
