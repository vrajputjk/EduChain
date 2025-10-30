// Indian States and their districts
export const INDIAN_STATES = [
  { value: "Andhra Pradesh", label: "Andhra Pradesh" },
  { value: "Arunachal Pradesh", label: "Arunachal Pradesh" },
  { value: "Assam", label: "Assam" },
  { value: "Bihar", label: "Bihar" },
  { value: "Chhattisgarh", label: "Chhattisgarh" },
  { value: "Goa", label: "Goa" },
  { value: "Gujarat", label: "Gujarat" },
  { value: "Haryana", label: "Haryana" },
  { value: "Himachal Pradesh", label: "Himachal Pradesh" },
  { value: "Jharkhand", label: "Jharkhand" },
  { value: "Karnataka", label: "Karnataka" },
  { value: "Kerala", label: "Kerala" },
  { value: "Madhya Pradesh", label: "Madhya Pradesh" },
  { value: "Maharashtra", label: "Maharashtra" },
  { value: "Manipur", label: "Manipur" },
  { value: "Meghalaya", label: "Meghalaya" },
  { value: "Mizoram", label: "Mizoram" },
  { value: "Nagaland", label: "Nagaland" },
  { value: "Odisha", label: "Odisha" },
  { value: "Punjab", label: "Punjab" },
  { value: "Rajasthan", label: "Rajasthan" },
  { value: "Sikkim", label: "Sikkim" },
  { value: "Tamil Nadu", label: "Tamil Nadu" },
  { value: "Telangana", label: "Telangana" },
  { value: "Tripura", label: "Tripura" },
  { value: "Uttar Pradesh", label: "Uttar Pradesh" },
  { value: "Uttarakhand", label: "Uttarakhand" },
  { value: "West Bengal", label: "West Bengal" },
  { value: "Delhi", label: "Delhi" },
  { value: "Puducherry", label: "Puducherry" },
  { value: "Jammu and Kashmir", label: "Jammu and Kashmir" },
  { value: "Ladakh", label: "Ladakh" },
];

// Sample districts for major states (can be expanded)
export const DISTRICTS_BY_STATE: Record<string, string[]> = {
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Prayagraj", "Meerut", "Ghaziabad", "Noida"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Aurangabad", "Solapur"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga", "Purnia"],
  "West Bengal": ["Kolkata", "Howrah", "Darjeeling", "Siliguri", "Durgapur", "Asansol"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli", "Tirunelveli"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner"],
  "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Gulbarga"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar"],
  "Delhi": ["Central Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar"],
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Brahmapur", "Sambalpur"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
  "Haryana": ["Gurugram", "Faridabad", "Panipat", "Ambala", "Yamunanagar"],
};

// Government schemes for education in India
export const GOVERNMENT_SCHEMES = [
  { value: "Sarva Shiksha Abhiyan", label: "Sarva Shiksha Abhiyan (SSA)" },
  { value: "PM POSHAN", label: "PM POSHAN (Mid-Day Meal)" },
  { value: "Samagra Shiksha", label: "Samagra Shiksha" },
  { value: "National Education Policy 2020", label: "National Education Policy 2020" },
  { value: "PMGDISHA", label: "PM Gramin Digital Saksharta Abhiyan" },
  { value: "Beti Bachao Beti Padhao", label: "Beti Bachao Beti Padhao" },
  { value: "Rashtriya Madhyamik Shiksha Abhiyan", label: "Rashtriya Madhyamik Shiksha Abhiyan (RMSA)" },
  { value: "National Scheme of Incentive to Girls", label: "National Scheme of Incentive to Girls" },
  { value: "Direct Procurement", label: "Direct Procurement (No Scheme)" },
];

// Supply categories specific to Indian schools
export const SUPPLY_CATEGORIES = [
  { value: "textbooks", label: "📚 Textbooks (NCERT/State Board)" },
  { value: "uniforms", label: "👕 School Uniforms" },
  { value: "stationery", label: "✏️ Stationery Items" },
  { value: "lab_equipment", label: "🔬 Laboratory Equipment" },
  { value: "sports_equipment", label: "⚽ Sports Equipment" },
  { value: "library_books", label: "📖 Library Books" },
  { value: "digital_devices", label: "💻 Digital Learning Devices" },
  { value: "furniture", label: "🪑 School Furniture" },
  { value: "mid_day_meal", label: "🍽️ Mid-Day Meal Supplies" },
  { value: "hygiene_kits", label: "🧼 Hygiene & Sanitation Kits" },
];

// Education boards in India
export const EDUCATION_BOARDS = [
  { value: "CBSE", label: "CBSE (Central Board of Secondary Education)" },
  { value: "ICSE", label: "ICSE (Indian Certificate of Secondary Education)" },
  { value: "State Board", label: "State Board" },
  { value: "Other", label: "Other" },
];

// User roles
export const USER_ROLES = [
  { value: "supplier", label: "Supplier/Manufacturer" },
  { value: "distributor", label: "Distributor/Logistics" },
  { value: "school", label: "School Administrator" },
  { value: "government_official", label: "Government Official" },
  { value: "admin", label: "System Administrator" },
];

// Format Indian currency
export const formatIndianCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};