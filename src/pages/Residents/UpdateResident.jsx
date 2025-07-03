// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useLanguage } from "@/context/LanguageContext";
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import { Label } from "@/components/ui/label";

// const AddResidentForm = () => {
//   const navigate = useNavigate();
//   const { t } = useLanguage();
  
//   // Form state
//   const [resident, setResident] = useState({
//     first_name: "",
//     middle_name: "",
//     last_name: "",
//     gender: "",
//     date_of_birth: "",
//     place_of_birth: "",
//     nationality: "Ethiopian",
//     marital_status: "",
//     occupation: "",
//     education_level: "",
//     phone_number: "",
//     email_address: "",
//     national_id: "",
//     is_active: true,
//     deceased: false,
//     house_number: "",
//     street_name: "",
//     subcity: "",
//     city: "",
//     postal_code: "",
//     kebele_id: "",
//     region_id: "",
//     woreda_id: "",
//     zone_id: "",
//     family_name: "",
//     is_new_family: false,
//     related_resident_id: ""
//   });
  
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [validationErrors, setValidationErrors] = useState({});
  
//   // Reference data
//   const [kebeles, setKebeles] = useState([]);
//   const [regions, setRegions] = useState([]);
//   const [zones, setZones] = useState([]);
//   const [woredas, setWoredas] = useState([]);
//   const [families, setFamilies] = useState([]);

//   // Load reference data when component mounts
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch reference data
//         const [kebeleRes, regionRes, zoneRes, woredaRes, familyRes] = await Promise.all([
//           fetch("http://localhost/krfs-api/api/residents/kebeles"),
//           fetch("http://localhost/krfs-api/api/residents/regions"),
//           fetch("http://localhost/krfs-api/api/residents/zones"),
//           fetch("http://localhost/krfs-api/api/residents/woredas"),
//           fetch("http://localhost/krfs-api/api/residents/families")
//         ]);
        
//         const kebeleData = await kebeleRes.json();
//         const regionData = await regionRes.json();
//         const zoneData = await zoneRes.json();
//         const woredaData = await woredaRes.json();
//         const familyData = await familyRes.json();
        
