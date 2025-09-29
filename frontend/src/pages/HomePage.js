import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  ShoppingBag,
  Recycle,
  Users,
  TrendingUp,
  Leaf,
  Package,
  ArrowRight,
  CheckCircle
} from "lucide-react";

const HomePage = ({ impactStats }) => {
  const features = [
    {
      icon: Heart,
      title: "Donate Clothes",
      description: "Schedule easy pickups for your unwanted clothes and give them a second life",
      link: "/donate",
      color: "bg-red-50 text-red-600",
      buttonText: "Start Donating"
    },
    {
      icon: ShoppingBag,
      title: "Shop Thrift",
      description: "Discover unique, affordable pieces while supporting sustainability",
      link: "/shop",
      color: "bg-blue-50 text-blue-600",
      buttonText: "Browse Items"
    },
    {
      icon: Recycle,
      title: "Track Impact",
      description: "See how your donations contribute to environmental conservation",
      link: "/recycling",
      color: "bg-green-50 text-green-600",
      buttonText: "View Impact"
    }
  ];

  const benefits = [
    "Reduce textile waste in landfills",
    "Support local community members",
    "Earn rewards for sustainable actions",
    "Shop affordable, quality clothing",
    "Track your environmental impact"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative hero-gradient min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left space-y-8 animate-fadeInUp">
              <div className="space-y-4">
                <Badge 
                  variant="secondary" 
                  className="bg-white/80 text-green-700 px-4 py-2 text-sm font-medium"
                  data-testid="hero-badge"
                >
                  🌱 Sustainable Fashion Platform
                </Badge>
                <h1 className="text-5xl lg:text-7xl font-display font-bold text-gray-900 leading-tight">
                  Give Clothes a{" "}
                  <span className="text-green-600 relative">
                    Second Life
                    <div className="absolute inset-0 bg-green-200 blur-2xl opacity-30 -z-10"></div>
                  </span>
                </h1>
                <p className="text-xl text-gray-600 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  Transform your wardrobe sustainably. Donate clothes you no longer wear, 
                  shop unique thrift finds, and track your environmental impact.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  asChild
                  size="lg"
                  className="btn-primary text-white px-8 py-4 rounded-full font-semibold shadow-xl text-lg group"
                  data-testid="donate-clothes-cta"
                >
                  <Link to="/donate" className="flex items-center space-x-2">
                    <Heart className="h-5 w-5" />
                    <span>Donate Clothes</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </Button>
                <Button 
                  asChild
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 rounded-full font-semibold border-2 border-green-200 text-green-700 hover:bg-green-50 shadow-lg text-lg group"
                  data-testid="shop-thrift-cta"
                >
                  <Link to="/shop" className="flex items-center space-x-2">
                    <ShoppingBag className="h-5 w-5" />
                    <span>Shop Thrift</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </Button>
              </div>

              {/* Impact Stats Row */}
              {impactStats && (
                <div className="grid grid-cols-3 gap-4 pt-8" data-testid="hero-impact-stats">
                  <div className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-green-600 counter">
                      {Math.round(impactStats.total_clothes_collected_kg)}kg
                    </div>
                    <div className="text-sm text-gray-600">Clothes Saved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-blue-600 counter">
                      {impactStats.total_donors}
                    </div>
                    <div className="text-sm text-gray-600">Donors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-emerald-600 counter">
                      {Math.round(impactStats.carbon_footprint_saved_kg)}kg
                    </div>
                    <div className="text-sm text-gray-600">CO₂ Saved</div>
                  </div>
                </div>
              )}
            </div>

            {/* Hero Image */}
            <div className="relative animate-slideInRight">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl hover-lift">
                <img
                  src="https://images.unsplash.com/photo-1573612664822-d7d347da7b80"
                  alt="Sustainable thrift clothing rack"
                  className="w-full h-[600px] object-cover"
                  data-testid="hero-image"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Floating Stats Card */}
              <Card className="absolute -bottom-6 -left-6 glass shadow-xl animate-scaleIn">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">95%</div>
                      <div className="text-sm text-gray-600">Waste Reduction</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">
              How ThriftLife Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple steps to make a sustainable impact on fashion and the environment
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={feature.title}
                  className="card-hover border-0 shadow-lg bg-gradient-to-br from-white to-gray-50"
                  data-testid={`feature-card-${index}`}
                >
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {feature.description}
                    </p>
                    <Button 
                      asChild
                      className="w-full rounded-full font-semibold"
                      variant="outline"
                      data-testid={`feature-button-${index}`}
                    >
                      <Link to={feature.link}>
                        {feature.buttonText}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-display font-bold text-gray-900 mb-6">
                Why Choose Sustainable Fashion?
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Join thousands of conscious consumers making a positive environmental impact 
                through thoughtful clothing choices.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div 
                    key={index}
                    className="flex items-start space-x-3"
                    data-testid={`benefit-${index}`}
                  >
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="pt-8">
                <Button 
                  asChild
                  size="lg"
                  className="btn-primary text-white px-8 py-4 rounded-full font-semibold shadow-xl text-lg"
                  data-testid="track-impact-cta"
                >
                  <Link to="/recycling" className="flex items-center space-x-2">
                    <Recycle className="h-5 w-5" />
                    <span>Track Your Impact</span>
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1724500171238-159dc7e3afed"
                alt="Recycling and sustainability impact"
                className="w-full h-96 object-cover rounded-2xl shadow-xl hover-lift"
                data-testid="benefits-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Leaf className="h-16 w-16 text-green-400 mx-auto mb-6" />
            <h2 className="text-4xl font-display font-bold mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              Start your sustainable fashion journey today. Every donation and purchase 
              creates positive environmental change.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-semibold shadow-xl text-lg"
              data-testid="final-donate-cta"
            >
              <Link to="/donate">Start Donating</Link>
            </Button>
            <Button 
              asChild
              variant="outline"
              size="lg"
              className="px-8 py-4 rounded-full font-semibold border-2 border-white text-white hover:bg-white hover:text-gray-900 shadow-xl text-lg"
              data-testid="final-shop-cta"
            >
              <Link to="/shop">Explore Thrift Store</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;