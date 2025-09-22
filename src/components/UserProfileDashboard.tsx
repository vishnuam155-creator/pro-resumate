import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Mail, 
  Calendar, 
  CreditCard, 
  Upload, 
  Settings, 
  Crown,
  CheckCircle,
  XCircle,
  Edit,
  Save,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  plan: string;
  uploads_used: number;
  upload_limit: number;
  date_joined: string;
  is_email_verified: boolean;
  profile_picture?: string;
}

interface UserProfileDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  authToken: string;
  onUpgrade: () => void;
}

export const UserProfileDashboard: React.FC<UserProfileDashboardProps> = ({
  isOpen,
  onClose,
  authToken,
  onUpgrade
}) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({});
  const { toast } = useToast();

  const API_BASE = 'http://127.0.0.1:8000';

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/profile/`, {
        headers: {
          'Authorization': `Token ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setEditedProfile(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to load profile",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Connection failed",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/profile/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Token ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedProfile)
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Profile updated successfully",
          variant: "default"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update profile",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Update failed",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendVerificationEmail = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/resend-verification/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast({
          title: "Email Sent",
          description: "Verification email sent successfully",
          variant: "default"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send verification email",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && authToken) {
      fetchProfile();
    }
  }, [isOpen, authToken]);

  if (!profile) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl">
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const planColors = {
    basic: "bg-gray-100 text-gray-800",
    premium: "bg-blue-100 text-blue-800",
    pro: "bg-purple-100 text-purple-800"
  };

  const usagePercentage = (profile.uploads_used / profile.upload_limit) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl gradient-text flex items-center gap-2">
            <User className="h-6 w-6" />
            Profile Dashboard
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="usage">Usage & Plans</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  <Button
                    variant={isEditing ? "outline" : "ghost"}
                    size="sm"
                    onClick={() => {
                      if (isEditing) {
                        setEditedProfile(profile);
                      }
                      setIsEditing(!isEditing);
                    }}
                  >
                    {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    {isEditing ? (
                      <Input
                        value={editedProfile.first_name || ''}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, first_name: e.target.value }))}
                        placeholder="Enter first name"
                      />
                    ) : (
                      <p className="text-sm font-medium">{profile.first_name || 'Not provided'}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    {isEditing ? (
                      <Input
                        value={editedProfile.last_name || ''}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, last_name: e.target.value }))}
                        placeholder="Enter last name"
                      />
                    ) : (
                      <p className="text-sm font-medium">{profile.last_name || 'Not provided'}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Username</Label>
                    <p className="text-sm font-medium">{profile.username}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{profile.email}</p>
                      {profile.is_email_verified ? (
                        <Badge variant="secondary" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Badge variant="destructive" className="text-xs">
                            <XCircle className="h-3 w-3 mr-1" />
                            Unverified
                          </Badge>
                          <Button size="sm" variant="outline" onClick={sendVerificationEmail}>
                            Verify
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Member Since</Label>
                    <p className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(profile.date_joined).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {isEditing && (
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={updateProfile} disabled={isLoading}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Current Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Crown className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="text-xl font-semibold capitalize">{profile.plan} Plan</h3>
                      <p className="text-sm text-muted-foreground">
                        {profile.upload_limit} uploads per month
                      </p>
                    </div>
                  </div>
                  <Badge className={planColors[profile.plan as keyof typeof planColors] || planColors.basic}>
                    {profile.plan.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Upload Usage</span>
                    <span>{profile.uploads_used} / {profile.upload_limit}</span>
                  </div>
                  <Progress value={usagePercentage} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {profile.upload_limit - profile.uploads_used} uploads remaining this month
                  </p>
                </div>

                {profile.plan === 'basic' && (
                  <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <h4 className="font-semibold text-primary mb-2">Upgrade Your Plan</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Get more uploads, advanced features, and priority support
                    </p>
                    <Button onClick={onUpgrade} variant="hero" size="sm">
                      Upgrade Now
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Available Plans
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="text-center">
                      <h3 className="font-semibold">Basic</h3>
                      <p className="text-2xl font-bold">Free</p>
                      <p className="text-sm text-muted-foreground">5 uploads/month</p>
                    </div>
                    <ul className="text-sm space-y-1">
                      <li>• Basic ATS scoring</li>
                      <li>• Resume analysis</li>
                      <li>• Standard support</li>
                    </ul>
                  </div>
                  
                  <div className="border-2 border-primary rounded-lg p-4 space-y-3 relative">
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      Popular
                    </Badge>
                    <div className="text-center">
                      <h3 className="font-semibold">Premium</h3>
                      <p className="text-2xl font-bold">$9.99</p>
                      <p className="text-sm text-muted-foreground">50 uploads/month</p>
                    </div>
                    <ul className="text-sm space-y-1">
                      <li>• Advanced ATS scoring</li>
                      <li>• Detailed feedback</li>
                      <li>• Job matching</li>
                      <li>• Priority support</li>
                    </ul>
                  </div>
                  
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="text-center">
                      <h3 className="font-semibold">Pro</h3>
                      <p className="text-2xl font-bold">$19.99</p>
                      <p className="text-sm text-muted-foreground">Unlimited uploads</p>
                    </div>
                    <ul className="text-sm space-y-1">
                      <li>• Everything in Premium</li>
                      <li>• Custom resume builder</li>
                      <li>• API access</li>
                      <li>• Dedicated support</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <Button onClick={onUpgrade} variant="hero">
                    Choose Your Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Email Notifications</h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-sm">Resume analysis results</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-sm">Monthly usage reports</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Marketing emails</span>
                    </label>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Privacy Settings</h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-sm">Make profile public</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Allow data export</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-3">
                  <h4 className="font-medium text-destructive">Danger Zone</h4>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">
                      Export Data
                    </Button>
                    <Button variant="destructive" size="sm">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};