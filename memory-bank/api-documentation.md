# API Documentation

## Firebase Collections

### Events Collection
- Path: `/events`
- Operations:
  - GET: List all events
  - POST: Create new event
  - PUT: Update event
  - DELETE: Remove event
- Query Parameters:
  - `isFeatured`: Filter featured events
  - `date`: Filter by date range
  - `limit`: Paginate results

### Bulletins Collection
- Path: `/bulletins`
- Operations:
  - GET: List all bulletins
  - POST: Create new bulletin
  - PUT: Update bulletin
  - DELETE: Remove bulletin
- Query Parameters:
  - `category`: Filter by category
  - `limit`: Paginate results

### Users Collection
- Path: `/users/{uid}`
- Subcollections:
  - `projects`: User's submitted projects
  - `settings`: User preferences
- Operations:
  - GET: Get user profile
  - PUT: Update user profile
  - DELETE: Delete user account

## ImgBB Integration
- Endpoint: `https://api.imgbb.com/1/upload`
- Method: POST
- Headers:
  ```javascript
  {
    'Content-Type': 'multipart/form-data'
  }
  ```
- Parameters:
  - `key`: API Key (from environment variables)
  - `image`: Base64 encoded image data
- Response:
  ```javascript
  {
    data: {
      url: string,      // Direct image URL
      delete_url: string // URL to delete image
    }
  }
  ```

## Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Events collection rules
    match /events/{eventId} {
      allow read: if true;
      allow write: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Users collection rules
    match /users/{userId} {
      allow read: if request.auth != null && 
                    (request.auth.uid == userId || 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}