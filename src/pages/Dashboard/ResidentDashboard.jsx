
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ResidentDashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  // Mock data for document requests
  const documentRequests = [
    {
      id: 1,
      type: "Birth Certificate",
      status: "approved",
      date: "2023-05-10",
      issuedDate: "2023-05-15",
      expiryDate: "2033-05-15"
    },
    {
      id: 2,
      type: "Resident ID Card",
      status: "pending",
      date: "2023-05-20",
      estimatedCompletion: "2023-05-25"
    },
    {
      id: 3,
      type: "Address Verification",
      status: "rejected",
      date: "2023-05-05",
      reason: "Incomplete supporting documents"
    }
  ];

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <div className="flex items-center text-sm">
            <CheckCircle className="h-4 w-4 text-ethiopia-green mr-1" />
            <span className="text-ethiopia-green">{t('approved')}</span>
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 text-ethiopia-yellow mr-1" />
            <span className="text-ethiopia-yellow">{t('pending')}</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center text-sm">
            <AlertCircle className="h-4 w-4 text-ethiopia-red mr-1" />
            <span className="text-ethiopia-red">{t('rejected')}</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t('dashboard')}</h2>
        <p className="text-muted-foreground">
          {t('welcome')}, {user?.name}!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>{t('documents')}</CardTitle>
            <CardDescription>Manage your document requests and certificates</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="active">
              <TabsList>
                <TabsTrigger value="active">Active Requests</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
              <TabsContent value="active" className="space-y-4 mt-4">
                {documentRequests
                  .filter(doc => doc.status === 'pending')
                  .map(doc => (
                    <div key={doc.id} className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center">
                        <div className="rounded-full p-2 bg-blue-100 mr-4">
                          <FileText className="h-5 w-5 text-blue-700" />
                        </div>
                        <div>
                          <p className="font-medium">{doc.type}</p>
                          <p className="text-xs text-muted-foreground">Requested on {doc.date}</p>
                          <p className="text-xs text-muted-foreground">Estimated completion: {doc.estimatedCompletion}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {renderStatusBadge(doc.status)}
                      </div>
                    </div>
                  ))}
                {documentRequests.filter(doc => doc.status === 'pending').length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No active requests
                  </div>
                )}
              </TabsContent>
              <TabsContent value="completed" className="space-y-4 mt-4">
                {documentRequests
                  .filter(doc => doc.status === 'approved')
                  .map(doc => (
                    <div key={doc.id} className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center">
                        <div className="rounded-full p-2 bg-green-100 mr-4">
                          <FileText className="h-5 w-5 text-green-700" />
                        </div>
                        <div>
                          <p className="font-medium">{doc.type}</p>
                          <p className="text-xs text-muted-foreground">Issued on {doc.issuedDate}</p>
                          <p className="text-xs text-muted-foreground">Expires on {doc.expiryDate}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">Download</Button>
                    </div>
                  ))}
                {documentRequests.filter(doc => doc.status === 'approved').length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No completed requests
                  </div>
                )}
              </TabsContent>
              <TabsContent value="rejected" className="space-y-4 mt-4">
                {documentRequests
                  .filter(doc => doc.status === 'rejected')
                  .map(doc => (
                    <div key={doc.id} className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center">
                        <div className="rounded-full p-2 bg-red-100 mr-4">
                          <FileText className="h-5 w-5 text-red-700" />
                        </div>
                        <div>
                          <p className="font-medium">{doc.type}</p>
                          <p className="text-xs text-muted-foreground">Requested on {doc.date}</p>
                          <p className="text-xs text-ethiopia-red">Reason: {doc.reason}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">Reapply</Button>
                    </div>
                  ))}
                {documentRequests.filter(doc => doc.status === 'rejected').length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No rejected requests
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Request New Document</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Resident Profile</CardTitle>
            <CardDescription>Your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-3xl font-bold">{user?.name}
                    //check it this value
                    {console.log("this value is unknown"+user.name)}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-sm text-muted-foreground">ID Number</span>
                  <span className="text-sm font-medium">ETH-125687</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-sm text-muted-foreground">Address</span>
                  <span className="text-sm font-medium">Zone 4, Kebele 08</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-sm text-muted-foreground">Phone</span>
                  <span className="text-sm font-medium">+251 912 345 678</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Registration Date</span>
                  <span className="text-sm font-medium">15 Jan 2023</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Update Profile</Button>
          </CardFooter>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-ethiopia-yellow/10 border border-ethiopia-yellow/20 rounded-md p-4">
              <h4 className="font-semibold text-sm">ID Card Renewal Notice</h4>
              <p className="text-sm mt-1">All residents with ID cards issued before 2020 should visit the Kebele office for renewal.</p>
              <p className="text-xs text-muted-foreground mt-2">Posted: 3 days ago</p>
            </div>
            <div className="bg-muted rounded-md p-4">
              <h4 className="font-semibold text-sm">New Census Registration</h4>
              <p className="text-sm mt-1">National census registration will begin next month. Please ensure your household information is up to date.</p>
              <p className="text-xs text-muted-foreground mt-2">Posted: 1 week ago</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResidentDashboard;
