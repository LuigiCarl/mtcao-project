# MTCAO Laravel Backend Setup Instructions

## Prerequisites
- PHP 8.2 or higher
- Composer installed
- MySQL running (XAMPP)
- Node.js and npm installed

## Setup Steps

### 1. Navigate to Laravel Directory
```bash
cd MTCAO-LARAVEL
```

### 2. Install PHP Dependencies
```bash
composer install
```

### 3. Create Database
Create a MySQL database named `mtcao_laravel` in phpMyAdmin or via command line:
```sql
CREATE DATABASE mtcao_laravel;
```

### 4. Run Migrations
```bash
php artisan migrate
```

### 5. (Optional) Seed Database with Sample Data
```bash
php artisan db:seed
```

### 6. Start Laravel Development Server
```bash
php artisan serve
```

The Laravel API will be available at `http://localhost:8000`

## API Endpoints

### Tourists
- `GET /api/tourists` - List all tourists
- `POST /api/tourists` - Create new tourist
- `GET /api/tourists/{id}` - Get tourist details
- `PUT /api/tourists/{id}` - Update tourist
- `DELETE /api/tourists/{id}` - Delete tourist
- `GET /api/tourists/stats/summary` - Get tourist statistics
- `GET /api/tourists/stats/by-nationality` - Get stats by nationality
- `GET /api/tourists/stats/by-purpose` - Get stats by purpose
- `GET /api/tourists/stats/by-accommodation` - Get stats by accommodation type

### Boats
- `GET /api/boats` - List all boats
- `POST /api/boats` - Create new boat
- `GET /api/boats/{id}` - Get boat details
- `PUT /api/boats/{id}` - Update boat
- `DELETE /api/boats/{id}` - Delete boat
- `GET /api/boats/stats/summary` - Get boat statistics
- `GET /api/boats/stats/monthly-trips` - Get monthly trip stats

### Trips
- `GET /api/trips` - List all trips
- `POST /api/trips` - Create new trip
- `GET /api/trips/{id}` - Get trip details
- `PUT /api/trips/{id}` - Update trip
- `DELETE /api/trips/{id}` - Delete trip
- `GET /api/trips/stats/recent` - Get recent trips
- `GET /api/trips/stats/trends` - Get trip trends

### Analytics
- `GET /api/analytics/dashboard` - Get complete dashboard statistics
- `GET /api/analytics/forecast` - Get forecast data
- `GET /api/analytics/tourist-spots` - Get tourist spot statistics

## Testing the Connection

### Test with cURL:
```bash
curl http://localhost:8000/api/boats
```

### Test with Browser:
Open `http://localhost:8000/api/analytics/dashboard` in your browser

## Troubleshooting

### CORS Issues
- Make sure Laravel is running on port 8000
- Check that CORS configuration in `config/cors.php` includes your Next.js URL

### Database Connection
- Verify `.env` file has correct database credentials
- Ensure MySQL is running in XAMPP
- Check database name is `mtcao_laravel`

### API Not Found
- Make sure you've run migrations: `php artisan migrate`
- Check that api routes are loaded: `php artisan route:list`
