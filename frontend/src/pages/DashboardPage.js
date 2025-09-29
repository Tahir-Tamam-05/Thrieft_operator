import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  BarChart3,
  Award,
  Heart,
  Package,
  Search,
  ArrowLeft,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  MapPin
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const DashboardPage = () => {
  const [userDonations, setUserDonations] = useState([]);
  const [trackingId, setTrackingId] = useState("");
  const [loading, setLoading] = useState(false);
  const [impactStats, setImpactStats] = useState(null);

  useEffect(() => {
    fetchImpactStats();
    // In a real app, we'd fetch user-specific donations here
    // For now, we'll use the mock donations from the API
    fetchAllDonations();
  }, []);

  const fetchImpactStats = async () => {
    try {
      const response = await axios.get(`${API}/impact-stats`);
      setImpactStats(response.data);
    } catch (error) {
      console.error("Error fetching impact stats:", error);
    }
  };

  const fetchAllDonations = async () => {
    try {
      const response = await axios.get(`${API}/donations`);
      // In a real app, filter by user
      setUserDonations(response.data.slice(0, 3)); // Show latest 3 for demo
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  };

  const handleTrackingSearch = async () => {
    if (!trackingId.trim()) {
      toast.error("Please enter a tracking ID");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${API}/donations/${trackingId}`);
      // Navigate to tracking page or show results
      window.location.href = `/track/${trackingId}`;
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("Tracking ID not found");
      } else {
        toast.error("Failed to search tracking ID");
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800";
      case "Processed": return "bg-blue-100 text-blue-800";
      case "Picked Up": return "bg-purple-100 text-purple-800";
      case "Scheduled": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const badges = [
    { name: "First Donation", description: "Made your first clothing donation", earned: true },
    { name: "Eco Warrior", description: "Saved 10kg+ from landfills", earned: true },
    { name: "Sustainable Shopper", description: "Purchased 5+ thrift items", earned: false },
    { name: "Impact Champion", description: "Reduced 50kg+ CO₂ footprint", earned: false }
  ];

  const userStats = {
    totalDonations: userDonations.length,
    totalWeight: userDonations.reduce((sum, d) => sum + (d.estimated_weight || 0), 0),
    points: userDonations.reduce((sum, d) => sum + (d.points_earned || 0), 0),
    carbonSaved: userDonations.reduce((sum, d) => sum + (d.estimated_weight || 0) * 2.1, 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Link 
            to="/"
            className="inline-flex items-center text-blue-700 hover:text-blue-800 mb-6 transition-colors"
            data-testid="back-to-home"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <BarChart3 className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
            Your Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Track your sustainable impact and manage your donations
          </p>
        </div>

        {/* Personal Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="shadow-xl border-0 bg-white card-hover">
            <CardContent className="p-6 text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2" data-testid="user-donations">
                {userStats.totalDonations}
              </div>
              <div className="text-sm text-gray-600">Donations Made</div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white card-hover">
            <CardContent className="p-6 text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2" data-testid="user-weight">
                {userStats.totalWeight.toFixed(1)}kg
              </div>
              <div className="text-sm text-gray-600">Clothes Donated</div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white card-hover">
            <CardContent className="p-6 text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-2" data-testid="user-points">
                {userStats.points}
              </div>
              <div className="text-sm text-gray-600">Impact Points</div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white card-hover">
            <CardContent className="p-6 text-center">
              <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-orange-600 mb-2" data-testid="user-carbon">
                {userStats.carbonSaved.toFixed(1)}kg
              </div>
              <div className="text-sm text-gray-600">CO₂ Saved</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Recent Donations */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span>Recent Donations</span>
                  </span>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/donate">New Donation</Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userDonations.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No donations yet</h3>
                    <p className="text-gray-500 mb-6">Start your sustainable journey today</p>
                    <Button asChild className="btn-primary text-white">
                      <Link to="/donate">Make Your First Donation</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userDonations.map((donation) => (
                      <div 
                        key={donation.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        data-testid={`donation-${donation.id}`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="bg-green-100 p-2 rounded-full">
                            <Heart className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {donation.categories.join(", ")} Clothing
                            </div>
                            <div className="text-sm text-gray-500 flex items-center space-x-2">
                              <MapPin className="h-3 w-3" />
                              <span>{donation.city}</span>
                              <span>•</span>
                              <span>{new Date(donation.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(donation.status)}>
                            {donation.status}
                          </Badge>
                          <div className="text-sm text-gray-500 mt-1">
                            {donation.estimated_weight}kg
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Track Donation */}
          <div className="space-y-6">
            <Card className="shadow-xl border-0 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="h-5 w-5 text-blue-600" />
                  <span>Track Donation</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Enter tracking ID"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  data-testid="tracking-id-input"
                />
                <Button
                  onClick={handleTrackingSearch}
                  disabled={loading}
                  className="w-full btn-primary text-white"
                  data-testid="track-button"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Track Donation
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-xl border-0 bg-gradient-to-br from-green-500 to-emerald-600 text-white">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button asChild variant="secondary" className="w-full justify-start" size="sm">
                    <Link to="/donate" className="text-gray-800">
                      <Heart className="h-4 w-4 mr-2" />
                      Schedule Pickup
                    </Link>
                  </Button>
                  <Button asChild variant="secondary" className="w-full justify-start" size="sm">
                    <Link to="/shop" className="text-gray-800">
                      <Package className="h-4 w-4 mr-2" />
                      Browse Thrift Store
                    </Link>
                  </Button>
                  <Button asChild variant="secondary" className="w-full justify-start" size="sm">
                    <Link to="/recycling" className="text-gray-800">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Impact
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Achievements */}
        <Card className="shadow-xl border-0 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-yellow-600" />
              <span>Your Achievements</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {badges.map((badge, index) => (
                <div 
                  key={badge.name}
                  className={`flex items-center space-x-4 p-4 rounded-lg border-2 ${
                    badge.earned 
                      ? 'border-yellow-200 bg-yellow-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                  data-testid={`badge-${index}`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    badge.earned ? 'bg-yellow-100' : 'bg-gray-100'
                  }`}>
                    {badge.earned ? (
                      <CheckCircle className="h-6 w-6 text-yellow-600" />
                    ) : (
                      <Clock className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${badge.earned ? 'text-yellow-800' : 'text-gray-600'}`}>
                      {badge.name}
                    </h3>
                    <p className={`text-sm ${badge.earned ? 'text-yellow-700' : 'text-gray-500'}`}>
                      {badge.description}
                    </p>
                  </div>
                  {badge.earned && (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      Earned
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;