# Tourism CRUD Implementation - Complete Guide

## ✅ Implementation Status

**Backend (Laravel 11):**
- ✅ TourismController created with full CRUD operations
- ✅ Database migration completed (added missing fields)
- ✅ Models updated with relationships (Trip ↔ Tourist)
- ✅ API routes registered at `/api/tourism`
- ✅ Server running on http://127.0.0.1:8000

**Frontend (Next.js 16):**
- ✅ API service layer created (`lib/api/tourism.ts`)
- ✅ Tourism form integrated with API
- ✅ Loading states and error handling implemented
- ✅ Success/error messages added
- ✅ Form reset after successful submission

---

## 🎯 API Endpoints

### Base URL
```
http://127.0.0.1:8000/api/tourism
```

### 1. Create Tourism Record
**POST** `/api/tourism`

**Request Body:**
```json
{
  "visitDate": "2025-01-15",
  "visitTime": "09:30",
  "boatName": "Island Explorer",
  "boatOperator": "Juan Dela Cruz",
  "boatCaptain": "Pedro Santos",
  "boatCrew": "3 crew members",
  "touristEntries": [
    {
      "name": "Maria Garcia",
      "age": "28",
      "gender": "female",
      "isForeign": false,
      "nationality": "Philippines",
      "origin": "Manila",
      "purpose": "leisure",
      "transport": "land",
      "isOvernight": true,
      "lengthOfStay": "2"
    },
    {
      "name": "John Smith",
      "age": "35",
      "gender": "male",
      "isForeign": true,
      "nationality": "United States",
      "origin": "New York",
      "purpose": "leisure",
      "transport": "air",
      "isOvernight": true,
      "lengthOfStay": "5"
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "message": "Tourism record created successfully",
  "trip": {
    "id": 1,
    "boat_id": 1,
    "trip_date": "2025-01-15",
    "departure_time": "09:30",
    "destination": "Tourist Visit",
    "passengers_count": 2,
    "trip_type": "tour",
    "status": "completed",
    "boat": {
      "id": 1,
      "boat_name": "Island Explorer",
      "operator_name": "Juan Dela Cruz",
      "captain_name": "Pedro Santos",
      "crew_members": "3 crew members"
    }
  },
  "tourists": [
    {
      "id": 1,
      "trip_id": 1,
      "full_name": "Maria Garcia",
      "first_name": "Maria",
      "last_name": "Garcia",
      "age": 28,
      "gender": "female",
      "nationality": "Philippines",
      "origin_city": "Manila",
      "type": "domestic",
      "purpose": "leisure",
      "transport_mode": "land",
      "accommodation_type": "overnight",
      "duration_days": 2
    },
    {
      "id": 2,
      "trip_id": 1,
      "full_name": "John Smith",
      "first_name": "John",
      "last_name": "Smith",
      "age": 35,
      "gender": "male",
      "nationality": "United States",
      "origin_city": "New York",
      "type": "foreign",
      "purpose": "leisure",
      "transport_mode": "air",
      "accommodation_type": "staycation",
      "duration_days": 5
    }
  ],
  "summary": {
    "total_tourists": 2,
    "foreign": 1,
    "domestic": 1
  }
}
```

---

### 2. Get All Tourism Records
**GET** `/api/tourism`

**Query Parameters:**
- `month` (optional): Filter by month (1-12)
- `year` (optional): Filter by year
- `boat_id` (optional): Filter by boat ID
- `start_date` (optional): Filter by start date (YYYY-MM-DD)
- `end_date` (optional): Filter by end date (YYYY-MM-DD)
- `page` (optional): Page number (default: 1)
- `per_page` (optional): Items per page (default: 20)

**Example Request:**
```
GET /api/tourism?month=1&year=2025&per_page=10
```

**Response (200 OK):**
```json
{
  "current_page": 1,
  "data": [
    {
      "id": 1,
      "boat_id": 1,
      "trip_date": "2025-01-15",
      "departure_time": "09:30:00",
      "passengers_count": 2,
      "boat": {
        "id": 1,
        "boat_name": "Island Explorer",
        "operator_name": "Juan Dela Cruz",
        "captain_name": "Pedro Santos"
      },
      "tourists": [
        { "id": 1, "full_name": "Maria Garcia", "type": "domestic" },
        { "id": 2, "full_name": "John Smith", "type": "foreign" }
      ]
    }
  ],
  "first_page_url": "http://127.0.0.1:8000/api/tourism?page=1",
  "from": 1,
  "last_page": 1,
  "last_page_url": "http://127.0.0.1:8000/api/tourism?page=1",
  "next_page_url": null,
  "path": "http://127.0.0.1:8000/api/tourism",
  "per_page": 20,
  "prev_page_url": null,
  "to": 1,
  "total": 1
}
```

