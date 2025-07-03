import React from 'react';

interface CertificateData {
  recipientName: string;
  courseName: string;
  completionDate: string;
  instructorName: string;
  organizationName: string;
  certificateType: string;
  fatherName?: string;
  motherName?: string;
  birthPlace?: string;
  nationality?: string;
  kebeleNumber?: string;
  woreda?: string;
  zone?: string;
  region?: string;
  spouseName?: string;
  deathCause?: string;
  deathPlace?: string;
}

interface EthiopianTemplateProps {
  data: CertificateData;
}

const EthiopianTemplate: React.FC<EthiopianTemplateProps> = ({ data }) => {
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
      case 'birth': return 'የልደት ምስክር ወረቀት / Birth Certificate';
      case 'marriage': return 'የጋብቻ ምስክር ወረቀት / Marriage Certificate';
      case 'death': return 'የሞት ምስክር ወረቀት / Death Certificate';
      case 'completion': return 'Certificate of Completion';
      case 'achievement': return 'Certificate of Achievement';
      case 'appreciation': return 'Certificate of Appreciation';
      case 'participation': return 'Certificate of Participation';
      default: return 'Certificate';
    }
  };

  const isResidentCertificate = ['birth', 'marriage', 'death'].includes(data.certificateType);

  return (
    <div className="w-full h-[600px] bg-white border-4 border-gray-800 relative overflow-hidden">
      {/* Ethiopian Flag Colors Header */}
      <div className="w-full h-4 flex">
        <div className="flex-1 bg-green-600"></div>
        <div className="flex-1 bg-yellow-400"></div>
        <div className="flex-1 bg-red-600"></div>
      </div>

      {/* Header with Ethiopian Emblem */}
      <div className="text-center py-4 border-b-2 border-gray-800">
        <div className="flex items-center justify-center mb-2">
          {/* Ethiopian Flag representation */}
          <div className="w-12 h-8 mr-4 border border-gray-400">
            <div className="h-full flex">
              <div className="flex-1 bg-green-600"></div>
              <div className="flex-1 bg-yellow-400"></div>
              <div className="flex-1 bg-red-600"></div>
            </div>
          </div>
          
          <div>
            <h1 className="text-lg font-bold text-gray-800">የኢትዮጵያ ፌዴራላዊ ዲሞክራሲያዊ ሪፐብሊክ</h1>
            <h2 className="text-sm text-gray-700">FEDERAL DEMOCRATIC REPUBLIC OF ETHIOPIA</h2>
            <h3 className="text-sm font-semibold text-gray-800">{data.region || 'Oromia'} Regional State</h3>
          </div>

          {/* Oromia Seal placeholder */}
          <div className="w-12 h-12 ml-4 border-2 border-gray-400 rounded-full flex items-center justify-center bg-yellow-100">
            <span className="text-xs font-bold text-gray-800">SEAL</span>
          </div>
        </div>
      </div>

      {/* Certificate Content */}
      <div className="px-8 py-6">
        {/* Certificate Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {getCertificateTitle(data.certificateType)}
          </h2>
          <div className="w-32 h-0.5 bg-gray-800 mx-auto"></div>
        </div>

        {/* Certificate Content based on type */}
        {isResidentCertificate ? (
          <div className="space-y-4">
            {data.certificateType === 'birth' && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <p><strong>Full Name:</strong> {data.recipientName || '_____________'}</p>
                  <p><strong>Father's Name:</strong> {data.fatherName || '_____________'}</p>
                  <p><strong>Mother's Name:</strong> {data.motherName || '_____________'}</p>
                  <p><strong>Date of Birth:</strong> {formatDate(data.completionDate)}</p>
                  <p><strong>Place of Birth:</strong> {data.birthPlace || '_____________'}</p>
                </div>
                <div className="space-y-2">
                  <p><strong>Nationality:</strong> {data.nationality || 'Ethiopian'}</p>
                  <p><strong>Kebele:</strong> {data.kebeleNumber || '_____________'}</p>
                  <p><strong>Woreda:</strong> {data.woreda || '_____________'}</p>
                  <p><strong>Zone:</strong> {data.zone || '_____________'}</p>
                  <p><strong>Region:</strong> {data.region || 'Oromia'}</p>
                </div>
              </div>
            )}

            {data.certificateType === 'marriage' && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <p><strong>Groom:</strong> {data.recipientName || '_____________'}</p>
                  <p><strong>Bride:</strong> {data.spouseName || '_____________'}</p>
                  <p><strong>Marriage Date:</strong> {formatDate(data.completionDate)}</p>
                  <p><strong>Kebele:</strong> {data.kebeleNumber || '_____________'}</p>
                </div>
                <div className="space-y-2">
                  <p><strong>Woreda:</strong> {data.woreda || '_____________'}</p>
                  <p><strong>Zone:</strong> {data.zone || '_____________'}</p>
                  <p><strong>Region:</strong> {data.region || 'Oromia'}</p>
                  <p><strong>Nationality:</strong> {data.nationality || 'Ethiopian'}</p>
                </div>
              </div>
            )}

            {data.certificateType === 'death' && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <p><strong>Full Name:</strong> {data.recipientName || '_____________'}</p>
                  <p><strong>Father's Name:</strong> {data.fatherName || '_____________'}</p>
                  <p><strong>Date of Death:</strong> {formatDate(data.completionDate)}</p>
                  <p><strong>Place of Death:</strong> {data.deathPlace || '_____________'}</p>
                  <p><strong>Cause of Death:</strong> {data.deathCause || '_____________'}</p>
                </div>
                <div className="space-y-2">
                  <p><strong>Nationality:</strong> {data.nationality || 'Ethiopian'}</p>
                  <p><strong>Kebele:</strong> {data.kebeleNumber || '_____________'}</p>
                  <p><strong>Woreda:</strong> {data.woreda || '_____________'}</p>
                  <p><strong>Zone:</strong> {data.zone || '_____________'}</p>
                  <p><strong>Region:</strong> {data.region || 'Oromia'}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-lg">This certifies that</p>
            <h3 className="text-3xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 inline-block">
              {data.recipientName || 'Recipient Name'}
            </h3>
            <p className="text-lg">has successfully completed</p>
            <h4 className="text-xl font-semibold text-gray-700">
              {data.courseName || 'Course Name'}
            </h4>
          </div>
        )}

        {/* Footer with stamps and signatures */}
        <div className="mt-8 flex justify-between items-end">
          <div className="text-center">
            <div className="w-20 h-20 border-2 border-gray-400 rounded mb-2 flex items-center justify-center bg-red-50">
              <span className="text-xs font-bold text-gray-800">KEBELE STAMP</span>
            </div>
            <p className="text-xs text-gray-600">Kebele Official Seal</p>
          </div>

          <div className="text-center">
            <p className="font-semibold mb-2">{formatDate(data.completionDate)}</p>
            <div className="w-32 border-b border-gray-400 mb-1"></div>
            <p className="text-xs text-gray-600">Date of Issue</p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 border-2 border-gray-400 rounded mb-2 flex items-center justify-center bg-blue-50">
              <span className="text-xs font-bold text-gray-800">OFFICIAL STAMP</span>
            </div>
            <p className="text-xs text-gray-600">Authorized Signature</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-2 left-0 right-0 text-center">
        <p className="text-xs text-gray-500">Certificate No: ET-{data.kebeleNumber || '000'}-{new Date().getFullYear()}</p>
      </div>
    </div>
  );
};

export default EthiopianTemplate;
