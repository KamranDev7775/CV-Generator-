import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FileText, LogOut, Edit, Eye, Download } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { setSecureStorage } from '../utils/storage';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [cvSubmissions, setCvSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      console.log('Current user email:', currentUser.email);
      
      // Fetch user's subscription
      const subs = await base44.entities.Subscription.filter({ user_email: currentUser.email });
      console.log('Found subscriptions:', subs);
      const activeSub = subs.find(s => s.status === 'active' || s.status === 'trialing');
      console.log('Active subscription:', activeSub);
      setSubscription(activeSub || null);
      
      // Fetch user's CV submissions - show all for subscribers, only paid for others
      const submissions = await base44.entities.CVSubmission.filter({ created_by: currentUser.email });
      if (activeSub) {
        // Subscribers see all their CVs
        setCvSubmissions(submissions);
      } else {
        // Non-subscribers only see paid CVs
        setCvSubmissions(submissions.filter(s => s.payment_status === 'completed'));
      }
    } catch (error) {
      console.error('Dashboard load error:', error);
      navigate(createPageUrl('Home'));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await base44.auth.logout();
    navigate(createPageUrl('Home'));
  };

  const handleEditCV = (cv) => {
    // Load CV data into localStorage so Home page can pick it up
    const formData = {
      full_name: cv.full_name || '',
      target_position: cv.target_position || '',
      location: cv.location || '',
      email: cv.email || '',
      phone: cv.phone || '',
      linkedin_url: cv.linkedin_url || '',
      summary: cv.summary || cv.generated_cv || '',
      auto_generate_summary: false,
      skills: cv.skills || '',
      experiences: cv.experiences || [{ job_title: '', company: '', location: '', start_date: '', end_date: '', achievements: '' }],
      education: cv.education || [{ degree: '', university: '', location: '', start_date: '', end_date: '' }],
      languages: cv.languages || '',
      languagesList: [],
      target_country: cv.target_country || 'Germany',
      seniority_level: cv.seniority_level || 'Mid',
      job_description: cv.job_description || '',
      template: cv.template || 'classic',
      style: cv.style || 'professional'
    };
    
    // Store in secure localStorage
    setSecureStorage('form_data', formData);
    
    // Navigate to Home with edit mode flag
    navigate(createPageUrl('Home') + '?edit=true');
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
                  <span className={`px-3 py-1 text-sm ${subscription ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                    {subscription ? (subscription.plan_type === 'monthly' ? 'Monthly Subscription' : 'Trial Access') : 'Free Account'}
                  </span>
                </div>
                {subscription ? (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Status</span>
                      <span className="text-green-600 capitalize">{subscription.status}</span>
                    </div>
                    {subscription.current_period_end && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">{subscription.plan_type === 'monthly' ? 'Renews' : 'Access until'}</span>
                        <span className="text-gray-900">{new Date(subscription.current_period_end).toLocaleDateString()}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-600">
                      Subscribe to unlock CV generation, PDF export, and cover letter features.
                    </p>
                    <Button
                      onClick={() => navigate(createPageUrl('Pricing'))}
                      className="w-full bg-black text-white hover:bg-gray-900 py-6 text-base font-normal rounded-none"
                    >
                      View Pricing Plans
                    </Button>
                  </>
                )}
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
                
                {cvSubmissions.length > 0 && (
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500 mb-3">Your CVs ({cvSubmissions.length})</p>
                    {cvSubmissions.map((cv) => (
                      <div key={cv.id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                        <div>
                          <span className="text-gray-900 font-medium">{cv.full_name || 'CV'}</span>
                          <p className="text-xs text-gray-400">
                            {new Date(cv.created_date).toLocaleDateString()}
                            {cv.target_position && <span className="ml-2 text-gray-500">• {cv.target_position}</span>}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditCV(cv)}
                            className="border-gray-200 text-gray-700 hover:bg-gray-50 rounded-none"
                            title="Edit this CV"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(createPageUrl('Success') + `?submission_id=${cv.id}`)}
                            className="border-gray-200 text-gray-700 hover:bg-gray-50 rounded-none"
                            title="View & Download"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}