---

### 3. Get Single Tourism Record
**GET** `/api/tourism/{id}`

**Example Request:**
```
GET /api/tourism/1
```

**Response (200 OK):**
```json
{
  "id": 1,
  "boat_id": 1,
  "trip_date": "2025-01-15",
  "departure_time": "09:30:00",
  "destination": "Tourist Visit",
  "passengers_count": 2,
  "trip_type": "tour",
  "status": "completed",
  "boat": {
    "id": 1,
    "boat_name": "Island Explorer",
    "operator_name": "Juan Dela Cruz",
    "captain_name": "Pedro Santos"
  },
  "tourists": [
    {
      "id": 1,
      "trip_id": 1,
      "full_name": "Maria Garcia",
      "age": 28,
      "gender": "female",
      "nationality": "Philippines",
      "type": "domestic",
      "purpose": "leisure",
      "accommodation_type": "overnight"
    },
    {
      "id": 2,
      "trip_id": 1,
      "full_name": "John Smith",
      "age": 35,
      "gender": "male",
      "nationality": "United States",
      "type": "foreign",
      "purpose": "leisure",
      "accommodation_type": "staycation"
    }
  ]
}
```

---

### 4. Update Tourism Record
**PUT** `/api/tourism/{id}`

**Request Body (all fields optional):**
```json
{
  "visitDate": "2025-01-16",
  "visitTime": "10:00",
  "boatName": "Island Explorer",
  "boatOperator": "Juan Dela Cruz",
  "boatCaptain": "Pedro Santos",
  "boatCrew": "4 crew members",
  "touristEntries": [
    {
      "name": "Maria Garcia",
      "age": "28",
      "gender": "female",
      "isForeign": false,
      "nationality": "Philippines",
      "origin": "Manila",
      "purpose": "leisure",
      "transport": "land",
      "isOvernight": true,
      "lengthOfStay": "3"
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "message": "Tourism record updated successfully",
  "trip": {
    "id": 1,
    "boat_id": 1,
    "trip_date": "2025-01-16",
    "departure_time": "10:00",
    "passengers_count": 1,
    "boat": { ... },
    "tourists": [ ... ]
  }
}
```

---

### 5. Delete Tourism Record
**DELETE** `/api/tourism/{id}`

**Response (200 OK):**
```json
{
  "message": "Tourism record deleted successfully"
}
```

---

## 📋 Frontend Usage

### Basic Form Submission

The `TourismForm` component automatically handles API integration:

```tsx
import { TourismForm } from "@/components/tourism-form"

export default function FormsPage() {
  return <TourismForm />
}
```

### Features Implemented:

1. **Loading State**
   - Submit button shows "Saving..." with spinner icon
   - Form inputs are disabled during submission

2. **Success Handling**
   - Success message displayed above form
   - Detailed alert with trip and tourist summary
   - Form automatically resets after successful submission

3. **Error Handling**
   - Error message displayed above form
   - Detailed error alert
   - Form data preserved on error (user can retry)

4. **Data Transformation**
   - Frontend format → Backend format automatic conversion
   - Single "name" field split into first_name/last_name
   - Boolean `isForeign` → enum `type` (domestic/foreign)
   - Boolean `isOvernight` → enum `accommodation_type`
   - String `lengthOfStay` → integer `duration_days`

---

## 🔧 Advanced API Usage

### Using the API Service Directly

```typescript
import { 
  createTourismRecord, 
  getTourismRecords,
  getTourismRecord,
  updateTourismRecord,
  deleteTourismRecord 
} from "@/lib/api/tourism"

// Create
const result = await createTourismRecord(formData)

// Read (all)
const records = await getTourismRecords({
  month: '1',
  year: '2025',
  per_page: 20
})

// Read (single)
const record = await getTourismRecord(1)

// Update
const updated = await updateTourismRecord(1, formData)

// Delete
await deleteTourismRecord(1)
```

---

## 🗄️ Database Schema

