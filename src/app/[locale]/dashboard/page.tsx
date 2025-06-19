import React from "react";

export default function DashboardPage() {
  return (
    <div>
      <h1>Tableau de bord</h1>
      <p>Bienvenue sur le Tableau de bord</p>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Statistiques</h3>
          <p>0</p>
        </div>
        <div className="stat-card">
          <h3>Sessions actives</h3>
          <p>0</p>
        </div>
        {/* <div className="stat-card">
          <h3>Revenu total</h3>
          <p>0 €</p>
        </div> */}
      </div>
    </div>
  );
} 