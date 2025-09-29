import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Shield,
  Package,
  Users,
  TrendingUp,
  Plus,
  Edit,
  ArrowLeft,
  Calendar,
  MapPin,
  Phone,
  Mail
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminPage = () => {
  const [donations, setDonations] = useState([]);
  const [thriftItems, setThriftItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    category: "",
    size: "",
    condition: "",
    price: "",
    images: []
  });

  const categories = ["Men", "Women", "Kids", "Accessories", "Mixed/Textile Waste"];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const conditions = ["Excellent", "Good", "Fair", "Needs Repair"];
  const donationStatuses = ["Scheduled", "Picked Up", "Processed", "Completed"];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [donationsRes, itemsRes] = await Promise.all([
        axios.get(`${API}/donations`),
        axios.get(`${API}/thrift-items`)
      ]);
      setDonations(donationsRes.data);
      setThriftItems(itemsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const updateDonationStatus = async (donationId, newStatus, assignedAgent = "") => {
    try {
      await axios.put(`${API}/donations/${donationId}/status`, null, {
        params: { 
          new_status: newStatus,
          ...(assignedAgent && { assigned_agent: assignedAgent })
        }
      });
      
      setDonations(donations.map(d => 
        d.id === donationId 
          ? { ...d, status: newStatus, assigned_agent: assignedAgent }
          : d
      ));
      
      toast.success("Donation status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update donation status");
    }
  };

  const addThriftItem = async (e) => {
    e.preventDefault();
    
    try {
      const itemData = {
        ...newItem,
        price: parseFloat(newItem.price),
        images: newItem.images.length > 0 ? newItem.images : ["https://via.placeholder.com/300x300?text=No+Image"]
      };

      const response = await axios.post(`${API}/thrift-items`, itemData);
      setThriftItems([...thriftItems, response.data]);
      setNewItem({
        name: "",
        description: "",
        category: "",
        size: "",
        condition: "",
        price: "",
        images: []
      });
      setShowAddItem(false);
      toast.success("Item added to thrift store successfully");
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("Failed to add item");
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4"></div>
            <p className="text-gray-700 font-medium">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Link 
            to="/"
            className="inline-flex items-center text-gray-700 hover:text-gray-800 mb-6 transition-colors"
            data-testid="back-to-home"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="h-8 w-8 text-gray-600" />
          </div>
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
            Admin Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Manage donations, inventory, and track platform operations
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="shadow-lg border-0 bg-white">
            <CardContent className="p-6 text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-2" data-testid="total-donations">
                {donations.length}
              </div>
              <div className="text-sm text-gray-600">Total Donations</div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white">
            <CardContent className="p-6 text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600 mb-2" data-testid="pending-pickups">
                {donations.filter(d => d.status === "Scheduled").length}
              </div>
              <div className="text-sm text-gray-600">Pending Pickups</div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white">
            <CardContent className="p-6 text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-600 mb-2" data-testid="thrift-inventory">
                {thriftItems.length}
              </div>
              <div className="text-sm text-gray-600">Thrift Inventory</div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white">
            <CardContent className="p-6 text-center">
              <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-600 mb-2" data-testid="completion-rate">
                {donations.length > 0 ? Math.round((donations.filter(d => d.status === "Completed").length / donations.length) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-600">Completion Rate</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Donation Management */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span>Donation Requests</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {donations.map((donation) => (
                    <div 
                      key={donation.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      data-testid={`admin-donation-${donation.id}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{donation.donor_name}</h3>
                          <div className="text-sm text-gray-500 space-y-1">
                            <div className="flex items-center space-x-1">
                              <Mail className="h-3 w-3" />
                              <span>{donation.email}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Phone className="h-3 w-3" />
                              <span>{donation.phone}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{donation.address}, {donation.city}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(donation.status)}>
                            {donation.status}
                          </Badge>
                          <div className="text-sm text-gray-500 mt-1">
                            ID: {donation.tracking_id}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label className="text-xs text-gray-500">Categories</Label>
                          <div className="text-sm">{donation.categories.join(", ")}</div>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Pickup Date</Label>
                          <div className="text-sm">{donation.pickup_date} at {donation.pickup_time}</div>
                        </div>
                      </div>

                      {donation.status !== "Completed" && (
                        <div className="flex space-x-2">
                          <Select
                            value={donation.status || undefined}
                            onValueChange={(newStatus) => updateDonationStatus(donation.id, newStatus)}
                          >
                            <SelectTrigger className="flex-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {donationStatuses.map(status => (
                                <SelectItem key={status} value={status}>{status}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateDonationStatus(donation.id, donation.status, "Agent-001")}
                          >
                            Assign Agent
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Inventory Management */}
          <div>
            <Card className="shadow-xl border-0 bg-white mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-purple-600" />
                    <span>Inventory</span>
                  </span>
                  <Button 
                    onClick={() => setShowAddItem(!showAddItem)}
                    size="sm"
                    className="btn-primary text-white"
                    data-testid="add-item-toggle"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Item
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {showAddItem && (
                  <form onSubmit={addThriftItem} className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="name" className="text-sm">Item Name</Label>
                        <Input
                          id="name"
                          value={newItem.name}
                          onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                          required
                          data-testid="item-name-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="price" className="text-sm">Price ($)</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={newItem.price}
                          onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                          required
                          data-testid="item-price-input"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-sm">Description</Label>
                      <Textarea
                        id="description"
                        value={newItem.description}
                        onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                        rows={2}
                        data-testid="item-description-input"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label className="text-sm">Category</Label>
                        <Select value={newItem.category || undefined} onValueChange={(value) => setNewItem({...newItem, category: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(cat => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm">Size</Label>
                        <Select value={newItem.size} onValueChange={(value) => setNewItem({...newItem, size: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Size" />
                          </SelectTrigger>
                          <SelectContent>
                            {sizes.map(size => (
                              <SelectItem key={size} value={size}>{size}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm">Condition</Label>
                        <Select value={newItem.condition} onValueChange={(value) => setNewItem({...newItem, condition: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Condition" />
                          </SelectTrigger>
                          <SelectContent>
                            {conditions.map(cond => (
                              <SelectItem key={cond} value={cond}>{cond}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button type="submit" className="btn-primary text-white flex-1" data-testid="add-item-submit">
                        Add to Store
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowAddItem(false)}
                        data-testid="cancel-add-item"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}

                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {thriftItems.slice(0, 5).map((item) => (
                    <div 
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      data-testid={`admin-item-${item.id}`}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-gray-500">
                          {item.category} • Size {item.size} • {item.condition}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-purple-600">${item.price}</div>
                        <Button variant="ghost" size="sm" className="p-1">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;