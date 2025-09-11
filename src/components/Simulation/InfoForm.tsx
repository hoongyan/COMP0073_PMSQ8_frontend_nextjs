// "use client";
// import React, { useState } from "react";
// import { Box, TextField, Button, Paper, Typography, Grid } from "@mui/material";

// export default function InfoForm() {
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     telNo: "",
//     address: "",
//     occupation: "",
//     age: "",
//     incidentDate: "",
//     reportDate: "",
//     location: "",
//     crimeType: "",
//     approachPlatform: "",
//     communicationPlatform: "",
//     bank: "",
//     bankNo: "",
//     contactInfo: "",
//     description: "",
//     summary: ""
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     alert("Form submitted! " + JSON.stringify(formData, null, 2)); // Replace with your submit logic
//   };

//   return (
//     <Paper sx={{ width: "100%", maxWidth: "md", mx: "auto", p: 3, boxShadow: 3, borderRadius: 2, maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
//       <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: "bold", mb: 2 }}>
//         Crime Report Form
//       </Typography>
//       <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
//         {/* Personal Details */}
//         <Typography variant="subtitle1" sx={{ fontWeight: "medium", color: "text.secondary" }}>
//           Personal Details
//         </Typography>
//         <Grid container spacing={2}>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               fullWidth
//               variant="outlined"
//               label="First Name"
//               name="firstName"
//               value={formData.firstName}
//               onChange={handleChange}
//               placeholder="Enter your first name"
//             />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               fullWidth
//               variant="outlined"
//               label="Last Name"
//               name="lastName"
//               value={formData.lastName}
//               onChange={handleChange}
//               placeholder="Enter your last name"
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               variant="outlined"
//               label="Telephone Number"
//               name="telNo"
//               value={formData.telNo}
//               onChange={handleChange}
//               placeholder="Enter your phone number"
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               variant="outlined"
//               label="Address"
//               name="address"
//               value={formData.address}
//               onChange={handleChange}
//               placeholder="Enter your address"
//             />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               fullWidth
//               variant="outlined"
//               label="Occupation"
//               name="occupation"
//               value={formData.occupation}
//               onChange={handleChange}
//               placeholder="Enter your occupation"
//             />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               fullWidth
//               variant="outlined"
//               label="Age"
//               name="age"
//               type="number"
//               value={formData.age}
//               onChange={handleChange}
//               placeholder="Enter your age"
//             />
//           </Grid>
//         </Grid>

//         {/* Crime Details */}
//         <Typography variant="subtitle1" sx={{ fontWeight: "medium", color: "text.secondary", mt: 2 }}>
//           Crime Details
//         </Typography>
//         <Grid container spacing={2}>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               fullWidth
//               variant="outlined"
//               label="Incident Date"
//               name="incidentDate"
//               type="date"
//               value={formData.incidentDate}
//               onChange={handleChange}
//               InputLabelProps={{ shrink: true }}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               fullWidth
//               variant="outlined"
//               label="Report Date"
//               name="reportDate"
//               type="date"
//               value={formData.reportDate}
//               onChange={handleChange}
//               InputLabelProps={{ shrink: true }}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               variant="outlined"
//               label="Location of Incident"
//               name="location"
//               value={formData.location}
//               onChange={handleChange}
//               placeholder="Enter incident location"
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               variant="outlined"
//               label="Crime Type"
//               name="crimeType"
//               value={formData.crimeType}
//               onChange={handleChange}
//               placeholder="e.g., Theft, Fraud"
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               variant="outlined"
//               label="Approach Platform"
//               name="approachPlatform"
//               value={formData.approachPlatform}
//               onChange={handleChange}
//               placeholder="e.g., Social Media, Phone"
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               variant="outlined"
//               label="Communication Platform"
//               name="communicationPlatform"
//               value={formData.communicationPlatform}
//               onChange={handleChange}
//               placeholder="e.g., Email, WhatsApp"
//             />
//           </Grid>
//         </Grid>

//         {/* Transaction Details */}
//         <Typography variant="subtitle1" sx={{ fontWeight: "medium", color: "text.secondary", mt: 2 }}>
//           Transaction Details
//         </Typography>
//         <Grid container spacing={2}>
//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               variant="outlined"
//               label="Bank Name"
//               name="bank"
//               value={formData.bank}
//               onChange={handleChange}
//               placeholder="Enter bank name"
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               variant="outlined"
//               label="Bank Account Number"
//               name="bankNo"
//               value={formData.bankNo}
//               onChange={handleChange}
//               placeholder="Enter bank account number"
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               variant="outlined"
//               label="Contact Information"
//               name="contactInfo"
//               value={formData.contactInfo}
//               onChange={handleChange}
//               placeholder="e.g., Suspect's Phone, Email"
//             />
//           </Grid>
//         </Grid>

