
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, Search, Download, Upload, CheckCircle,
  Clock, XCircle, Filter, FileUp, FilePlus
} from 'lucide-react';

const mockDocuments = [
  {
    id: 1,
    title: 'Birth Certificate - Abebe Kebede',
    requestedBy: 'Abebe Kebede',
    type: 'birth-certificate',
    status: 'approved',
    date: '2023-05-15',
    category: 'certificate'
  },
  {
    id: 2,
    title: 'Resident ID Card - Tigist Alemu',
    requestedBy: 'Tigist Alemu',
    type: 'id-card',
    status: 'pending',
    date: '2023-06-20',
    category: 'id'
  },
  {
    id: 3,
    title: 'Marriage Certificate - Solomon Bekele',
    requestedBy: 'Solomon Bekele',
    type: 'marriage-certificate',
    status: 'rejected',
    date: '2023-04-10',
    category: 'certificate'
  },
  {
    id: 4,
    title: 'Death Certificate - Deceased: Haile Gebrselassie',
    requestedBy: 'Meron Tadesse',
    type: 'death-certificate',
    status: 'approved',
    date: '2023-03-05',
    category: 'certificate'
  },
  {
    id: 5,
    title: 'Address Verification - Dawit Haile',
    requestedBy: 'Dawit Haile',
    type: 'address-verification',
    status: 'pending',
    date: '2023-07-01',
    category: 'verification'
  }
];

const DocumentsPage = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [documents, setDocuments] = useState(mockDocuments);

  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    doc.requestedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-ethiopia-green" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-ethiopia-yellow" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-ethiopia-red" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
        return <span className="text-ethiopia-green">Approved</span>;
      case 'pending':
        return <span className="text-ethiopia-yellow">Pending</span>;
      case 'rejected':
        return <span className="text-ethiopia-red">Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t('documents')}</h2>
        <p className="text-muted-foreground">
          Manage document requests, uploads and certificates
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div className="relative w-full sm:w-64">
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Search className="h-4 w-4" />
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button className="w-full sm:w-auto">
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            <FilePlus className="mr-2 h-4 w-4" />
            Request Certificate
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="id-cards">ID Cards</TabsTrigger>
          <TabsTrigger value="verifications">Verifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {filteredDocuments.length > 0 ? (
            filteredDocuments.map((doc) => (
              <Card key={doc.id} className="hover:bg-muted/50 transition-colors">
                <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{doc.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span className="mr-2">Requested by: {doc.requestedBy}</span>
                        <span>Date: {doc.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="flex items-center">
                      {getStatusIcon(doc.status)}
                      <span className="ml-1 text-sm">{getStatusText(doc.status)}</span>
                    </div>
                    {doc.status === 'approved' && (
                      <Button variant="outline" size="sm" className="flex-shrink-0">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    )}
                    {doc.status === 'pending' && (
                      <Button variant="outline" size="sm" className="flex-shrink-0">
                        View Details
                      </Button>
                    )}
                    {doc.status === 'rejected' && (
                      <Button variant="outline" size="sm" className="flex-shrink-0">
                        <FileUp className="h-4 w-4 mr-1" />
                        Resubmit
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No documents found matching your search</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="certificates" className="space-y-4">
          {filteredDocuments
            .filter(doc => doc.category === 'certificate')
            .map((doc) => (
              <Card key={doc.id} className="hover:bg-muted/50 transition-colors">
                <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{doc.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span className="mr-2">Requested by: {doc.requestedBy}</span>
                        <span>Date: {doc.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="flex items-center">
                      {getStatusIcon(doc.status)}
                      <span className="ml-1 text-sm">{getStatusText(doc.status)}</span>
                    </div>
                    {doc.status === 'approved' && (
                      <Button variant="outline" size="sm" className="flex-shrink-0">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
        
        <TabsContent value="id-cards" className="space-y-4">
          {filteredDocuments
            .filter(doc => doc.category === 'id')
            .map((doc) => (
              <Card key={doc.id} className="hover:bg-muted/50 transition-colors">
                <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{doc.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span className="mr-2">Requested by: {doc.requestedBy}</span>
                        <span>Date: {doc.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="flex items-center">
                      {getStatusIcon(doc.status)}
                      <span className="ml-1 text-sm">{getStatusText(doc.status)}</span>
                    </div>
                    {doc.status === 'approved' && (
                      <Button variant="outline" size="sm" className="flex-shrink-0">
                        Print Card
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
        
        <TabsContent value="verifications" className="space-y-4">
          {filteredDocuments
            .filter(doc => doc.category === 'verification')
            .map((doc) => (
              <Card key={doc.id} className="hover:bg-muted/50 transition-colors">
                <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{doc.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span className="mr-2">Requested by: {doc.requestedBy}</span>
                        <span>Date: {doc.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="flex items-center">
                      {getStatusIcon(doc.status)}
                      <span className="ml-1 text-sm">{getStatusText(doc.status)}</span>
                    </div>
                    <Button variant="outline" size="sm" className="flex-shrink-0">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentsPage;
