import React from 'react';

/**
 * Reusable Table component
 * @param {object} props - Component props
 * @param {array} props.columns - Array of column definitions: [{ key, label, render? }]
 * @param {array} props.data - Array of data objects
 * @param {string} props.emptyMessage - Message to show when no data
 * @param {boolean} props.striped - Whether to stripe rows
 * @param {boolean} props.hoverable - Whether rows are hoverable
 */
const Table = ({
  columns,
  data,
  emptyMessage = 'No data available',
  striped = true,
  hoverable = true
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-700">
            {columns.map((column, index) => (
              <th
                key={column.key || index}
                className="text-left py-3 px-4 text-sm font-semibold text-slate-300"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={row.id || rowIndex}
              className={`
                border-b border-slate-700/50
                ${striped && rowIndex % 2 === 1 ? 'bg-slate-800/50' : ''}
                ${hoverable ? 'hover:bg-slate-700/30 transition-colors' : ''}
              `}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={column.key || colIndex}
                  className="py-3 px-4 text-sm text-slate-300"
                >
                  {column.render
                    ? column.render(row[column.key], row, rowIndex)
                    : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
