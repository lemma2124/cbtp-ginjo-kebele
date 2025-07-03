import React from 'react';

interface CertificateData {
  recipientName: string;
  courseName: string;
  completionDate: string;
  instructorName: string;
  organizationName: string;
  certificateType: string;
}

interface ElegantTemplateProps {
  data: CertificateData;
}

const ElegantTemplate: React.FC<ElegantTemplateProps> = ({ data }) => {
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
    <div className="w-full h-[600px] bg-gradient-to-br from-amber-50 to-yellow-50 border-8 border-double border-yellow-600 relative overflow-hidden">
      {/* Decorative Corners */}
      <div className="absolute top-4 left-4 w-16 h-16 border-l-4 border-t-4 border-yellow-600"></div>
      <div className="absolute top-4 right-4 w-16 h-16 border-r-4 border-t-4 border-yellow-600"></div>
      <div className="absolute bottom-4 left-4 w-16 h-16 border-l-4 border-b-4 border-yellow-600"></div>
      <div className="absolute bottom-4 right-4 w-16 h-16 border-r-4 border-b-4 border-yellow-600"></div>

      {/* Ornamental Design */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="w-96 h-96 border-4 border-yellow-400 rounded-full flex items-center justify-center">
          <div className="w-64 h-64 border-2 border-yellow-400 rounded-full flex items-center justify-center">
            <div className="w-32 h-32 border-2 border-yellow-400 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center px-12 text-center">
        {/* Organization */}
        <div className="mb-6">
          <h1 className="text-2xl font-serif font-bold text-yellow-800 mb-2">
            {data.organizationName || 'Professional Learning Institute'}
          </h1>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-12 h-0.5 bg-yellow-600"></div>
            <div className="w-3 h-3 bg-yellow-600 rotate-45"></div>
            <div className="w-12 h-0.5 bg-yellow-600"></div>
          </div>
        </div>

        {/* Certificate Title */}
        <h2 className="text-4xl font-serif font-bold text-yellow-900 mb-8">
          {getCertificateTitle(data.certificateType)}
        </h2>

        {/* Presented to */}
        <p className="text-lg text-gray-700 mb-4 font-serif italic">This is to certify that</p>
        
        {/* Recipient Name */}
        <div className="mb-6">
          <h3 className="text-5xl font-serif font-bold text-yellow-800 mb-2">
            {data.recipientName || 'Recipient Name'}
          </h3>
          <div className="w-48 h-1 bg-gradient-to-r from-transparent via-yellow-600 to-transparent mx-auto"></div>
        </div>

        {/* Course Details */}
        <p className="text-lg text-gray-700 mb-2 font-serif">has successfully completed</p>
        <h4 className="text-2xl font-serif font-semibold text-yellow-700 mb-8">
          "{data.courseName || 'Course Name'}"
        </h4>

        {/* Date and Instructor */}
        <div className="flex justify-between items-end w-full mt-auto pt-8">
          <div className="text-center">
            <p className="font-serif text-gray-800 mb-2">{formatDate(data.completionDate)}</p>
            <div className="w-32 border-b border-yellow-600"></div>
            <p className="text-sm text-gray-600 mt-1 font-serif">Date of Completion</p>
          </div>
          
          <div className="text-center">
            <p className="font-serif text-gray-800 mb-2">{data.instructorName || 'Instructor Name'}</p>
            <div className="w-32 border-b border-yellow-600"></div>
            <p className="text-sm text-gray-600 mt-1 font-serif">Authorized Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElegantTemplate;
