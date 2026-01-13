import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FileText, LogOut } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
    } catch (error) {
      navigate(createPageUrl('Home'));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await base44.auth.logout();
    navigate(createPageUrl('Home'));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="px-6 md:px-12 lg:px-24 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-light text-black">Dashboard</h1>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-gray-200 text-gray-600 hover:bg-gray-100 rounded-none"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Account Info */}
          <Card className="mb-6 rounded-none border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-light">Account Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Email</span>
                  <span className="text-gray-900">{user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Name</span>
                  <span className="text-gray-900">{user?.full_name || 'Not set'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Status */}
          <Card className="mb-6 rounded-none border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-light">Subscription Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Active Plan</span>
                  <span className="px-3 py-1 bg-black text-white text-sm">
                    Free Account
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Subscribe to unlock CV generation, PDF export, and cover letter features.
                </p>
                <Button
                  onClick={() => navigate(createPageUrl('Pricing'))}
                  className="w-full bg-black text-white hover:bg-gray-900 py-6 text-base font-normal rounded-none"
                >
                  View Pricing Plans
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* CV Actions */}
          <Card className="rounded-none border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-light">Your Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  onClick={() => navigate(createPageUrl('Home'))}
                  variant="outline"
                  className="w-full border-gray-200 text-black hover:bg-gray-50 py-6 text-base font-normal rounded-none"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Create / Edit CV
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}