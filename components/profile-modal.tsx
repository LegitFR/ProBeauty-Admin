"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Settings,
  Bell,
  Lock,
  Camera,
  Save,
  Edit3,
  Calendar,
  Clock,
  Activity,
  Award,
  Briefcase,
  Globe,
  Smartphone,
  Eye,
  EyeOff,
} from "lucide-react";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: string;
  department: string;
  location: string;
  timezone: string;
  language: string;
  joinDate: string;
  lastLogin: string;
  bio: string;
  permissions: string[];
  twoFactorEnabled: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profile, setProfile] = useState<UserProfile>({
    id: "admin-001",
    name: "ProBeauty Admin",
    email: "admin@probeauty.com",
    phone: "+1 (555) 123-4567",
    avatar: "/api/placeholder/128/128",
    role: "Super Admin",
    department: "Operations",
    location: "New York, USA",
    timezone: "UTC-5 (EST)",
    language: "English",
    joinDate: "January 15, 2023",
    lastLogin: "Today at 9:24 AM",
    bio: "Experienced beauty industry professional with over 8 years in salon management and operations. Passionate about leveraging technology to enhance customer experiences and streamline business operations.",
    permissions: [
      "Full System Access",
      "User Management",
      "Financial Reports",
      "System Configuration",
      "Data Export",
      "Analytics Dashboard",
    ],
    twoFactorEnabled: true,
    emailNotifications: true,
    pushNotifications: true,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const updateProfile = (field: keyof UserProfile, value: any) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updatePasswordForm = (field: string, value: string) => {
    setPasswordForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = () => {
    // Handle save logic
    setIsEditing(false);
    console.log("Profile saved:", profile);
  };

  const handlePasswordChange = () => {
    // Handle password change logic
    console.log("Password change requested");
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const activityLogs = [
    {
      action: "Logged in",
      timestamp: "Today at 9:24 AM",
      device: "Chrome on Windows",
      location: "New York, USA",
    },
    {
      action: "Updated salon information",
      timestamp: "Yesterday at 4:15 PM",
      device: "Chrome on Windows",
      location: "New York, USA",
    },
    {
      action: "Generated financial report",
      timestamp: "Yesterday at 2:30 PM",
      device: "Safari on iPhone",
      location: "New York, USA",
    },
    {
      action: "Approved new customer registration",
      timestamp: "Nov 24 at 11:45 AM",
      device: "Chrome on Windows",
      location: "New York, USA",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <User className="h-6 w-6 text-primary" />
            Profile & Settings
          </DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-4 rounded-2xl">
            <TabsTrigger value="profile" className="rounded-xl">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="rounded-xl">
              <Lock className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="preferences" className="rounded-xl">
              <Settings className="h-4 w-4 mr-2" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="activity" className="rounded-xl">
              <Activity className="h-4 w-4 mr-2" />
              Activity
            </TabsTrigger>
          </TabsList>

          <div className="max-h-[60vh] overflow-y-auto">
            <TabsContent value="profile" className="space-y-6 mt-0">
              {/* Profile Header */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={profile.avatar} alt={profile.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                          {profile.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Button
                          size="sm"
                          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-primary hover:bg-primary/90"
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-2xl font-bold">{profile.name}</h3>
                          <p className="text-muted-foreground">
                            {profile.email}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <Badge className="bg-primary/10 text-primary border-primary/20">
                              <Shield className="h-3 w-3 mr-1" />
                              {profile.role}
                            </Badge>
                            <Badge variant="outline">
                              <Briefcase className="h-3 w-3 mr-1" />
                              {profile.department}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          onClick={() => setIsEditing(!isEditing)}
                          variant={isEditing ? "default" : "outline"}
                          className="rounded-2xl"
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          {isEditing ? "Save Changes" : "Edit Profile"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input
                        value={profile.name}
                        onChange={(e) => updateProfile("name", e.target.value)}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-muted/50" : ""}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input
                        type="email"
                        value={profile.email}
                        onChange={(e) => updateProfile("email", e.target.value)}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-muted/50" : ""}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => updateProfile("phone", e.target.value)}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-muted/50" : ""}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Bio</Label>
                      <Textarea
                        value={profile.bio}
                        onChange={(e) => updateProfile("bio", e.target.value)}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-muted/50" : ""}
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Work Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Select
                        value={profile.role}
                        onValueChange={(value: string) =>
                          updateProfile("role", value)
                        }
                        disabled={!isEditing}
                      >
                        <SelectTrigger
                          className={!isEditing ? "bg-muted/50" : ""}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Super Admin">
                            Super Admin
                          </SelectItem>
                          <SelectItem value="Finance Admin">
                            Finance Admin
                          </SelectItem>
                          <SelectItem value="Support Admin">
                            Support Admin
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Input
                        value={profile.department}
                        onChange={(e) =>
                          updateProfile("department", e.target.value)
                        }
                        disabled={!isEditing}
                        className={!isEditing ? "bg-muted/50" : ""}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input
                        value={profile.location}
                        onChange={(e) =>
                          updateProfile("location", e.target.value)
                        }
                        disabled={!isEditing}
                        className={!isEditing ? "bg-muted/50" : ""}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Timezone</Label>
                      <Select
                        value={profile.timezone}
                        onValueChange={(value: string) =>
                          updateProfile("timezone", value)
                        }
                        disabled={!isEditing}
                      >
                        <SelectTrigger
                          className={!isEditing ? "bg-muted/50" : ""}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC-5 (EST)">
                            UTC-5 (Eastern Time)
                          </SelectItem>
                          <SelectItem value="UTC-6 (CST)">
                            UTC-6 (Central Time)
                          </SelectItem>
                          <SelectItem value="UTC-7 (MST)">
                            UTC-7 (Mountain Time)
                          </SelectItem>
                          <SelectItem value="UTC-8 (PST)">
                            UTC-8 (Pacific Time)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Language</Label>
                      <Select
                        value={profile.language}
                        onValueChange={(value: string) =>
                          updateProfile("language", value)
                        }
                        disabled={!isEditing}
                      >
                        <SelectTrigger
                          className={!isEditing ? "bg-muted/50" : ""}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Spanish">Spanish</SelectItem>
                          <SelectItem value="French">French</SelectItem>
                          <SelectItem value="German">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Account Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Account Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-muted/30 rounded-xl">
                      <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Member Since
                      </p>
                      <p className="font-semibold">{profile.joinDate}</p>
                    </div>

                    <div className="text-center p-4 bg-muted/30 rounded-xl">
                      <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Last Login
                      </p>
                      <p className="font-semibold">{profile.lastLogin}</p>
                    </div>

                    <div className="text-center p-4 bg-muted/30 rounded-xl">
                      <Award className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Access Level
                      </p>
                      <p className="font-semibold">Full Access</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {isEditing && (
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="rounded-2xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveProfile}
                    className="bg-primary hover:bg-primary/90 rounded-2xl"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="security" className="space-y-6 mt-0">
              {/* Password Change */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Change Password
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Current Password</Label>
                    <div className="relative">
                      <Input
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        onChange={(e) =>
                          updatePasswordForm("currentPassword", e.target.value)
                        }
                        placeholder="Enter current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          updatePasswordForm("newPassword", e.target.value)
                        }
                        placeholder="Enter new password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          updatePasswordForm("confirmPassword", e.target.value)
                        }
                        placeholder="Confirm new password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={handlePasswordChange}
                    className="bg-primary hover:bg-primary/90 rounded-2xl"
                  >
                    Update Password
                  </Button>
                </CardContent>
              </Card>

              {/* Two-Factor Authentication */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Two-Factor Authentication
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Enable 2FA</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch
                      checked={profile.twoFactorEnabled}
                      onCheckedChange={(value: boolean) =>
                        updateProfile("twoFactorEnabled", value)
                      }
                    />
                  </div>

                  {profile.twoFactorEnabled && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                      <div className="flex items-center gap-2 text-green-800">
                        <Shield className="h-4 w-4" />
                        <span className="font-medium">
                          Two-factor authentication is enabled
                        </span>
                      </div>
                      <p className="text-sm text-green-700 mt-1">
                        Your account is protected with authenticator app
                        verification
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Permissions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Permissions & Access
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {profile.permissions.map((permission, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl"
                      >
                        <Shield className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">
                          {permission}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6 mt-0">
              {/* Notification Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive updates via email
                      </p>
                    </div>
                    <Switch
                      checked={profile.emailNotifications}
                      onCheckedChange={(value: boolean) =>
                        updateProfile("emailNotifications", value)
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Browser push notifications
                      </p>
                    </div>
                    <Switch
                      checked={profile.pushNotifications}
                      onCheckedChange={(value: boolean) =>
                        updateProfile("pushNotifications", value)
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Display Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Display Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <Select defaultValue="system">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Date Format</Label>
                    <Select defaultValue="mm/dd/yyyy">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Time Format</Label>
                    <Select defaultValue="12">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">12-hour</SelectItem>
                        <SelectItem value="24">24-hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activityLogs.map((log, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 border rounded-xl"
                      >
                        <div className="p-2 bg-primary/10 rounded-full">
                          <Activity className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{log.action}</p>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {log.timestamp}
                            </span>
                            <span className="flex items-center gap-1">
                              <Smartphone className="h-3 w-3" />
                              {log.device}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {log.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="rounded-2xl">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
