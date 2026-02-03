import React from 'react';

export default function StubPage({ title }) {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{title}</h1>
            <p className="text-gray-600 dark:text-gray-400">This page is under construction.</p>
        </div>
    );
}
