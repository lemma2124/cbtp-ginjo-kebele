
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  User, Key, Bell, Moon, Languages, 
  Shield, LogOut, Save
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const SettingsPage = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t("settings")}</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="account">
            <Key className="h-4 w-4 mr-2" />
            Account
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Moon className="h-4 w-4 mr-2" />
            Appearance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex flex-col items-center space-y-2">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={user?.photo_path}
                      alt={`${user?.first_name} ${user?.last_name}`}
                    />
                    <AvatarFallback>
                      {user?.first_name?.[0]}
                      {user?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    Change Photo
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      disabled
                      id="displayName"
                      defaultValue={[
                        user?.first_name,
                        user?.middle_name,
                        user?.last_name,
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      defaultValue={user?.username}
                     
                      disabled
                    
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Role</Label>
                    <Input
                      id="username"
                      defaultValue={user?.role}
                      readonly
                      disabled
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      disabled
                      defaultValue={user?.email_address}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      disabled
                      id="phone"
                      defaultValue={user?.phone_number}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nationalId">National ID</Label>
                    <Input
                      disabled
                      id="nationalId"
                      defaultValue={user?.national_id}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Input disabled id="gender" defaultValue={user?.gender} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      disabled
                      id="dob"
                      defaultValue={user?.date_of_birth}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      disabled
                      id="address"
                      defaultValue={[
                        user?.house_number,
                        user?.street_name,
                        user?.subcity,
                        user?.city,
                        user?.postal_code,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    />
                  </div>
                </div>
              </div>
              

              {console.log(user?.role)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Password & Security</CardTitle>
              <CardDescription>
                Update your password and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Change Password</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="text" />
                  </div>
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>Update Password</Button>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  Two-Factor Authentication
                </h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div>SMS Authentication</div>
                    <div className="text-sm text-muted-foreground">
                      Receive a code on your phone when signing in
                    </div>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div>Email Authentication</div>
                    <div className="text-sm text-muted-foreground">
                      Receive a code on your email when signing in
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-destructive">
                  Danger Zone
                </h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div>Log out of all devices</div>
                    <div className="text-sm text-muted-foreground">
                      This will log you out from all devices except this one
                    </div>
                  </div>
                  <Button variant="outline">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out all devices
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to be notified
                {console.log(user.notifications)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">In-App Notifications</h3>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div>Document Approval Status</div>
                      <div className="text-sm text-muted-foreground">
                        Get notified when your document requests are approved or
                        rejected
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div>New Announcements</div>
                      <div className="text-sm text-muted-foreground">
                        Get notified when new kebele announcements are posted
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div>System Updates</div>
                      <div className="text-sm text-muted-foreground">
                        Get notified about system maintenance and updates
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Notifications</h3>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div>Document Status Updates</div>
                      <div className="text-sm text-muted-foreground">
                        Receive emails about document request status changes
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div>Important Announcements</div>
                      <div className="text-sm text-muted-foreground">
                        Receive emails about important kebele announcements
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">SMS Notifications</h3>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div>Document Ready for Pickup</div>
                      <div className="text-sm text-muted-foreground">
                        Receive SMS when your documents are ready for pickup
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div>Urgent Notifications</div>
                      <div className="text-sm text-muted-foreground">
                        Receive SMS for urgent notifications and emergencies
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <Button>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize the appearance of the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Theme</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div>Dark Mode</div>
                    <div className="text-sm text-muted-foreground">
                      Switch between light and dark theme
                    </div>
                  </div>
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={toggleTheme}
                  />
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Language</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div>Display Language</div>
                    <div className="text-sm text-muted-foreground">
                      Choose your preferred language
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={language === "en" ? "default" : "outline"}
                      size="sm"
                      onClick={() => language !== "en" && toggleLanguage()}
                      className="w-20"
                    >
                      English
                    </Button>
                    <Button
                      variant={language === "am" ? "default" : "outline"}
                      size="sm"
                      onClick={() => language !== "am" && toggleLanguage()}
                      className="w-20 amharic"
                    >
                      አማርኛ
                    </Button>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Date & Time Format</h3>

                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="h-8">
                      DD/MM/YYYY
                    </Button>
                    <Button variant="default" size="sm" className="h-8">
                      MM/DD/YYYY
                    </Button>
                    <Button variant="outline" size="sm" className="h-8">
                      YYYY-MM-DD
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Time Format</Label>
                  <div className="flex gap-2">
                    <Button variant="default" size="sm" className="h-8">
                      12-hour
                    </Button>
                    <Button variant="outline" size="sm" className="h-8">
                      24-hour
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <Button>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
