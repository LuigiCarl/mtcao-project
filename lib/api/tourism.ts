/**
 * Tourism API Service
 * Handles all API calls for tourism CRUD operations
 */

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export interface TouristEntry {
  name: string;
  age: string;
  gender: string;
  isForeign: boolean;
  nationality: string;
  origin: string;
  purpose: string;
  transport: string;
  destination: string;
  isOvernight: boolean;
  lengthOfStay: string;
}

export interface TourismFormData {
  visitDate: Date;
  visitTime: string;
  boatName: string;
  boatOperator: string;
  boatCaptain: string;
  boatCrew?: string;
  touristEntries: TouristEntry[];
}

export interface TourismRecord {
  id: number;
  trip: {
    id: number;
    boat_id: number;
    trip_date: string;
    departure_time: string;
    destination: string;
    passengers_count: number;
    trip_type: string;
    status: string;
    boat: {
      id: number;
      boat_name: string;
      operator_name: string;
      captain_name: string;
      crew_members?: string;
    };
  };
  tourists: Array<{
    id: number;
    trip_id: number;
    full_name: string;
    age: number;
    gender: string;
    nationality: string;
    origin_city: string;
    type: string;
    purpose: string;
    transport_mode: string;
    accommodation_type: string;
    arrival_date: string;
    departure_date: string;
    duration_days: number;
  }>;
}

export interface ApiResponse<T = any> {
  message?: string;
  trip?: any;
  tourists?: any[];
  summary?: {
    total_tourists: number;
    foreign: number;
    domestic: number;
  };
  data?: T;
  error?: string;
}

/**
 * Transform form data to backend format
 */
function transformFormData(formData: TourismFormData): any {
  return {
    visitDate: formData.visitDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
    visitTime: formData.visitTime,
    boatName: formData.boatName,
    boatOperator: formData.boatOperator,
    boatCaptain: formData.boatCaptain,
    boatCrew: formData.boatCrew || '',
    touristEntries: formData.touristEntries.map((tourist) => ({
      name: tourist.name,
      age: parseInt(tourist.age) || 0, // Convert string to integer
      gender: tourist.gender,
      isForeign: tourist.isForeign,
      nationality: tourist.nationality,
      origin: tourist.origin,
      purpose: tourist.purpose,
      transport: tourist.transport,
      destination: tourist.destination,
      isOvernight: tourist.isOvernight,
      lengthOfStay: parseFloat(tourist.lengthOfStay) || 0, // Convert string to number
    })),
  };
}

/**
 * Create a new tourism record (trip + tourists)
 */
export async function createTourismRecord(
  formData: TourismFormData
): Promise<ApiResponse> {
  try {
    const transformedData = transformFormData(formData);
    
    console.log('Sending tourism data:', transformedData);

    const response = await fetch(`${API_BASE_URL}/tourism`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(transformedData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('API Error Response:', data);
      
      // If there are validation messages, format them nicely
      if (data.messages) {
        const errorMessages = Object.entries(data.messages)
          .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
          .join('\n');
        throw new Error(`Validation failed:\n${errorMessages}`);
      }
      
      throw new Error(data.error || data.message || 'Failed to create tourism record');
    }

    return data;
  } catch (error) {
    console.error('Create tourism record error:', error);
    throw error;
  }
}

/**
 * Get all tourism records with optional filters
 */
export async function getTourismRecords(filters?: {
  month?: string;
  year?: string;
  boat_id?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  per_page?: number;
}): Promise<ApiResponse> {
  try {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, String(value));
        }
      });
    }

    const url = `${API_BASE_URL}/tourism${params.toString() ? `?${params.toString()}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch tourism records');
    }

    return data;
  } catch (error) {
    console.error('Get tourism records error:', error);
    throw error;
  }
}

/**
 * Get a single tourism record by ID
 */
export async function getTourismRecord(id: number): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/tourism/${id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch tourism record');
    }

    return data;
  } catch (error) {
    console.error('Get tourism record error:', error);
    throw error;
  }
}

/**
 * Update a tourism record
 */
export async function updateTourismRecord(
  id: number,
  formData: TourismFormData
): Promise<ApiResponse> {
  try {
    console.log('=== updateTourismRecord called ===')
    console.log('ID:', id)
    console.log('FormData:', formData)
    
    // Use the same transformation as create - send complete data
    const transformedData = transformFormData(formData);

    console.log('Transformed data:', transformedData)
    console.log('Making PUT request to:', `${API_BASE_URL}/tourism/${id}`)

    const response = await fetch(`${API_BASE_URL}/tourism/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(transformedData),
    });

    console.log('Response status:', response.status)
    console.log('Response headers:', response.headers.get('content-type'))
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // Response is not JSON (might be HTML error page)
      const text = await response.text();
      console.error('Non-JSON response:', text);
      throw new Error(`Server returned non-JSON response (Status: ${response.status}). Check Laravel logs.`);
    }
    
    console.log('Response data:', data)

    if (!response.ok) {
      console.error('Update failed:', data)
      
      // Format validation errors if present
      if (data.errors || data.messages) {
        const errors = data.errors || data.messages;
        const errorMessages = Object.entries(errors)
          .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
          .join('\n');
        throw new Error(`Validation failed:\n${errorMessages}`);
      }
      
      throw new Error(data.error || data.message || 'Failed to update tourism record');
    }

    return data;
  } catch (error) {
    console.error('Update tourism record error:', error);
    throw error;
  }
}

/**
 * Delete a tourism record
 */
export async function deleteTourismRecord(id: number): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/tourism/${id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete tourism record');
    }

    return data;
  } catch (error) {
    console.error('Delete tourism record error:', error);
    throw error;
  }
}
