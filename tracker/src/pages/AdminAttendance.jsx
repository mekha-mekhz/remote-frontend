import React, { useEffect, useState } from 'react';
import api from '../components/api';

function AdminAttendance() {
  const token = localStorage.getItem('token');
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const loadAttendance = async (start, end) => {
    try {
      setLoading(true);
      const query = [];
      if (start) query.push(`startDate=${start}`);
      if (end) query.push(`endDate=${end}`);
      const queryString = query.length ? `?${query.join('&')}` : '';
      
      const res = await api.get(`/attendance/all${queryString}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAttendance(res.data.attendance);
    } catch (err) {
      console.error('Failed to load attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, [token]);

  const handleFilter = (e) => {
    e.preventDefault();
    loadAttendance(startDate, endDate);
  };

  if (loading) return <div>Loading attendance...</div>;

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">All Users Attendance</h1>

      {/* DATE FILTER */}
      <form className="flex gap-3 mb-6" onSubmit={handleFilter}>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 rounded text-black"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 rounded text-black"
        />
        <button
          type="submit"
          className="bg-teal-500 px-4 rounded hover:bg-teal-600"
        >
          Filter
        </button>
      </form>

      <table className="w-full border border-gray-700 text-left">
        <thead>
          <tr className="bg-gray-800">
            <th className="p-2 border border-gray-700">User</th>
            <th className="p-2 border border-gray-700">Email</th>
            <th className="p-2 border border-gray-700">Date</th>
            <th className="p-2 border border-gray-700">Sessions</th>
            <th className="p-2 border border-gray-700">Total Hours</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((record) => (
            <tr key={record._id} className="hover:bg-gray-700">
              <td className="p-2 border border-gray-700">{record.user.name}</td>
              <td className="p-2 border border-gray-700">{record.user.email}</td>
              <td className="p-2 border border-gray-700">{record.date}</td>
              <td className="p-2 border border-gray-700">
                {record.sessions.map((s, i) => (
                  <div key={i}>
                    In: {new Date(s.checkIn).toLocaleTimeString()} | Out: {s.checkOut ? new Date(s.checkOut).toLocaleTimeString() : '-'}
                  </div>
                ))}
              </td>
              <td className="p-2 border border-gray-700">{record.totalHours.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminAttendance;
