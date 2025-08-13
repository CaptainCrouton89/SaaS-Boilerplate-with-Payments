import { useAction, useQuery, useMutation } from "convex/react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../../convex/_generated/api";
import { PaymentHistory } from "../components/PaymentHistory";
import { PricingSection } from "../components/PricingSection";
import { SubscriptionCard } from "../components/SubscriptionCard";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { useAuthErrorHandler } from "../hooks/useAuthErrorHandler";

export function ProfilePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useQuery(api.auth.loggedInUser);
  const subscription = useQuery(api.subscriptions.getUserSubscription);
  const payments = useQuery(api.payments.getUserPayments);
  const createPortalSession = useAction(api.payments.createPortalSession);
  const updateUserName = useMutation(api.auth.updateUserName);
  const updatePassword = useAction(api.auth.updatePassword);
  const { handleAuthError } = useAuthErrorHandler();

  const currentTab = searchParams.get("tab") || "profile";

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  // Update profileData when user data changes
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleTabChange = (value: string) => {
    if (value === "profile") {
      searchParams.delete("tab");
    } else {
      searchParams.set("tab", value);
    }
    setSearchParams(searchParams);
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleProfileSave = async () => {
    try {
      await updateUserName({ name: profileData.name });
      toast.success("Profile updated successfully!");
    } catch (error) {
      if (!(await handleAuthError(error))) {
        toast.error("Failed to update profile");
      }
    }
  };

  const handleManageBilling = async () => {
    try {
      const { url } = await createPortalSession();
      window.open(url, "_blank");
    } catch (error) {
      if (!(await handleAuthError(error))) {
        toast.error("Failed to open billing portal");
      }
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (!/\d/.test(passwordData.newPassword)) {
      toast.error("Password must contain at least one digit");
      return;
    }

    if (!/[a-z]/.test(passwordData.newPassword)) {
      toast.error("Password must contain at least one lowercase letter");
      return;
    }

    if (!/[A-Z]/.test(passwordData.newPassword)) {
      toast.error("Password must contain at least one uppercase letter");
      return;
    }

    try {
      await updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success("Password updated successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      if (!(await handleAuthError(error))) {
        toast.error("Failed to update password");
      }
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-primary mb-2">
          Profile Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account settings and billing information
        </p>
      </div>

      <Tabs
        value={currentTab}
        onValueChange={handleTabChange}
        className="space-y-8"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and contact information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    placeholder="your@email.com"
                    disabled
                  />
                  <p className="text-xs text-gray-500">
                    Contact support to change your email address
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => void handleProfileSave()}>
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Overview</CardTitle>
              <CardDescription>
                Your account details and membership status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Account ID</p>
                    <p className="font-mono text-sm bg-gray-50 px-2 py-1 rounded">
                      {user._id}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-medium">
                      {new Date(user._creationTime).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Account Status</p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Subscription Status</p>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        subscription
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {subscription ? "Subscribed" : "Free"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-8">
          {/* Current Subscription */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <SubscriptionCard subscription={subscription || null} />
            
            <Card>
              <CardHeader>
                <CardTitle>Billing Portal</CardTitle>
                <CardDescription>
                  Manage your subscription, payment methods, and download
                  invoices.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => void handleManageBilling()}
                  className="w-full"
                >
                  Open Billing Portal
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  You'll be redirected to Stripe's secure portal to manage
                  your billing.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Upgrade Section (only show if no subscription) */}
          {!subscription && (
            <>
              <Separator />
              <div>
                <h2 className="text-2xl font-semibold mb-4">Choose a Plan</h2>
                <PricingSection />
              </div>
            </>
          )}

          {/* Payment History */}
          <Separator />
          <div>
            <h2 className="text-2xl font-semibold mb-4">Payment History</h2>
            <PaymentHistory payments={payments || []} />
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Password & Security</CardTitle>
              <CardDescription>
                Manage your account security settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">Change Password</h3>
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      name="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter your current password"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      name="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter your new password"
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Must be at least 8 characters with uppercase, lowercase, and number
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirm-password"
                      name="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm your new password"
                      required
                    />
                  </div>
                  <Button type="submit">Update Password</Button>
                </form>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-3">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Add an extra layer of security to your account.
                </p>
                <Button variant="outline" disabled>
                  Enable 2FA (Coming Soon)
                </Button>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-3 text-red-600">Danger Zone</h3>
                <div className="space-y-4 p-4 border border-red-200 rounded-lg bg-red-50">
                  <div>
                    <h4 className="font-medium text-red-800">Delete Account</h4>
                    <p className="text-sm text-red-600 mt-1">
                      Permanently delete your account and all associated data.
                      This action cannot be undone.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-100"
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
