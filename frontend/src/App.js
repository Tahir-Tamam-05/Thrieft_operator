import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import api from "./api";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

// Import components
import Navbar from "@/components/Navbar";
import HomePage from "@/pages/HomePage";
import DonatePage from "@/pages/DonatePage";
import ShopPage from "@/pages/ShopPage";
import RecyclingPage from "@/pages/RecyclingPage";
import DashboardPage from "@/pages/DashboardPage";
import AdminPage from "@/pages/AdminPage";
import TrackingPage from "@/pages/TrackingPage";

import "@/App.css";

function App() {
  const [impactStats, setImpactStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch impact stats on app load
  useEffect(() => {
    const fetchImpactStats = async () => {
      try {
        const response = await api.get('/api/impact-stats');
        setImpactStats(response.data);
      } catch (error) {
        console.error("Error fetching impact stats:", error);
        toast.error("Failed to load impact statistics");
      } finally {
        setLoading(false);
      }
    };

    // Seed mock data first, then fetch stats
    const initializeApp = async () => {
      try {
        await api.post('/api/seed-mock-data');
        await fetchImpactStats();
      } catch (error) {
        console.error("Error initializing app:", error);
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-green-700 font-medium">Loading ThriftLife...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <BrowserRouter>
        <Navbar />
        <main className="pt-16">
          <Routes>
            <Route 
              path="/" 
              element={<HomePage impactStats={impactStats} />} 
            />
            <Route path="/donate" element={<DonatePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/recycling" element={<RecyclingPage impactStats={impactStats} />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/track/:trackingId" element={<TrackingPage />} />
            <Route path="/track" element={<TrackingPage />} />
          </Routes>
        </main>
        <Toaster position="top-right" />
      </BrowserRouter>
    </div>
  );
}

export default App;
