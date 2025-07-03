
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, FileText, Upload } from 'lucide-react';

const RequestCertificatePage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    certificateType: '',
    fullName: '',
    idNumber: '',
    purpose: '',
    urgency: 'normal',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Certificate request submitted:', formData);
    
    toast({
      title: "Request Submitted",
      description: "Your certificate request has been submitted successfully",
    });
    
    navigate('/documents');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => navigate('/documents')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Request Certificate</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Certificate Request Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="certificateType">Certificate Type</Label>
                <Select 
                  value={formData.certificateType}
                  onValueChange={(value) => handleSelectChange('certificateType', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select certificate type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="birth">Birth Certificate</SelectItem>
                    <SelectItem value="death">Death Certificate</SelectItem>
                    <SelectItem value="marriage">Marriage Certificate</SelectItem>
                    <SelectItem value="residency">Residency Certificate</SelectItem>
                    <SelectItem value="family">Family Certificate</SelectItem>
                    <SelectItem value="id-card">ID Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input 
                  id="fullName" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name" 
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="idNumber">ID Number</Label>
                <Input 
                  id="idNumber" 
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleChange}
                  placeholder="ETH-000000" 
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="urgency">Urgency Level</Label>
                <Select 
                  value={formData.urgency}
                  onValueChange={(value) => handleSelectChange('urgency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal (3-5 business days)</SelectItem>
                    <SelectItem value="urgent">Urgent (1-2 business days)</SelectItem>
                    <SelectItem value="emergency">Emergency (Same day)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="purpose">Purpose of Certificate</Label>
                <Textarea 
                  id="purpose" 
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  placeholder="Please explain why you need this certificate"
                  className="min-h-[100px]" 
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label>Supporting Documents (Optional)</Label>
              <div className="border-dashed border-2 border-input rounded-md p-6 flex flex-col items-center justify-center">
                <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                <div className="space-y-2 text-center">
                  <div>Drag and drop supporting documents, or</div>
                  <Button type="button" size="sm">
                    <Upload className="h-4 w-4 mr-2" /> Browse Files
                  </Button>
                  <div className="text-xs text-muted-foreground">
                    PDF, JPEG or PNG, max 10MB
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center pt-4 space-x-2">
              <input 
                type="checkbox" 
                id="declaration" 
                className="w-4 h-4 rounded border-gray-300 focus:ring-ethiopia-green"
                required
              />
              <Label htmlFor="declaration" className="text-sm">
                I declare that the information provided is accurate and true to the best of my knowledge
              </Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={() => navigate('/documents')}>
                Cancel
              </Button>
              <Button type="submit">
                Submit Request
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestCertificatePage;
