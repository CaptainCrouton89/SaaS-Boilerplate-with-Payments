import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

export function Dashboard() {
  const user = useQuery(api.auth.loggedInUser);
  const subscription = useQuery(api.subscriptions.getUserSubscription);

  if (!user) return null;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">
          Welcome back, {user.name || user.email}!
        </h1>
        <p className="text-muted-foreground">
          Your personal dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Account Status */}
        <Card>
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
            <CardDescription>Your current account information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Email:</span> {user.email}
              </p>
              {user.name && (
                <p className="text-sm">
                  <span className="font-medium">Name:</span> {user.name}
                </p>
              )}
              <p className="text-sm">
                <span className="font-medium">Plan:</span>{" "}
                <span className={subscription ? "text-green-600" : "text-orange-600"}>
                  {subscription ? subscription.planName : "Free"}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/profile">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Edit Profile
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/profile?tab=billing">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Manage Billing
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Subscription Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>Current plan overview</CardDescription>
          </CardHeader>
          <CardContent>
            {subscription ? (
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Plan:</span> {subscription.planName}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Status:</span>{" "}
                  <span className="text-green-600 capitalize">{subscription.status}</span>
                </p>
                <Button asChild size="sm" className="w-full mt-3">
                  <Link to="/profile?tab=billing">View Details</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  You're currently on the free plan
                </p>
                <Button asChild size="sm" className="w-full">
                  <Link to="/profile?tab=billing">Upgrade Now</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest account activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No recent activity to display</p>
            <p className="text-sm mt-1">Activity will appear here as you use the platform</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
