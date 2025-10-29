# Frontend-Backend Connection Guide

This guide explains how your Next.js frontend is connected to the Laravel backend.

## Architecture Overview

```
Next.js Frontend (Port 3000) ←→ Laravel Backend API (Port 8000) ←→ MySQL Database
```

## Connection Setup

### 1. Environment Configuration

The API URL is configured in `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 2. API Client (`lib/api-client.ts`)

Centralized API client for making HTTP requests:
- GET, POST, PUT, DELETE methods
- Automatic JSON handling
- Error handling
- Credentials included for CORS

### 3. React Hooks (`hooks/use-api.ts`)

Custom hooks for data fetching and mutations:
- `useBoats()` - Manage boat data
- `useTourists()` - Manage tourist data
- `useTrips()` - Manage trip data
- `useDashboardStats()` - Fetch dashboard statistics

## Usage Examples

### Fetching Data in a Component

```tsx
"use client"

import { useBoats } from '@/hooks/use-api';

export function BoatList() {
  const { boats, loading, error } = useBoats();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {boats.map((boat: any) => (
        <div key={boat.id}>{boat.boat_name}</div>
      ))}
    </div>
  );
}
```

### Creating New Data

```tsx
const { boats, createBoat } = useBoats();

const handleSubmit = async (data) => {
  try {
    await createBoat(data);
    alert('Boat created successfully!');
  } catch (error) {
    alert('Error creating boat');
  }
};
```

### Direct API Calls

```tsx
import { apiClient } from '@/lib/api-client';

// Get specific data
const data = await apiClient.get('/tourists/stats/summary');

// Create new record
const newBoat = await apiClient.post('/boats', boatData);

// Update record
const updated = await apiClient.put('/boats/1', updateData);

// Delete record
await apiClient.delete('/boats/1');
```

## Available API Endpoints

### Analytics Dashboard
```tsx
const { stats, loading } = useDashboardStats();
// Returns: summary, nationality_stats, purpose_stats, accommodation_stats, trip_trends
```

### Boats Management
```tsx
const { boats, createBoat, updateBoat, deleteBoat } = useBoats();
```

### Tourists Management
```tsx
const { tourists, createTourist, updateTourist, deleteTourist } = useTourists();
```

### Trips Management
```tsx
const { trips, createTrip, updateTrip, deleteTrip } = useTrips();
```

## Starting Both Servers

### Terminal 1: Laravel Backend
```bash
cd MTCAO-LARAVEL
php artisan serve
# Runs on http://localhost:8000
```

### Terminal 2: Next.js Frontend
```bash
npm run dev
# Runs on http://localhost:3000
```

## Troubleshooting

### Connection Refused
- Ensure Laravel is running: `php artisan serve`
- Check the port in `.env.local` matches Laravel's port
- Verify MySQL is running in XAMPP

### CORS Errors
- Laravel CORS is configured in `MTCAO-LARAVEL/config/cors.php`
- Allowed origins: `http://localhost:3000`, `http://localhost:3001`
- Credentials are supported

### No Data Showing
1. Run migrations: `cd MTCAO-LARAVEL && php artisan migrate`
2. Seed database: `php artisan db:seed`
3. Check API manually: Visit `http://localhost:8000/api/boats` in browser

### API Errors
- Check Laravel logs: `MTCAO-LARAVEL/storage/logs/laravel.log`
- Use browser DevTools Network tab to inspect requests
- Verify request/response format matches expected structure

## Next Steps

1. Update dashboard to use real API data
2. Replace static chart data with API responses
3. Add form submissions to save data
4. Implement authentication (optional)
5. Add real-time updates with WebSockets (optional)

## Database Schema

### Boats Table
- id, boat_name, registration_number, boat_type, capacity
- operator_name, operator_contact, captain_name, captain_license
- home_port, engine_type, engine_horsepower, year_built, status

### Tourists Table
- id, first_name, last_name, nationality, type
- purpose, accommodation_type, arrival_date, departure_date
- duration_days, contact_number, email, remarks

### Trips Table
- id, boat_id, trip_date, departure_time, arrival_time
- destination, passengers_count, trip_type, status, revenue, remarks
