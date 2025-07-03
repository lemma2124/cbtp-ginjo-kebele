// Update this page (the content is just a fallback if you fail to update the page)

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Your ginjo RFMS</h1>
        <p className="text-xl text-gray-600">Start building your amazing project here!</p>
      </div>
    </div>
  );
};

export default Index;




// mport React, { useState } from 'react';
//     <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 text-white py-6 shadow-lg">
//         <div className="container mx-auto px-4">
//           <div className="flex items-center justify-center space-x-4">
//             <div className="text-4xl">🇪🇹</div>
//             <div className="text-center">
//               <h1 className="text-4xl md:text-5xl font-bold mb-2">
//                 Ethiopian Certificate Generator
//               </h1>
//               <p className="text-lg md:text-xl opacity-90">
//                 Generate official certificates with Ethiopian government styling
//               </p>
//             </div>
//             <div className="text-4xl">📜</div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="container mx-auto px-4 py-8">
//         <div className="grid lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
//           {/* Form Panel */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
//               <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
//                 <h2 className="text-2xl font-bold">Certificate Builder</h2>
//                 <p className="opacity-90">Fill in the details and customize your certificate</p>
//               </div>
//               <div className="p-6">
//                 <CertificateForm 
//                   certificateData={certificateData}
//                   setCertificateData={setCertificateData}
//                   selectedTemplate={selectedTemplate}
//                   setSelectedTemplate={setSelectedTemplate}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Preview Panel */}
//           <div className="lg:col-span-3">
//             <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
//               <div className="bg-gradient-to-r from-green-500 to-yellow-600 text-white p-6">
//                 <h2 className="text-2xl font-bold">Live Preview</h2>
//                 <p className="opacity-90">See your certificate as you build it</p>
//               </div>
//               <div className="p-6 bg-gray-50">
//                 <div className="bg-white rounded-lg shadow-inner p-4">
//                   <CertificatePreview 
//                     certificateData={certificateData}
//                     template={selectedTemplate}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Features Section */}
//         <div className="mt-16">
//           <h3 className="text-3xl font-bold text-center text-gray-800 mb-8">Features</h3>
//           <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
//             <div className="text-center p-6 bg-white rounded-xl shadow-lg">
//               <div className="text-4xl mb-4">🏛️</div>
//               <h4 className="text-xl font-semibold mb-2">Official Templates</h4>
//               <p className="text-gray-600">Government-style templates with Ethiopian flag and official stamps</p>
//             </div>
//             <div className="text-center p-6 bg-white rounded-xl shadow-lg">
//               <div className="text-4xl mb-4">📱</div>
//               <h4 className="text-xl font-semibold mb-2">Multiple Formats</h4>
//               <p className="text-gray-600">Download as PDF or high-quality images for printing</p>
//             </div>
//             <div className="text-center p-6 bg-white rounded-xl shadow-lg">
//               <div className="text-4xl mb-4">🖼️</div>
//               <h4 className="text-xl font-semibold mb-2">Custom Images</h4>
//               <p className="text-gray-600">Upload Ethiopian flag, Oromia flag, and kebele stamps</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Index;