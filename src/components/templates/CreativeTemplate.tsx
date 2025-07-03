import React from 'react';

interface CertificateData {
  recipientName: string;
  courseName: string;
  completionDate: string;
  instructorName: string;
  organizationName: string;
  certificateType: string;
}

interface CreativeTemplateProps {
  data: CertificateData;
}

const CreativeTemplate: React.FC<CreativeTemplateProps> = ({ data }) => {
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
    <div className="w-full h-[600px] bg-gradient-to-br from-purple-100 via-pink-50 to-purple-100 border-4 border-purple-500 relative overflow-hidden">
      {/* Geometric Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-32 h-32 bg-purple-300 transform rotate-45 -translate-x-16 -translate-y-16"></div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-pink-300 transform rotate-45 translate-x-12 -translate-y-12"></div>
        <div className="absolute bottom-0 left-1/4 w-20 h-20 bg-purple-400 transform rotate-45"></div>
        <div className="absolute bottom-0 right-0 w-28 h-28 bg-pink-400 transform rotate-45 translate-x-14 translate-y-14"></div>
      </div>

      {/* Modern Border Design */}
      <div className="absolute top-8 left-8 right-8 bottom-8 border-2 border-purple-300"></div>
      <div className="absolute top-12 left-12 right-12 bottom-12 border border-pink-200"></div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center px-12 text-center">
        {/* Organization with Modern Design */}
        <div className="mb-8">
          <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full mb-4">
            <h1 className="text-xl font-bold">
              {data.organizationName || 'Professional Learning Institute'}
            </h1>
          </div>
        </div>

        {/* Certificate Title */}
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">
          {getCertificateTitle(data.certificateType)}
        </h2>

        {/* Modern Divider */}
        <div className="flex items-center mb-6">
          <div className="w-16 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full mx-4"></div>
          <div className="w-16 h-0.5 bg-gradient-to-r from-pink-400 to-purple-400"></div>
        </div>

        {/* Presented to */}
        <p className="text-lg text-gray-600 mb-4">This certificate is proudly presented to</p>
        
        {/* Recipient Name with Creative Styling */}
        <div className="mb-8">
          <h3 className="text-5xl font-bold bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent mb-4">
            {data.recipientName || 'Recipient Name'}
          </h3>
          <div className="w-64 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mx-auto rounded-full"></div>
        </div>

        {/* Course Details */}
        <div className="mb-8">
          <p className="text-lg text-gray-700 mb-3">for successfully completing</p>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
            <h4 className="text-2xl font-semibold text-purple-700">
              {data.courseName || 'Course Name'}
            </h4>
          </div>
        </div>

        {/* Date and Instructor in Modern Cards */}
        <div className="flex justify-center space-x-8 mt-auto pt-6">
          <div className="bg-white rounded-lg p-4 shadow-md border border-purple-100">
            <p className="text-sm text-gray-500 mb-1">Completed on</p>
            <p className="font-semibold text-purple-700">{formatDate(data.completionDate)}</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-md border border-pink-100">
            <p className="text-sm text-gray-500 mb-1">Certified by</p>
            <p className="font-semibold text-pink-700">{data.instructorName || 'Instructor Name'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativeTemplate;
