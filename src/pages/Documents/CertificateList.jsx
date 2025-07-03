import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";

const statusColors = {
  approved: "#22c55e",
  pending: "#eab308",
  rejected: "#ef4444",
};

const statusIcons = {
  approved: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  ),
  pending: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
        clipRule="evenodd"
      />
    </svg>
  ),
  rejected: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
        clipRule="evenodd"
      />
    </svg>
  ),
};

const CERTIFICATE_TYPES = [
    
 
  { label: "Birth Certificate", value: 2, icon: "👶" },
  { label: "Death Certificate", value: 3, icon: "⚰️" },
 
  { label: "Family Certificate", value: 5, icon: "👨‍👩‍👧‍👦" },
  
];

const CertificateList = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [formType, setFormType] = useState(CERTIFICATE_TYPES[0].value);
  const [formImage, setFormImage] = useState(null);
  const [formImagePreview, setFormImagePreview] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [formPurpose, setFormPurpose] = useState("");
  const [formUrgency, setFormUrgency] = useState("normal");
  const [formTouched, setFormTouched] = useState({});
  const { user } = useAuth();
  const { t } = useLanguage();

  console.log('user login',user);
  // Fetch certificates
  const fetchCertificates = () => {
    setLoading(true);
    fetch(
      "http://localhost/krfs-api/api/residents/list_certificates.php?resident_id=" +
        user?.resident_id,
      { credentials: "include" }
    )
      .then((res) => res.json())
      .then((data) => {
        setCertificates(data.certificates || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchCertificates();
    // eslint-disable-next-line
  }, [user?.resident_id]);

  // Download handler
  const handleDownload = async (cert) => {
    window.open(`http://localhost/${cert.file_path}`, "_blank");
    await fetch(
      "http://localhost/krfs-api/api/Certificates/mark_certificate_downloaded.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ certificate_id: cert.certificate_id }),
      }
    );
    fetchCertificates();
  };

  // Image preview handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setFormImagePreview(null);
    }
  };

  // Validation
  const validate = () => {
    const errors = {};
    if (!formType) errors.formType = "Certificate type is required.";
    if (!formPurpose.trim()) errors.formPurpose = "Purpose is required.";
    if (!formUrgency) errors.formUrgency = "Urgency is required.";
    if (formImage && !formImage.type.startsWith("image/")) {
      errors.formImage = "Only image files are allowed.";
    }
    if (formImage && formImage.size > 2 * 1024 * 1024) {
      errors.formImage = "Image must be less than 2MB.";
    }
    return errors;
  };

  // Request certificate handler
  const handleRequestCertificate = async (e) => {
    e.preventDefault();
    setFormTouched({
      formType: true,
      formPurpose: true,
      formUrgency: true,
      formImage: true,
    });
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormError(Object.values(errors).join(" "));
      return;
    }
    setFormLoading(true);
    setFormError("");
    setFormSuccess("");
    try {
      const formData = new FormData();
      formData.append("resident_id", user?.resident_id);
      formData.append("national_id", user?.national_id);
      formData.append("service_type_id", formType);
      formData.append("purpose", formPurpose);
      formData.append("urgency", formUrgency);
      if (formImage) formData.append("image", formImage);

      const res = await fetch(
        "http://localhost/krfs-api/api/documents/request_certificate.php",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        setFormError(data.error || "Failed to request certificate.");
      } else {
        setFormSuccess("Certificate request submitted successfully!");
        setTimeout(() => {
          setShowRequestForm(false);
          setFormImage(null);
          setFormImagePreview(null);
          setFormPurpose("");
          setFormUrgency("normal");
          setFormTouched({});
          fetchCertificates();
        }, 1500);
      }
    } catch (err) {
      setFormError("Server error.");
    } finally {
      setFormLoading(false);
    }
  };

  // Modal overlay for the request form
  const RequestModal = () => {
    const errors = validate();
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(5px)",
        }}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="modal-content"
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "32px",
            width: "100%",
            maxWidth: "500px",
            boxShadow: "0 10px 50px rgba(0,0,0,0.15)",
            textAlign: "left",
            position: "relative",
          }}
        >
          <button
            type="button"
            onClick={() => setShowRequestForm(false)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "none",
              border: "none",
              fontSize: "24px",
              color: "#64748b",
              cursor: "pointer",
              transition: "color 0.2s",
            }}
            aria-label="Close"
          >
            ✖
          </button>

          <div className="modal-header" style={{ marginBottom: "24px" }}>
            <h2
              style={{
                fontWeight: "700",
                fontSize: "28px",
                margin: "0 0 8px",
                color: "#2563eb",
                textAlign: "center",
              }}
            >
              Request New Certificate
            </h2>
            <p style={{ textAlign: "center", color: "#64748b", margin: 0 }}>
              Fill out the form below to request a certificate
            </p>
          </div>

          <form
            onSubmit={handleRequestCertificate}
            encType="multipart/form-data"
          >
            <div className="form-group" style={{ marginBottom: "24px" }}>
              <label
                style={{
                  fontWeight: "600",
                  fontSize: "16px",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Certificate Type
              </label>
              <select
                value={formType}
                onChange={(e) => setFormType(Number(e.target.value))}
                onBlur={() => setFormTouched((t) => ({ ...t, formType: true }))}
                style={{
                  padding: "14px 16px",
                  borderRadius: "10px",
                  border:
                    errors.formType && formTouched.formType
                      ? "1.5px solid #ef4444"
                      : "1px solid #e2e8f0",
                  fontSize: "16px",
                  width: "100%",
                  backgroundColor: "#f8fafc",
                  transition: "all 0.2s",
                  appearance: "none",
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 1rem center",
                  backgroundSize: "1em",
                }}
              >
                {CERTIFICATE_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
              {errors.formType && formTouched.formType && (
                <div
                  style={{
                    color: "#ef4444",
                    fontSize: "14px",
                    marginTop: "8px",
                  }}
                >
                  {errors.formType}
                </div>
              )}
            </div>

            <div className="form-group" style={{ marginBottom: "24px" }}>
              <label
                style={{
                  fontWeight: "600",
                  fontSize: "16px",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Purpose
              </label>
              <textarea
                value={formPurpose}
                onChange={(e) => setFormPurpose(e.target.value)}
                onBlur={() =>
                  setFormTouched((t) => ({ ...t, formPurpose: true }))
                }
                placeholder="Explain why you need this certificate..."
                style={{
                  padding: "14px 16px",
                  borderRadius: "10px",
                  border:
                    errors.formPurpose && formTouched.formPurpose
                      ? "1.5px solid #ef4444"
                      : "1px solid #e2e8f0",
                  fontSize: "16px",
                  width: "100%",
                  minHeight: "100px",
                  resize: "vertical",
                  backgroundColor: "#f8fafc",
                  transition: "all 0.2s",
                }}
                maxLength={200}
              />
              {errors.formPurpose && formTouched.formPurpose && (
                <div
                  style={{
                    color: "#ef4444",
                    fontSize: "14px",
                    marginTop: "8px",
                  }}
                >
                  {errors.formPurpose}
                </div>
              )}
            </div>

            <div className="form-group" style={{ marginBottom: "24px" }}>
              <label
                style={{
                  fontWeight: "600",
                  fontSize: "16px",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Urgency
              </label>
              <div style={{ display: "flex", gap: "12px" }}>
                {["normal", "urgent"].map((level) => (
                  <div key={level} style={{ flex: 1 }}>
                    <input
                      type="radio"
                      id={level}
                      name="urgency"
                      value={level}
                      checked={formUrgency === level}
                      onChange={(e) => setFormUrgency(e.target.value)}
                      style={{ display: "none" }}
                    />
                    <label
                      htmlFor={level}
                      style={{
                        display: "block",
                        padding: "14px 16px",
                        borderRadius: "10px",
                        border: `1px solid ${
                          formUrgency === level ? "#2563eb" : "#e2e8f0"
                        }`,
                        backgroundColor:
                          formUrgency === level ? "#dbeafe" : "#f8fafc",
                        textAlign: "center",
                        cursor: "pointer",
                        fontWeight: "500",
                        transition: "all 0.2s",
                      }}
                    >
                      {level === "normal" ? "Normal" : "Urgent"}
                      {level === "urgent" && (
                        <span style={{ marginLeft: "8px", color: "#dc2626" }}>
                          ⚠️
                        </span>
                      )}
                    </label>
                  </div>
                ))}
              </div>
              {errors.formUrgency && formTouched.formUrgency && (
                <div
                  style={{
                    color: "#ef4444",
                    fontSize: "14px",
                    marginTop: "8px",
                  }}
                >
                  {errors.formUrgency}
                </div>
              )}
            </div>

            <div className="form-group" style={{ marginBottom: "24px" }}>
              <label
                style={{
                  fontWeight: "600",
                  fontSize: "16px",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Supporting Document (optional)
              </label>
              <div
                style={{
                  border: "1px dashed #cbd5e1",
                  borderRadius: "10px",
                  padding: "20px",
                  textAlign: "center",
                  backgroundColor: "#f8fafc",
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  onBlur={() =>
                    setFormTouched((t) => ({ ...t, formImage: true }))
                  }
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    cursor: "pointer",
                  }}
                />
                <div style={{ color: "#64748b", marginBottom: "12px" }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                    />
                  </svg>
                </div>
                <div style={{ color: "#2563eb", fontWeight: "500" }}>
                  Click to upload an image
                </div>
                <div
                  style={{
                    color: "#94a3b8",
                    fontSize: "14px",
                    marginTop: "4px",
                  }}
                >
                  PNG, JPG up to 2MB
                </div>
              </div>
              {formImagePreview && (
                <div style={{ marginTop: "16px", textAlign: "center" }}>
                  <img
                    src={formImagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: "150px",
                      maxHeight: "150px",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                    }}
                  />
                </div>
              )}
              {errors.formImage && formTouched.formImage && (
                <div
                  style={{
                    color: "#ef4444",
                    fontSize: "14px",
                    marginTop: "8px",
                  }}
                >
                  {errors.formImage}
                </div>
              )}
            </div>

            <div style={{ margin: "24px 0" }}>
              {formError && (
                <div
                  style={{
                    padding: "14px",
                    background: "#fee2e2",
                    color: "#b91c1c",
                    borderRadius: "10px",
                    marginBottom: "16px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {formError}
                </div>
              )}
              {formSuccess && (
                <div
                  style={{
                    padding: "14px",
                    background: "#dcfce7",
                    color: "#166534",
                    borderRadius: "10px",
                    marginBottom: "16px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {formSuccess}
                </div>
              )}

              <button
                type="submit"
                disabled={formLoading}
                style={{
                  padding: "16px",
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: "600",
                  fontSize: "16px",
                  cursor: formLoading ? "not-allowed" : "pointer",
                  opacity: formLoading ? 0.7 : 1,
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  transition: "background 0.2s, transform 0.1s",
                }}
              >
                {formLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Submit Request"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          textAlign: "center",
          padding: "40px",
        }}
      >
        <div
          className="spinner"
          style={{
            width: "50px",
            height: "50px",
            border: "4px solid rgba(0, 0, 0, 0.1)",
            borderLeftColor: "#2563eb",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            marginBottom: "20px",
          }}
        ></div>
        <h3
          style={{
            fontSize: "22px",
            fontWeight: "600",
            marginBottom: "10px",
            color: "#1e293b",
          }}
        >
          Loading your certificates
        </h3>
        <p
          style={{
            color: "#64748b",
            maxWidth: "500px",
            marginBottom: "30px",
          }}
        >
          We're fetching your certificate information. This may take a moment.
        </p>
        <button
          style={{
            padding: "14px 32px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            fontWeight: "600",
            fontSize: "16px",
            cursor: "pointer",
            boxShadow: "0 4px 6px rgba(37, 99, 235, 0.3)",
            transition: "all 0.2s",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
          onClick={() => setShowRequestForm(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Request Certificate
        </button>
        {showRequestForm && <RequestModal />}

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "1400px",
        margin: "40px auto",
        padding: "0 24px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "40px",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            background: "#dbeafe",
            width: "60px",
            height: "60px",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 6px rgba(37, 99, 235, 0.15)",
          }}
        >
          <span style={{ fontSize: "32px" }}>📜</span>
        </div>
        <div>
          <h2
            style={{
              fontSize: "32px",
              fontWeight: "700",
              margin: "0 0 4px",
              color: "#1e293b",
            }}
          >
            {t(" Certificate Management")}
          </h2>
          <p
            style={{
              color: "#64748b",
              margin: "0",
              fontSize: "16px",
            }}
          >
            View and manage your issued certificates
          </p>
        </div>
        <button
          style={{
            marginLeft: "auto",
            padding: "14px 32px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            fontWeight: "600",
            fontSize: "16px",
            cursor: "pointer",
            boxShadow: "0 4px 6px rgba(37, 99, 235, 0.3)",
            transition: "all 0.2s",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
          onClick={() => setShowRequestForm(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Request Certificate
        </button>
      </div>

      {certificates.length === 0 && !showRequestForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            textAlign: "center",
            marginTop: "40px",
            background: "#fff",
            padding: "50px 40px",
            borderRadius: "16px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
            maxWidth: "600px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <div
            style={{
              fontSize: "80px",
              marginBottom: "20px",
              opacity: 0.8,
            }}
          >
            📄
          </div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: "600",
              marginBottom: "12px",
              color: "#1e293b",
            }}
          >
            No Certificates Found
          </div>
          <div
            style={{
              color: "#64748b",
              marginBottom: "30px",
              fontSize: "16px",
              maxWidth: "500px",
              margin: "0 auto 30px",
            }}
          >
            You haven't been issued any certificates yet. Request a new
            certificate to get started.
          </div>
          <button
            style={{
              padding: "14px 40px",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontWeight: "600",
              fontSize: "16px",
              cursor: "pointer",
              boxShadow: "0 4px 6px rgba(37, 99, 235, 0.3)",
              transition: "all 0.2s",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
            onClick={() => setShowRequestForm(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Request Certificate
          </button>
        </motion.div>
      )}

      {showRequestForm && <RequestModal />}

      {certificates.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
            gap: "28px",
            marginTop: "20px",
          }}
        >
          {certificates.map((cert) => {
            const certificateType = CERTIFICATE_TYPES.find(
              (type) => type.value === cert.service_type_id
            );

            return (
              <motion.div
                key={cert.request_id || cert.certificate_id || cert.resident_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                  padding: "28px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: "280px",
                  border: "1px solid #f1f5f9",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "0",
                    right: "0",
                    padding: "6px 16px",
                    background: statusColors[cert.status] + "15",
                    color: statusColors[cert.status],
                    fontWeight: "600",
                    fontSize: "14px",
                    borderBottomLeftRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {statusIcons[cert.status]}{" "}
                  {cert.status?.charAt(0).toUpperCase() + cert.status?.slice(1)}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    marginBottom: "24px",
                    gap: "20px",
                  }}
                >
                  <div
                    style={{
                      background: "#dbeafe",
                      width: "60px",
                      height: "60px",
                      borderRadius: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: "32px" }}>
                      {certificateType?.icon || "📄"}
                    </span>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "#1e293b",
                        marginBottom: "8px",
                      }}
                    >
                      {certificateType?.label ||
                        cert.certificate_type ||
                        "Certificate"}
                    </div>
                    <div
                      style={{
                        color: "#64748b",
                        margin: "6px 0",
                        fontSize: "14px",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "12px 20px",
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: "500" }}>Issued:</span>{" "}
                        {cert.issue_date || cert.request_date}
                      </div>
                      {cert.expiry_date && (
                        <div>
                          <span style={{ fontWeight: "500" }}>Expires:</span>{" "}
                          {cert.expiry_date}
                        </div>
                      )}
                      <div>
                        <span style={{ fontWeight: "500" }}>ID:</span>{" "}
                        {cert.certificate_number || "N/A"}
                      </div>
                    </div>
                    {cert.details && (
                      <div
                        style={{
                          color: "#64748b",
                          fontSize: "14px",
                          marginTop: "12px",
                          background: "#f8fafc",
                          padding: "12px",
                          borderRadius: "8px",
                          borderLeft: "3px solid #cbd5e1",
                        }}
                      >
                        {cert.details}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ marginTop: "auto" }}>
                  <button
                    style={{
                      padding: "14px",
                      background:
                        cert.downloaded === 0 && cert.file_path
                          ? "#2563eb"
                          : "#cbd5e1",
                      color: "#fff",
                      border: "none",
                      borderRadius: "10px",
                      fontWeight: "600",
                      fontSize: "16px",
                      cursor:
                        cert.downloaded === 0 && cert.file_path
                          ? "pointer"
                          : "not-allowed",
                      transition: "background 0.2s",
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "8px",
                    }}
                    onClick={async () => {
                      if (cert.downloaded === 0 && cert.file_path) {
                        await handleDownload(cert);
                      }
                    }}
                    disabled={
                      cert.downloaded !== 0 ||
                      cert.status === "rejected" ||
                      cert.status === "pending" ||
                      !cert.file_path
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Download PDF
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default CertificateList;
