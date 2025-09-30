import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import {
  Heart,
  MapPin,
  Phone,
  Mail,
  Calendar as CalendarIcon,
  Clock,
  Package,
  Camera,
  CheckCircle,
  ArrowLeft
} from "lucide-react";
import { format } from "date-fns";

const DonatePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    donor_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
    pickup_date: "",
    pickup_time: "",
    categories: [],
    estimated_weight: "",
    special_instructions: ""
  });

  const [selectedDate, setSelectedDate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [trackingId, setTrackingId] = useState("");

  const categories = [
    { id: "Men", label: "Men's Clothing", icon: "👔" },
    { id: "Women", label: "Women's Clothing", icon: "👗" },
    { id: "Kids", label: "Kids' Clothing", icon: "👶" },
    { id: "Accessories", label: "Accessories", icon: "👜" },
    { id: "Mixed/Textile Waste", label: "Mixed/Textile Waste", icon: "🧵" }
  ];

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCategoryChange = (categoryId, checked) => {
    if (checked) {
      setFormData({
        ...formData,
        categories: [...formData.categories, categoryId]
      });
    } else {
      setFormData({
        ...formData,
        categories: formData.categories.filter(id => id !== categoryId)
      });
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setFormData({
      ...formData,
      pickup_date: format(date, "yyyy-MM-dd")
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validation
      if (!formData.donor_name || !formData.email || !formData.phone || 
          !formData.address || !formData.pickup_date || !formData.pickup_time || 
          formData.categories.length === 0) {
        toast.error("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }

      const response = await api.post('/api/donations', {
        ...formData,
        estimated_weight: formData.estimated_weight ? parseFloat(formData.estimated_weight) : null
      });

      setTrackingId(response.data.tracking_id);
      setShowConfirmation(true);
      toast.success("Donation request submitted successfully!");

    } catch (error) {
      console.error("Error submitting donation:", error);
      toast.error("Failed to submit donation request");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-xl border-0 bg-white" data-testid="confirmation-card">
            <CardContent className="p-12 text-center">
              <div className="mb-8">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h1 className="text-3xl font-display font-bold text-gray-900 mb-4">
                  Donation Scheduled Successfully!
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Thank you for choosing to give your clothes a second life. Our team will contact you soon.
                </p>
              </div>

              <Card className="bg-green-50 border-green-200 mb-8">
                <CardContent className="p-6">
                  <div className="text-center">
                    <Label className="text-sm font-medium text-green-700 uppercase tracking-wide">
                      Your Tracking ID
                    </Label>
                    <div 
                      className="text-2xl font-bold text-green-800 mt-2 font-mono tracking-wider"
                      data-testid="tracking-id-display"
                    >
                      {trackingId}
                    </div>
                    <p className="text-sm text-green-600 mt-2">
                      Save this ID to track your donation progress
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Button 
                  onClick={() => navigate(`/track/${trackingId}`)}
                  className="w-full btn-primary text-white py-3 rounded-full font-semibold"
                  data-testid="track-donation-button"
                >
                  Track My Donation
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="w-full py-3 rounded-full font-semibold"
                  data-testid="back-home-button"
                >
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6 text-green-700 hover:text-green-800"
            data-testid="back-to-home"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
            Donate Your Clothes
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Schedule a convenient pickup for your unwanted clothes and help reduce textile waste
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Personal Information */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mail className="h-5 w-5 text-green-600" />
                    <span>Contact Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="donor_name" className="text-sm font-medium text-gray-700">
                        Full Name *
                      </Label>
                      <Input
                        id="donor_name"
                        name="donor_name"
                        value={formData.donor_name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                        className="mt-1"
                        data-testid="donor-name-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        required
                        className="mt-1"
                        data-testid="email-input"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(555) 123-4567"
                      required
                      className="mt-1"
                      data-testid="phone-input"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Address Information */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-green-600" />
                    <span>Pickup Address</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                      Street Address *
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="123 Main Street"
                      required
                      className="mt-1"
                      data-testid="address-input"
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                        City *
                      </Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Your city"
                        required
                        className="mt-1"
                        data-testid="city-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="postal_code" className="text-sm font-medium text-gray-700">
                        Postal Code *
                      </Label>
                      <Input
                        id="postal_code"
                        name="postal_code"
                        value={formData.postal_code}
                        onChange={handleInputChange}
                        placeholder="12345"
                        required
                        className="mt-1"
                        data-testid="postal-code-input"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Scheduling */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CalendarIcon className="h-5 w-5 text-green-600" />
                    <span>Schedule Pickup</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        Pickup Date *
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                            data-testid="date-picker-trigger"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleDateSelect}
                            disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                            initialFocus
                            data-testid="date-picker-calendar"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div>
                      <Label htmlFor="pickup_time" className="text-sm font-medium text-gray-700">
                        Preferred Time *
                      </Label>
                      <select
                        id="pickup_time"
                        name="pickup_time"
                        value={formData.pickup_time}
                        onChange={handleInputChange}
                        required
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        data-testid="time-select"
                      >
                        <option value="">Select time</option>
                        {timeSlots.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Clothing Categories */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-green-600" />
                    <span>Clothing Categories</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {categories.map(category => (
                      <div key={category.id} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <Checkbox
                          id={category.id}
                          checked={formData.categories.includes(category.id)}
                          onCheckedChange={(checked) => handleCategoryChange(category.id, checked)}
                          data-testid={`category-${category.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                        />
                        <Label htmlFor={category.id} className="flex items-center space-x-2 cursor-pointer flex-1">
                          <span className="text-2xl">{category.icon}</span>
                          <span className="font-medium">{category.label}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Additional Details */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-lg">Additional Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="estimated_weight" className="text-sm font-medium text-gray-700">
                      Estimated Weight (kg)
                    </Label>
                    <Input
                      id="estimated_weight"
                      name="estimated_weight"
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.estimated_weight}
                      onChange={handleInputChange}
                      placeholder="5.5"
                      className="mt-1"
                      data-testid="weight-input"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Helps us calculate your impact points
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="special_instructions" className="text-sm font-medium text-gray-700">
                      Special Instructions
                    </Label>
                    <Textarea
                      id="special_instructions"
                      name="special_instructions"
                      value={formData.special_instructions}
                      onChange={handleInputChange}
                      placeholder="Any special instructions for pickup..."
                      className="mt-1"
                      rows={4}
                      data-testid="instructions-textarea"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary text-white py-4 rounded-full font-semibold shadow-xl text-lg"
                data-testid="submit-donation-button"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Scheduling...
                  </>
                ) : (
                  <>
                    <Heart className="h-5 w-5 mr-2" />
                    Schedule Donation
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonatePage;
