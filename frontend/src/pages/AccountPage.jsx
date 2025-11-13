import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Package, Heart, Settings } from 'lucide-react';
import { trpc } from '../utils/trpc';

function AccountPage() {
  // Fetch user profile
  const userQuery = trpc.user.getProfile.useQuery();
  const user = userQuery.data;

  // Fetch orders
  const ordersQuery = trpc.orders.getUserOrders.useQuery();
  const orders = ordersQuery.data || [];

  // Fetch wishlist
  const wishlistQuery = trpc.wishlist.getUserWishlist.useQuery();
  const wishlistItems = wishlistQuery.data || [];

  // Delete account mutation
  const deleteAccountMutation = trpc.user.deleteAccount.useMutation({
    onSuccess: () => {
      alert('Account deleted successfully.');
      window.location.href = '/';
    },
    onError: (err) => alert('Error deleting account: ' + err.message),
  });

  return (
    <div className="w-full py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold mb-8">My Account</h1>

        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="orders">
              <Package className="h-4 w-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="wishlist">
              <Heart className="h-4 w-4 mr-2" />
              Wishlist
            </TabsTrigger>
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Orders */}
          <TabsContent value="orders" className="mt-6">
            {ordersQuery.isLoading ? (
              <p>Loading orders...</p>
            ) : ordersQuery.error ? (
              <p>Error: {ordersQuery.error.message}</p>
            ) : orders.length === 0 ? (
              <p>You have no orders yet.</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg mb-2">Order {order.id}</h3>
                          <p className="text-sm text-muted-foreground mb-1">Date: {order.date}</p>
                          <p className="text-sm text-muted-foreground">{order.items} items</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary mb-2">${order.total.toFixed(2)}</p>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          Track Order
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Wishlist */}
          <TabsContent value="wishlist" className="mt-6">
            {wishlistQuery.isLoading ? (
              <p>Loading wishlist...</p>
            ) : wishlistQuery.error ? (
              <p>Error: {wishlistQuery.error.message}</p>
            ) : wishlistItems.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
                  <p className="text-muted-foreground mb-6">
                    Save your favorite products to your wishlist
                  </p>
                  <Button>Browse Products</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {wishlistItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-6">
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-muted-foreground">${item.price}</p>
                      <Button variant="outline" size="sm">
                        View Product
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Profile */}
          <TabsContent value="profile" className="mt-6">
            {userQuery.isLoading ? (
              <p>Loading profile...</p>
            ) : userQuery.error ? (
              <p>Error: {userQuery.error.message}</p>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">First Name</p>
                      <p className="font-medium">{user?.firstName || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Last Name</p>
                      <p className="font-medium">{user?.lastName || 'N/A'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{user?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{user?.phone || 'N/A'}</p>
                  </div>
                  <Button>Edit Profile</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive order updates via email</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                <div className="flex justify-between items-center py-3 border-b">
                  <div>
                    <p className="font-medium">Change Password</p>
                    <p className="text-sm text-muted-foreground">Update your account password</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Change
                  </Button>
                </div>
                <div className="flex justify-between items-center py-3">
                  <div>
                    <p className="font-medium">Delete Account</p>
                    <p className="text-sm text-muted-foreground">Permanently delete your account</p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete your account?')) {
                        deleteAccountMutation.mutate();
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default AccountPage;