### Trips Table
```sql
trips:
  - id (primary key)
  - boat_id (foreign key → boats)
  - trip_date (date)
  - departure_time (time)
  - arrival_time (time, nullable)
  - destination (string)
  - passengers_count (integer)
  - trip_type (enum: tour, transfer, charter, other)
  - status (enum: scheduled, ongoing, completed, cancelled)
  - revenue (decimal, nullable)
  - remarks (text, nullable)
  - created_at
  - updated_at
```

### Tourists Table
```sql
tourists:
  - id (primary key)
  - trip_id (foreign key → trips, cascades on delete) ✅ NEW
  - first_name (string)
  - last_name (string)
  - full_name (string) ✅ NEW
  - age (integer) ✅ NEW
  - gender (enum: male, female) ✅ NEW
  - nationality (string)
  - origin_city (string) ✅ NEW
  - type (enum: domestic, foreign)
  - purpose (enum: leisure, business, education, official, others)
  - transport_mode (enum: land, air, sea) ✅ NEW
  - accommodation_type (enum: day_tour, overnight, staycation)
  - arrival_date (date)
  - departure_date (date, nullable)
  - duration_days (integer, nullable)
  - contact_number (string, nullable)
  - email (string, nullable)
  - remarks (text, nullable)
  - created_at
  - updated_at
```

---

## 🧪 Testing the Implementation

### 1. Test Create Operation

**Option A: Using the Form**
1. Navigate to http://localhost:3000/forms (or port 3001)
2. Fill in trip details and tourist entries
3. Click "Submit Trip Record"
4. Verify success message appears
5. Check browser console for API response

**Option B: Using cURL**
```bash
curl -X POST http://127.0.0.1:8000/api/tourism \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "visitDate": "2025-01-15",
    "visitTime": "09:30",
    "boatName": "Test Boat",
    "boatOperator": "Test Operator",
    "boatCaptain": "Test Captain",
    "boatCrew": "2",
    "touristEntries": [{
      "name": "Test Tourist",
      "age": "25",
      "gender": "male",
      "isForeign": false,
      "nationality": "Philippines",
      "origin": "Manila",
      "purpose": "leisure",
      "transport": "land",
      "isOvernight": false,
      "lengthOfStay": "0"
    }]
  }'
```

### 2. Test Read Operation

```bash
# Get all records
curl http://127.0.0.1:8000/api/tourism

# Get with filters
curl "http://127.0.0.1:8000/api/tourism?month=1&year=2025"

# Get single record
curl http://127.0.0.1:8000/api/tourism/1
```

### 3. Test Update Operation

```bash
curl -X PUT http://127.0.0.1:8000/api/tourism/1 \
  -H "Content-Type: application/json" \
  -d '{
    "visitDate": "2025-01-16",
    "visitTime": "10:00"
  }'
```

### 4. Test Delete Operation

```bash
curl -X DELETE http://127.0.0.1:8000/api/tourism/1
```

---

## 🔍 Data Flow

### Create Flow

```
1. User fills form
   ↓
2. Form validation (zod)
   ↓
3. onSubmit triggered
   ↓
4. createTourismRecord() called
   ↓
5. Data transformation
   - visitDate → YYYY-MM-DD format
   - tourist entries preserved
   ↓
6. POST /api/tourism
   ↓
7. TourismController@store
   - Find or create boat
   - Create trip record
   - Create tourist records (with transformations)
     * name → first_name, last_name
     * isForeign → type
     * isOvernight + lengthOfStay → accommodation_type
   ↓
8. Database transaction committed
   ↓
9. Response returned with:
   - trip (with boat relation)
   - tourists array
   - summary stats
   ↓
10. Frontend displays success
11. Form resets
```

### Read Flow

```
1. Page loads or filter changes
   ↓
2. getTourismRecords() called
   ↓
3. GET /api/tourism with query params
   ↓
4. TourismController@index
   - Query trips with boat + tourists
   - Apply filters (date, boat, etc.)
   - Paginate results
   ↓
5. Return paginated data
   ↓
6. Frontend displays list
```

---

## 🛡️ Error Handling

### Backend Validation Errors (422)

```json
{
  "error": "Validation failed",
  "messages": {
    "visitDate": ["The visit date field is required."],
    "touristEntries.0.name": ["The name field is required."]
  }
}
```

### Not Found Errors (404)