//         {/* Description & Summary */}
//         <Typography variant="subtitle1" sx={{ fontWeight: "medium", color: "text.secondary", mt: 2 }}>
//           Description & Summary
//         </Typography>
//         <Grid container spacing={2}>
//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               variant="outlined"
//               label="Description of the Crime"
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               placeholder="Describe the crime in detail"
//               multiline
//               rows={3}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               variant="outlined"
//               label="Summary of the Incident"
//               name="summary"
//               value={formData.summary}
//               onChange={handleChange}
//               placeholder="Summarize the incident"
//               multiline
//               rows={3}
//             />
//           </Grid>
//         </Grid>

//         <Button
//           type="submit"
//           variant="contained"
//           color="primary"
//           sx={{ mt: 2, py: 1, borderRadius: 1 }}
//         >
//           Submit
//         </Button>
//       </Box>
//     </Paper>
//   );
// }

"use client";
import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Paper, Typography, Grid } from "@mui/material";

interface FormData {
  firstName?: string;
  lastName?: string;
  telNo?: string;
  address?: string;
  occupation?: string;
  age?: string;
  incidentDate?: string;
  reportDate?: string;
  location?: string;
  crimeType?: string;
  approachPlatform?: string;
  communicationPlatform?: string;
  bank?: string;
  bankNo?: string;
  contactInfo?: string;
  description?: string;
  summary?: string;
}

interface InfoFormProps {
  initialData: FormData;
}

export default function InfoForm({ initialData }: InfoFormProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    telNo: "",
    address: "",
    occupation: "",
    age: "",
    incidentDate: "",
    reportDate: "",
    location: "",
    crimeType: "",
    approachPlatform: "",
    communicationPlatform: "",
    bank: "",
    bankNo: "",
    contactInfo: "",
    description: "",
    summary: "",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      ...initialData,
    }));
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Form submitted! " + JSON.stringify(formData, null, 2)); // Replace with actual submit logic
  };

  return (
    <Paper sx={{ width: "100%", maxWidth: "md", mx: "auto", p: 3, boxShadow: 3, borderRadius: 2, maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
      <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: "bold", mb: 2 }}>
        Crime Report Form
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: "medium", color: "text.secondary" }}>
          Personal Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter your last name"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Telephone Number"
              name="telNo"
              value={formData.telNo}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your address"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="Occupation"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              placeholder="Enter your occupation"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter your age"
            />
          </Grid>
        </Grid>

        <Typography variant="subtitle1" sx={{ fontWeight: "medium", color: "text.secondary", mt: 2 }}>
          Crime Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="Incident Date"
              name="incidentDate"
              type="date"
              value={formData.incidentDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="Report Date"
              name="reportDate"
              type="date"
              value={formData.reportDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Location of Incident"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter incident location"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Crime Type"
              name="crimeType"
              value={formData.crimeType}
              onChange={handleChange}
              placeholder="e.g., Theft, Fraud"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Approach Platform"
              name="approachPlatform"
              value={formData.approachPlatform}
              onChange={handleChange}
              placeholder="e.g., Social Media, Phone"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Communication Platform"
              name="communicationPlatform"
              value={formData.communicationPlatform}
              onChange={handleChange}
              placeholder="e.g., Email, WhatsApp"
            />
          </Grid>
        </Grid>

        <Typography variant="subtitle1" sx={{ fontWeight: "medium", color: "text.secondary", mt: 2 }}>
          Transaction Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Bank Name"
              name="bank"
              value={formData.bank}
              onChange={handleChange}
              placeholder="Enter bank name"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Bank Account Number"
              name="bankNo"
              value={formData.bankNo}
              onChange={handleChange}
              placeholder="Enter bank account number"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Contact Information"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleChange}
              placeholder="e.g., Suspect's Phone, Email"
            />
          </Grid>
        </Grid>

        <Typography variant="subtitle1" sx={{ fontWeight: "medium", color: "text.secondary", mt: 2 }}>
          Description & Summary
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Description of the Crime"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the crime in detail"
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Summary of the Incident"
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              placeholder="Summarize the incident"
              multiline
              rows={3}
            />
          </Grid>
        </Grid>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2, py: 1, borderRadius: 1 }}
        >
          Submit
        </Button>
      </Box>
    </Paper>
  );
}