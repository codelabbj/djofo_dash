import React from "react";

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to your admin dashboard</p>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>0</p>
        </div>
        <div className="stat-card">
          <h3>Active Sessions</h3>
          <p>0</p>
        </div>
        {/* <div className="stat-card">
          <h3>Total Revenue</h3>
          <p>$0</p>
        </div> */}
      </div>
    </div>
  );
} 