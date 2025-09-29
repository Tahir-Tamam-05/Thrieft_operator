import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Recycle,
  TrendingUp,
  Users,
  Leaf,
  Award,
  ArrowLeft,
  Target,
  TreePine,
  Droplets,
  Zap
} from "lucide-react";

const RecyclingPage = ({ impactStats }) => {
  const [animatedStats, setAnimatedStats] = useState({
    clothes_collected: 0,
    carbon_saved: 0,
    donors: 0,
    reuse_rate: 0
  });

  useEffect(() => {
    if (impactStats) {
      // Animate numbers
      const duration = 2000; // 2 seconds
      const steps = 60;
      const stepDuration = duration / steps;
      
      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        setAnimatedStats({
          clothes_collected: Math.round(impactStats.total_clothes_collected_kg * progress),
          carbon_saved: Math.round(impactStats.carbon_footprint_saved_kg * progress),
          donors: Math.round(impactStats.total_donors * progress),
          reuse_rate: Math.round(((impactStats.total_items_reused / 
            (impactStats.total_items_reused + impactStats.total_items_recycled)) * 100 || 0) * progress)
        });

        if (currentStep >= steps) {
          clearInterval(timer);
        }
      }, stepDuration);

      return () => clearInterval(timer);
    }
  }, [impactStats]);

  const achievements = [
    {
      icon: TreePine,
      title: "Forest Guardian",
      description: "Saved equivalent of 15 trees from being cut down",
      progress: 85,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      icon: Droplets,
      title: "Water Saver",
      description: "Conserved 2,500 liters of water in textile production",
      progress: 70,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      icon: Zap,
      title: "Energy Efficient",
      description: "Reduced energy consumption by 1,200 kWh",
      progress: 92,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    },
    {
      icon: Recycle,
      title: "Recycling Champion",
      description: "Diverted 95% of donated items from landfills",
      progress: 95,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  const monthlyData = [
    { month: "Jan", donations: 85, recycled: 45, reused: 40 },
    { month: "Feb", donations: 92, recycled: 52, reused: 40 },
    { month: "Mar", donations: 78, recycled: 38, reused: 40 },
    { month: "Apr", donations: 105, recycled: 58, reused: 47 },
    { month: "May", donations: 120, recycled: 65, reused: 55 },
    { month: "Jun", donations: 98, recycled: 48, reused: 50 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <Recycle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
            Environmental Impact Tracking
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            See the real-time environmental impact of our community's sustainable fashion choices
          </p>
        </div>

        {/* Main Impact Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="shadow-xl border-0 bg-white card-hover">
            <CardContent className="p-6 text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Recycle className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2 counter" data-testid="clothes-collected-stat">
                {animatedStats.clothes_collected}kg
              </div>
              <div className="text-sm text-gray-600">Clothes Collected</div>
              <div className="text-xs text-green-600 mt-1">↑ 15% this month</div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white card-hover">
            <CardContent className="p-6 text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2 counter" data-testid="carbon-saved-stat">
                {animatedStats.carbon_saved}kg
              </div>
              <div className="text-sm text-gray-600">CO₂ Saved</div>
              <div className="text-xs text-blue-600 mt-1">↑ 22% this month</div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white card-hover">
            <CardContent className="p-6 text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-2 counter" data-testid="donors-stat">
                {animatedStats.donors}
              </div>
              <div className="text-sm text-gray-600">Active Donors</div>
              <div className="text-xs text-purple-600 mt-1">↑ 8% this month</div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white card-hover">
            <CardContent className="p-6 text-center">
              <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-orange-600 mb-2 counter" data-testid="reuse-rate-stat">
                {animatedStats.reuse_rate}%
              </div>
              <div className="text-sm text-gray-600">Reuse Rate</div>
              <div className="text-xs text-orange-600 mt-1">↑ 5% this month</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Impact Breakdown */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-green-600" />
                  <span>Monthly Impact Breakdown</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6" data-testid="monthly-breakdown">
                  {monthlyData.map((data, index) => (
                    <div key={data.month} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">{data.month} 2024</span>
                        <span className="text-sm text-gray-500">{data.donations}kg total</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-16 text-sm text-gray-600">Reused</div>
                          <Progress 
                            value={(data.reused / data.donations) * 100} 
                            className="flex-1 h-3"
                          />
                          <div className="w-12 text-sm font-medium text-green-600">{data.reused}kg</div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-16 text-sm text-gray-600">Recycled</div>
                          <Progress 
                            value={(data.recycled / data.donations) * 100} 
                            className="flex-1 h-3"
                          />
                          <div className="w-12 text-sm font-medium text-blue-600">{data.recycled}kg</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Environmental Benefits */}
          <div>
            <Card className="shadow-xl border-0 bg-gradient-to-br from-green-500 to-emerald-600 text-white">
              <CardHeader>
                <CardTitle className="text-white">Global Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-green-100">Water Saved</span>
                    <span className="font-bold">2,500L</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-green-100">Energy Saved</span>
                    <span className="font-bold">1,200 kWh</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-green-100">Landfill Diverted</span>
                    <span className="font-bold">95%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-green-100">Trees Saved</span>
                    <span className="font-bold">15 trees</span>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-green-400">
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-2">Rank #1</div>
                    <div className="text-green-100 text-sm">Most Sustainable Community</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Achievements Section */}
        <Card className="shadow-xl border-0 bg-white mb-12">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-yellow-600" />
              <span>Community Achievements</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <div 
                    key={achievement.title}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover-lift"
                    data-testid={`achievement-${index}`}
                  >
                    <div className={`w-12 h-12 ${achievement.bgColor} rounded-full flex items-center justify-center`}>
                      <Icon className={`h-6 w-6 ${achievement.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {achievement.progress}%
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                      <Progress value={achievement.progress} className="h-2" />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="shadow-xl border-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
          <CardContent className="p-12 text-center">
            <Leaf className="h-16 w-16 mx-auto mb-6 text-green-200" />
            <h2 className="text-3xl font-display font-bold mb-4">
              Ready to Increase Your Impact?
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Join our mission to create a more sustainable future through conscious fashion choices
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                size="lg"
                className="bg-white text-green-600 hover:bg-green-50 px-8 py-4 rounded-full font-semibold shadow-xl text-lg"
                data-testid="donate-more-cta"
              >
                <Link to="/donate">Donate More Clothes</Link>
              </Button>
              <Button 
                asChild
                variant="outline"
                size="lg"
                className="px-8 py-4 rounded-full font-semibold border-2 border-white text-white hover:bg-white hover:text-green-600 shadow-xl text-lg"
                data-testid="view-dashboard-cta"
              >
                <Link to="/dashboard">View My Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecyclingPage;