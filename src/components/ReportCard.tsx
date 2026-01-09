import React from 'react';

interface ReportCardProps {
    department: string;
    amount: string;
    description: string;
    date: string;
    city: string;
}

export const ReportCard: React.FC<ReportCardProps> = ({ department, amount, description, date, city }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full mb-2">
                        {department}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{amount}</h3>
                </div>
                <span className="text-sm text-gray-500">{date}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm line-clamp-3">
                {description}
            </p>
            <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {city}
            </div>
        </div>
    );
};
