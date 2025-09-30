import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Search,
  Package,
  CheckCircle,
  Clock,
  Truck,
  Recycle,
  ArrowLeft,
  MapPin,
  Calendar,
  Phone,
  Mail,
  User
} from "lucide-react";

const TrackingPage = () => {
  const { trackingId: urlTrackingId } = useParams();
  const navigate = useNavigate();
  const [trackingId, setTrackingId] = useState(urlTrackingId || "");
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (urlTrackingId) {
      searchDonation(urlTrackingId);
    }
  }, [urlTrackingId]);

  const searchDonation = async (id = trackingId) => {
    if (!id.trim()) {
      toast.error("Please enter a tracking ID");
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const response = await api.get(`/api/donations/${id}`);
      setDonation(response.data);
    } catch (error) {
      console.error("Error fetching donation:", error);
      if (error.response?.status === 404) {
        toast.error("Tracking ID not found");
        setDonation(null);
      } else {
        toast.error("Failed to fetch donation details");
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "Scheduled":
        return {
          icon: Calendar,
          color: "text-yellow-600",
          bgColor: "bg-yellow-100",
          description: "Your donation pickup has been scheduled"
        };
      case "Picked Up":
        return {
          icon: Truck,
          color: "text-blue-600",
          bgColor: "bg-blue-100",
          description: "Your clothes have been collected by our team"
        };
      case "Processed":
        return {
          icon: Package,
          color: "text-purple-600",
          bgColor: "bg-purple-100",
          description: "Items are being sorted and prepared for reuse or recycling"
        };
      case "Completed":
        return {
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-100",
          description: "Your donation has been successfully processed!"
        };
      default:
        return {
          icon: Clock,
          color: "text-gray-600",
          bgColor: "bg-gray-100",
          description: "Status unknown"
        };
    }
  };

  const getStatusSteps = () => {
    const steps = ["Scheduled", "Picked Up", "Processed", "Completed"];
    const currentIndex = donation ? steps.indexOf(donation.status) : -1;
    
    return steps.map((step, index) => ({
      name: step,
      completed: index <= currentIndex,
      current: index === currentIndex
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Link 
            to="/"
            className="inline-flex items-center text-green-700 hover:text-green-800 mb-6 transition-colors"
            data-testid="back-to-home"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
            Track Your Donation
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Enter your tracking ID to see the status and impact of your clothing donation
          </p>
        </div>

        {/* Search Form */}
        <Card className="shadow-xl border-0 bg-white mb-8">
          <CardContent className="p-8">
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Enter your tracking ID (e.g., DN12345678)"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="text-lg py-3"
                  data-testid="tracking-search-input"
                />
              </div>
              <Button
                onClick={() => searchDonation()}
                disabled={loading}
                className="btn-primary text-white px-8 py-3 text-lg"
                data-testid="search-tracking-button"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    Track
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {searched && !loading && !donation && (
          <Card className="shadow-xl border-0 bg-white">
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-600 mb-4">Donation Not Found</h2>
              <p className="text-gray-500 mb-6">
                We couldn't find a donation with that tracking ID. Please double-check the ID and try again.
              </p>
              <div className="text-sm text-gray-400">
                <p>Tracking IDs are usually in the format: DN12345678</p>
              </div>
            </CardContent>
          </Card>
        )}

        {donation && (
          <div className="space-y-8">
            {/* Status Overview */}
            <Card className="shadow-xl border-0 bg-white" data-testid="donation-details">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <Package className="h-6 w-6 text-green-600" />
                    <span>Donation Status</span>
                  </span>
                  <Badge className="text-lg px-4 py-2 bg-green-100 text-green-800">
                    {donation.tracking_id}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-8">
                  {(() => {
                    const statusInfo = getStatusInfo(donation.status);
                    const Icon = statusInfo.icon;
                    return (
                      <div className="flex items-center space-x-4 p-6 bg-gray-50 rounded-lg">
                        <div className={`w-16 h-16 ${statusInfo.bgColor} rounded-full flex items-center justify-center`}>
                          <Icon className={`h-8 w-8 ${statusInfo.color}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{donation.status}</h3>
                          <p className="text-gray-600">{statusInfo.description}</p>
                        </div>
                        {donation.status === "Completed" && (
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">+{donation.points_earned}</div>
                            <div className="text-sm text-gray-500">Impact Points</div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Progress Steps */}
                <div className="mb-8">
                  <h4 className="font-semibold text-gray-900 mb-4">Progress Timeline</h4>
                  <div className="flex items-center justify-between">
                    {getStatusSteps().map((step, index) => (
                      <div key={step.name} className="flex-1 relative">
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                            step.completed 
                              ? 'bg-green-600 border-green-600 text-white' 
                              : step.current
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'bg-gray-200 border-gray-300 text-gray-500'
                          }`}>
                            {step.completed ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : (
                              <span className="text-sm font-bold">{index + 1}</span>
                            )}
                          </div>
                          <div className={`mt-2 text-xs text-center ${
                            step.completed || step.current ? 'text-gray-900 font-medium' : 'text-gray-500'
                          }`}>
                            {step.name}
                          </div>
                        </div>
                        {index < getStatusSteps().length - 1 && (
                          <div className={`absolute top-5 left-1/2 w-full h-0.5 ${
                            step.completed ? 'bg-green-600' : 'bg-gray-300'
                          }`} style={{ transform: 'translateX(50%)' }} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Donation Details */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Donation Details</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Package className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Categories: {donation.categories.join(", ")}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Pickup: {donation.pickup_date} at {donation.pickup_time}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">{donation.address}, {donation.city}</span>
                      </div>
                      {donation.estimated_weight && (
                        <div className="flex items-center space-x-3">
                          <Recycle className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Estimated Weight: {donation.estimated_weight}kg</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Contact Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">{donation.donor_name}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">{donation.email}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">{donation.phone}</span>
                      </div>
                    </div>

                    {donation.special_instructions && (
                      <div className="mt-6">
                        <h5 className="font-medium text-gray-900 mb-2">Special Instructions</h5>
                        <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded">
                          {donation.special_instructions}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Impact Card */}
            {donation.status === "Completed" && (
              <Card className="shadow-xl border-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-16 w-16 mx-auto mb-6 text-green-200" />
                  <h2 className="text-3xl font-display font-bold mb-4">
                    Thank You for Your Impact!
                  </h2>
                  <div className="grid md:grid-cols-3 gap-6 mt-8">
                    <div>
                      <div className="text-2xl font-bold mb-2">{donation.points_earned}</div>
                      <div className="text-green-200">Impact Points Earned</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold mb-2">{(donation.estimated_weight * 2.1).toFixed(1)}kg</div>
                      <div className="text-green-200">CO₂ Saved</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold mb-2">{donation.estimated_weight}kg</div>
                      <div className="text-green-200">Diverted from Landfills</div>
                    </div>
                  </div>
                  <div className="mt-8">
                    <Button 
                      asChild
                      variant="secondary"
                      size="lg"
                      className="bg-white text-green-600 hover:bg-green-50 px-8 py-3 text-lg"
                    >
                      <Link to="/donate">Make Another Donation</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingPage;
