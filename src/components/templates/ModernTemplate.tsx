import React from 'react';

interface CertificateData {
  recipientName: string;
  courseName: string;
  completionDate: string;
  instructorName: string;
  organizationName: string;
  certificateType: string;
}

interface ModernTemplateProps {
  data: CertificateData;
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({ data }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getCertificateTitle = (type: string) => {
    switch (type) {
      case 'completion': return 'Certificate of Completion';
      case 'achievement': return 'Certificate of Achievement';
      case 'appreciation': return 'Certificate of Appreciation';
      case 'participation': return 'Certificate of Participation';
      default: return 'Certificate of Completion';
    }
  };

  return (
    <div className="w-full h-[600px] bg-gradient-to-br from-blue-50 to-blue-100 border-8 border-blue-600 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border-4 border-blue-300 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 border-4 border-blue-300 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border-4 border-blue-300 rounded-full"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center px-12 text-center">
        {/* Organization */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-blue-800 mb-2">
            {data.organizationName || 'Professional Learning Institute'}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto"></div>
        </div>

        {/* Certificate Title */}
        <h2 className="text-4xl font-serif font-bold text-blue-900 mb-8">
          {getCertificateTitle(data.certificateType)}
        </h2>

        {/* Presented to */}
        <p className="text-lg text-gray-600 mb-4">This is to certify that</p>
        
        {/* Recipient Name */}
        <h3 className="text-5xl font-serif font-bold text-blue-800 mb-6 border-b-2 border-blue-300 pb-2">
          {data.recipientName || 'Recipient Name'}
        </h3>

        {/* Course Details */}
        <p className="text-lg text-gray-700 mb-2">has successfully completed</p>
        <h4 className="text-2xl font-semibold text-blue-700 mb-8">
          {data.courseName || 'Course Name'}
        </h4>

        {/* Date and Instructor */}
        <div className="flex justify-between items-end w-full mt-auto pt-8">
          <div className="text-center">
            <div className="w-32 border-b-2 border-gray-400 mb-2"></div>
            <p className="text-sm text-gray-600">Date</p>
            <p className="font-medium text-gray-800">{formatDate(data.completionDate)}</p>
          </div>
          
          <div className="text-center">
            <div className="w-32 border-b-2 border-gray-400 mb-2"></div>
            <p className="text-sm text-gray-600">Instructor</p>
            <p className="font-medium text-gray-800">{data.instructorName || 'Instructor Name'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