```json
{
  "error": "Tourism record not found"
}
```

### Server Errors (500)

```json
{
  "error": "Failed to create tourism record",
  "message": "SQLSTATE[23000]: Integrity constraint violation..."
}
```

### Frontend Error Display

- Error message shown in red box above submit button
- Alert dialog with error details
- Form data preserved (not reset)
- Submit button re-enabled for retry

---

## 📊 Accommodation Type Logic

The backend automatically determines accommodation type based on:

```php
if ($entry['isOvernight']) {
    if (floatval($entry['lengthOfStay']) >= 3) {
        $accommodationType = 'staycation';
    } else {
        $accommodationType = 'overnight';
    }
} else {
    $accommodationType = 'day_tour';
}
```

**Rules:**
- `isOvernight = false` → **day_tour**
- `isOvernight = true` + `lengthOfStay < 3` → **overnight**
- `isOvernight = true` + `lengthOfStay >= 3` → **staycation**

---

## 🔐 Security Considerations

1. **Database Transactions**
   - All create/update/delete operations wrapped in transactions
   - Automatic rollback on errors

2. **Cascade Delete**
   - Deleting a trip automatically deletes associated tourists
   - Maintains referential integrity

3. **Input Validation**
   - Frontend: Zod schema validation
   - Backend: Laravel validation rules
   - Double validation ensures data integrity

4. **SQL Injection Prevention**
   - Eloquent ORM parameterized queries
   - No raw SQL with user input

---

## 🚀 Next Steps for Full CRUD UI

Currently implemented: **Create** (form submission)

To implement **Read**, **Update**, **Delete** UI:

### 1. Create Tourism List Component

```tsx
// components/tourism-list.tsx
export function TourismList() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    getTourismRecords().then(data => {
      setRecords(data.data)
      setLoading(false)
    })
  }, [])
  
  return (
    <DataTable 
      data={records}
      columns={[...]}
      onEdit={(id) => {/* Load record into form */}}
      onDelete={(id) => {/* Show confirmation */}}
    />
  )
}
```

### 2. Add Edit Mode to Form

```tsx
// Add edit mode state
const [editMode, setEditMode] = useState(false)
const [editingId, setEditingId] = useState<number | null>(null)

// Modify onSubmit
function onSubmit(values) {
  if (editMode && editingId) {
    updateTourismRecord(editingId, values)
  } else {
    createTourismRecord(values)
  }
}

// Add method to load record
function loadRecord(id: number) {
  getTourismRecord(id).then(record => {
    form.reset({/* transform backend → frontend */})
    setEditMode(true)
    setEditingId(id)
  })
}
```

### 3. Add Delete Confirmation

```tsx
function handleDelete(id: number) {
  if (confirm('Are you sure you want to delete this record?')) {
    deleteTourismRecord(id)
      .then(() => {
        alert('Record deleted successfully')
        refreshList()
      })
      .catch(error => {
        alert('Failed to delete: ' + error.message)
      })
  }
}
```

---

## ✅ Verification Checklist

- [x] Backend: TourismController created
- [x] Backend: Database migration run
- [x] Backend: Models updated with relationships
- [x] Backend: API routes registered
- [x] Backend: Laravel server running (http://127.0.0.1:8000)
- [x] Frontend: API service created
- [x] Frontend: Form integrated with API
- [x] Frontend: Loading states implemented
- [x] Frontend: Error handling implemented
- [x] Frontend: Success messages implemented
- [x] Frontend: Form reset on success
- [x] Test: Create operation works
- [ ] Test: Read operation UI (pending)
- [ ] Test: Update operation UI (pending)
- [ ] Test: Delete operation UI (pending)

---

## 📝 Summary

**What Works Now:**
1. ✅ Full backend CRUD API (`/api/tourism`)
2. ✅ Create operation from form → database
3. ✅ Automatic data transformation
4. ✅ Boat auto-creation if doesn't exist
5. ✅ Tourist records linked to trips
6. ✅ Loading states and error handling
7. ✅ Success messages and form reset

**What's Ready But Not Yet UI:**
- Read all records (API works, need list component)
- Read single record (API works, need detail view)
- Update record (API works, need edit mode)
- Delete record (API works, need confirmation dialog)

The **CREATE** operation is fully functional end-to-end. The backend supports full CRUD, you just need to build the UI components for Read/Update/Delete operations!