//         setKebeles(kebeleData.data || []);
//         setRegions(regionData.data || []);
//         setZones(zoneData.data || []);
//         setWoredas(woredaData.data || []);
//         setFamilies(familyData.data || []);
        
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         toast.error({ 
//           render: error.message,
//           variant: "destructive"
//         });
//       }
//     };

//     fetchData();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     const newValue = type === "checkbox" ? checked : value;
    
//     setResident((prev) => ({
//       ...prev,
//       [name]: newValue
//     }));
    
//     // Clear validation error when user edits field
//     if (validationErrors[name]) {
//       setValidationErrors((prev) => {
//         const newErrors = { ...prev };
//         delete newErrors[name];
//         return newErrors;
//       });
//     }
//   };

//   const handleSelectChange = (field, value) => {
//     setResident(prev => ({...prev, [field]: value}));
    
//     // Clear validation error when user selects value
//     if (validationErrors[field]) {
//       setValidationErrors((prev) => {
//         const newErrors = { ...prev };
//         delete newErrors[field];
//         return newErrors;
//       });
//     }
//   };

//   const validateForm = () => {
//     const errors = {};
    
//     if (!resident.first_name?.trim()) errors.first_name = "First name is required";
//     if (!resident.last_name?.trim()) errors.last_name = "Last name is required";
//     if (!resident.gender) errors.gender = "Gender is required";
//     if (!resident.date_of_birth) errors.date_of_birth = "Date of birth is required";
//     if (!resident.national_id) errors.national_id = "National ID is required";
    
//     setValidationErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       toast.error({ render: "Please fix form errors" });
//       return;
//     }

//     setIsSubmitting(true);
    
//     try {
//       const formData = new FormData();
      
//       // Add resident data
//       Object.entries(resident).forEach(([key, value]) => {
//         if (value !== null && value !== undefined) {
//           formData.append(key, value);
//         }
//       });
      
//       const response = await fetch(
//         `http://localhost/krfs-api/api/residents/create.php`,
//         {
//           method: "POST",
//           body: formData,
//           credentials: "include"
//         }
//       );
      
//       const result = await response.json();
      
//       if (result.success) {
//         toast.success({ render: t("resident_created") });
//         setTimeout(() => navigate(`/residents/${result.resident_id}`), 2000);
//       } else {
//         throw new Error(result.error || "Creation failed");
//       }
//     } catch (err) {
//       toast.error({ 
//         render: err.message,
//         variant: "destructive"
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Handle region change to update zones and woredas
//   const handleRegionChange = (regionId) => {
//     handleSelectChange('region_id', regionId);
//     handleSelectChange('zone_id', "");
//     handleSelectChange('woreda_id', "");
//   };

//   // Handle zone change to update woredas
//   const handleZoneChange = (zoneId) => {
//     handleSelectChange('zone_id', zoneId);
//     handleSelectChange('woreda_id', "");
//   };

//   return (
//     <div className="container mx-auto p-6 max-w-5xl">
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-3">
//           <Button 
//             variant="ghost" 
//             onClick={() => navigate(-1)}
//             disabled={isSubmitting}
//           >
//             ← {t("back")}
//           </Button>
//           <h2 className="text-2xl font-bold">{t("add_resident")}</h2>
//         </div>
//         <Badge>NEW</Badge>
//       </div>
      
//       <Card>
//         <CardHeader>
//           <CardTitle>{t("resident_information")}</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="grid gap-6">
//             {/* Personal Information Section */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold">Personal Information</h3>
              
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="first_name">{t("first_name")}</Label>
//                   <Input
//                     id="first_name"
//                     name="first_name"
//                     value={resident.first_name}
//                     onChange={handleChange}
//                     placeholder={t("first_name")}
//                     className={validationErrors.first_name ? "border-red-500" : ""}
//                   />
//                   {validationErrors.first_name && (
//                     <p className="text-red-500 text-sm">{validationErrors.first_name}</p>
//                   )}
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label htmlFor="middle_name">{t("middle_name")}</Label>
//                   <Input
//                     id="middle_name"
//                     name="middle_name"
//                     value={resident.middle_name}
//                     onChange={handleChange}
//                     placeholder={t("middle_name")}
//                   />
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label htmlFor="last_name">{t("last_name")}</Label>
//                   <Input
//                     id="last_name"
//                     name="last_name"
//                     value={resident.last_name}
//                     onChange={handleChange}
//                     placeholder={t("last_name")}
//                     className={validationErrors.last_name ? "border-red-500" : ""}
//                   />
//                   {validationErrors.last_name && (
//                     <p className="text-red-500 text-sm">{validationErrors.last_name}</p>
//                   )}
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="gender">{t("gender")}</Label>
//                   <Select 
//                     onValueChange={(value) => handleSelectChange("gender", value)}
//                     value={resident.gender}
//                   >
//                     <SelectTrigger className={validationErrors.gender ? "border-red-500" : ""}>
//                       <SelectValue placeholder={t("select_gender")} />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Male">{t("male")}</SelectItem>
//                       <SelectItem value="Female">{t("female")}</SelectItem>
//                       <SelectItem value="Other">{t("other")}</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   {validationErrors.gender && (
//                     <p className="text-red-500 text-sm">{validationErrors.gender}</p>
//                   )}
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label htmlFor="date_of_birth">{t("date_of_birth")}</Label>
//                   <Input
//                     id="date_of_birth"
//                     name="date_of_birth"
//                     type="date"
//                     value={resident.date_of_birth}
//                     onChange={handleChange}
//                     className={validationErrors.date_of_birth ? "border-red-500" : ""}
//                   />
//                   {validationErrors.date_of_birth && (
//                     <p className="text-red-500 text-sm">{validationErrors.date_of_birth}</p>
//                   )}
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="place_of_birth">{t("place_of_birth")}</Label>
//                   <Input
//                     id="place_of_birth"
//                     name="place_of_birth"
//                     value={resident.place_of_birth}
//                     onChange={handleChange}
//                     placeholder={t("place_of_birth")}
//                   />
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label htmlFor="nationality">{t("nationality")}</Label>
//                   <Input
//                     id="nationality"
//                     name="nationality"
//                     value={resident.nationality}
//                     onChange={handleChange}
//                     defaultValue="Ethiopian"
//                   />
//                 </div>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="marital_status">{t("marital_status")}</Label>
//                   <Select 
//                     onValueChange={(value) => handleSelectChange("marital_status", value)}
//                     value={resident.marital_status}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder={t("select_marital_status")} />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Single">{t("single")}</SelectItem>
//                       <SelectItem value="Married">{t("married")}</SelectItem>
//                       <SelectItem value="Divorced">{t("divorced")}</SelectItem>
//                       <SelectItem value="Widowed">{t("widowed")}</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label htmlFor="national_id">{t("national_id")}</Label>
//                   <Input
//                     id="national_id"
//                     name="national_id"
//                     value={resident.national_id}
//                     onChange={handleChange}
//                     placeholder={t("national_id")}
//                     className={validationErrors.national_id ? "border-red-500" : ""}
//                   />
//                   {validationErrors.national_id && (
//                     <p className="text-red-500 text-sm">{validationErrors.national_id}</p>
//                   )}
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label htmlFor="family_name">{t("family")}</Label>
//                   <div className="flex gap-2">
//                     <Select 
//                       onValueChange={(value) => {
//                         handleSelectChange("family_name", value);
//                         handleSelectChange("is_new_family", false);
//                       }}
//                       value={resident.family_name}
//                       disabled={resident.is_new_family}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder={resident.is_new_family ? t("new_family") : t("select_family")} />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {families.map((family) => (
//                           <SelectItem key={family.family_id} value={family.family_name}>
//                             {family.family_name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
                    
//                     <Button
//                       type="button"
//                       variant="outline"
//                       size="sm"
//                       onClick={() => {
//                         handleSelectChange("is_new_family", !resident.is_new_family);
//                         if (resident.is_new_family) {
//                           handleSelectChange("family_name", "");
//                         }
//                       }}
//                     >
//                       {resident.is_new_family ? "Cancel" : "New"}
//                     </Button>
//                   </div>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="occupation">{t("occupation")}</Label>
//                   <Input
//                     id="occupation"
//                     name="occupation"
//                     value={resident.occupation}
//                     onChange={handleChange}
//                     placeholder={t("occupation")}
//                   />
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label htmlFor="education_level">{t("education_level")}</Label>
//                   <Input
//                     id="education_level"
//                     name="education_level"
//                     value={resident.education_level}
//                     onChange={handleChange}
//                     placeholder={t("education_level")}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Contact Information Section */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold">Contact Information</h3>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="phone_number">{t("phone_number")}</Label>
//                   <Input
//                     id="phone_number"
//                     name="phone_number"
//                     value={resident.phone_number}
//                     onChange={handleChange}
//                     placeholder="+2519XXXXXXXX"
//                   />
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label htmlFor="email_address">{t("email_address")}</Label>
//                   <Input
//                     id="email_address"
//                     name="email_address"
//                     type="email"
//                     value={resident.email_address}
//                     onChange={handleChange}
//                     placeholder={t("email_address")}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Address Information Section */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold">Address Information</h3>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="house_number">{t("house_number")}</Label>
//                   <Input
//                     id="house_number"
//                     name="house_number"
//                     value={resident.house_number}
//                     onChange={handleChange}
//                     placeholder={t("house_number")}
//                   />
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label htmlFor="street_name">{t("street_name")}</Label>
//                   <Input
//                     id="street_name"
//                     name="street_name"
//                     value={resident.street_name}
//                     onChange={handleChange}
//                     placeholder={t("street_name")}
//                   />
//                 </div>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="subcity">{t("subcity")}</Label>
//                   <Input
//                     id="subcity"
//                     name="subcity"
//                     value={resident.subcity}
//                     onChange={handleChange}
//                     placeholder={t("subcity")}
//                   />
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label htmlFor="city">{t("city")}</Label>
//                   <Input
//                     id="city"
//                     name="city"
//                     value={resident.city}
//                     onChange={handleChange}
//                     placeholder={t("city")}
//                   />
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label htmlFor="postal_code">{t("postal_code")}</Label>
//                   <Input
//                     id="postal_code"
//                     name="postal_code"
//                     value={resident.postal_code}
//                     onChange={handleChange}
//                     placeholder={t("postal_code")}
//                   />
//                 </div>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="region_id">{t("region")}</Label>
//                   <Select 
//                     onValueChange={handleRegionChange}
//                     value={String(resident.region_id)}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder={t("select_region")} />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {regions.map((region) => (
//                         <SelectItem key={region.region_id} value={String(region.region_id)}>
//                           {region.region_name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label htmlFor="zone_id">{t("zone")}</Label>
//                   <Select 
//                     onValueChange={handleZoneChange}
//                     value={String(resident.zone_id)}
//                     disabled={!resident.region_id}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder={resident.region_id ? t("select_zone") : t("select_region_first")} />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {