# API Monitor Service Documentation

This documentation provides details about the API Monitor endpoints used to manage and monitor public APIs.

All responses follow this standard format:

```json
{
  "success": true,
  "data": {}
}
```

Or in case of error:

```json
{
  "success": false,
  "message": "Error message"
}
```

---

## 1. Get All Monitors

- **Endpoint:** `/api/monitors`
- **Method:** `GET`
- **Description:** Retrieves all API monitors sorted by latest created.
- **Authentication:** Not required (for now)

### Success Response

- **Code:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "_id": "69a40a6592fcc100526acb0f",
      "name": "jsonplaceholder get api",
      "url": "https://jsonplaceholder.typicode.com/posts/1",
      "method": "GET",
      "timeout": 5000,
      "interval": 1,
      "monitoringType": "manual",
      "isActive": true,
      "lastChecked": null,
      "lastStatus": null,
      "lastResponseTime": null,
      "averageResponseTime": 0,
      "totalChecks": 0,
      "totalFailures": 0,
      "uptimePercentage": 100,
      "consecutiveFailures": 0,
      "logs": [],
      "createdAt": "2026-03-01T09:44:05.263Z",
      "updatedAt": "2026-03-01T09:44:05.263Z",
      "__v": 0
    }
  ]
}
```

### Error Response

- **Code:** `500 Internal Server Error`

```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

## 2. Get Single Monitor

- **Endpoint:** `/api/monitors/:id`
- **Method:** `GET`
- **Description:** Retrieves a specific monitor by ID.
- **Authentication:** Not required

### Success Response

- **Code:** `200 OK`

```json
{
  "success": true,
  "data": {
    "_id": "69a40a6592fcc100526acb0f",
    "name": "jsonplaceholder get api",
    "url": "https://jsonplaceholder.typicode.com/posts/1",
    "method": "GET",
    "timeout": 5000,
    "interval": 1,
    "monitoringType": "manual",
    "isActive": true,
    "lastChecked": null,
    "lastStatus": null,
    "lastResponseTime": null,
    "averageResponseTime": 0,
    "totalChecks": 0,
    "totalFailures": 0,
    "uptimePercentage": 100,
    "consecutiveFailures": 0,
    "logs": [],
    "createdAt": "2026-03-01T09:44:05.263Z",
    "updatedAt": "2026-03-01T09:44:05.263Z",
    "__v": 0
  }
}
```

### Error Responses

- **404 Not Found**

```json
{
  "success": false,
  "message": "Monitor not found"
}
```

- **400 Bad Request** (Invalid ID)

```json
{
  "success": false,
  "message": "Invalid ID"
}
```

- **500 Internal Server Error**

---

## 3. Create a New Monitor

- **Endpoint:** `/api/monitors`
- **Method:** `POST`
- **Description:** Creates a new API monitor.
- **Authentication:** Not required (for now)

### Request Body

```json
{
  "name": "JSONPlaceholder GET API",
  "url": "https://jsonplaceholder.typicode.com/posts/1",
  "method": "GET",
  "timeout": 5000,
  "interval": 1, // will be used when monitoringType is scheduled
  "monitoringType": "manual",
  "isActive": true
}
```

### Allowed Fields Only

Only the following fields are accepted:

- `name` (string, required)
- `url` (valid URL, required)
- `method` ("GET")
- `timeout` (1000–60000 ms)
- `interval` (1–24 hours)
- `monitoringType` ("manual" | "scheduled")
- `isActive` (boolean)

Unknown fields will be rejected.

### Success Response

- **Code:** `201 Created`

```json
{
  "success": true,
  "data": {
    "name": "jsonplaceholder get api",
    "url": "https://jsonplaceholder.typicode.com/posts/1",
    "method": "GET",
    "timeout": 5000,
    "interval": 1,
    "monitoringType": "manual",
    "isActive": true,
    "lastChecked": null,
    "lastStatus": null,
    "lastResponseTime": null,
    "averageResponseTime": 0,
    "totalChecks": 0,
    "totalFailures": 0,
    "uptimePercentage": 100,
    "consecutiveFailures": 0,
    "_id": "69a40a6592fcc100526acb0f",
    "logs": [],
    "createdAt": "2026-03-01T09:44:05.263Z",
    "updatedAt": "2026-03-01T09:44:05.263Z",
    "__v": 0
  }
}
```

### Error Responses

- **400 Bad Request** (Validation Error)

```json
{
  "success": false,
  "message": "Invalid URL format"
}
```

- **500 Internal Server Error**

---

## 4. Update Monitor

- **Endpoint:** `/api/monitors/:id`
- **Method:** `PATCH`
- **Description:** Updates configuration fields of a monitor.
- **Authentication:** Not required

### Request Body (Partial Allowed)

You may send one or more of:

```json
{
  "name": "jsonplaceholder get api for test"
}
```

At least one field must be provided.

### Success Response

- **Code:** `200 OK`

```json
{
  "success": true,
  "data": {
    "_id": "69a40a6592fcc100526acb0f",
    "name": "jsonplaceholder get api for test",
    "url": "https://jsonplaceholder.typicode.com/posts/1",
    "method": "GET",
    "timeout": 5000,
    "interval": 1,
    "monitoringType": "scheduled",
    "isActive": true,
    "lastChecked": null,
    "lastStatus": null,
    "lastResponseTime": null,
    "averageResponseTime": 0,
    "totalChecks": 0,
    "totalFailures": 0,
    "uptimePercentage": 100,
    "consecutiveFailures": 0,
    "logs": [],
    "createdAt": "2026-03-01T09:44:05.263Z",
    "updatedAt": "2026-03-01T09:52:28.351Z",
    "__v": 0
  }
}
```

### Error Responses

- **400 Bad Request**
  - Invalid ID
  - Validation error
  - Empty update body

- **404 Not Found**
  - Monitor not found

- **500 Internal Server Error**

---

## 5. Soft Delete Monitor

- **Endpoint:** `/api/monitors/:id`
- **Method:** `DELETE`
- **Description:** Deactivates a monitor (sets `isActive` to false).
- **Authentication:** Not required

### Success Response

```json
{
  "success": true,
  "message": "Monitor deactivated"
}
```

### Error Responses

- 400 Invalid ID
- 404 Monitor not found
- 500 Internal Server Error

---

## 6. Trigger Manual Check

- **Endpoint:** `/api/monitors/:id/check`
- **Method:** `POST`
- **Description:** Manually triggers API monitoring for the specified monitor.
- **Authentication:** Not required

### Success Response

```json
{
  "success": true,
  "data": {
    "monitor": {
      "_id": "69a40a6592fcc100526acb0f",
      "name": "jsonplaceholder get api for test",
      "url": "https://jsonplaceholder.typicode.com/posts/1",
      "method": "GET",
      "timeout": 5000,
      "interval": 1,
      "monitoringType": "scheduled",
      "isActive": true,
      "lastChecked": "2026-03-01T09:55:40.710Z",
      "lastStatus": true,
      "lastResponseTime": 106,
      "averageResponseTime": 114.5,
      "totalChecks": 2,
      "totalFailures": 0,
      "uptimePercentage": 100,
      "consecutiveFailures": 0,
      "logs": [
        {
          "timestamp": "2026-03-01T09:53:30.553Z",
          "responseTime": 123,
          "statusCode": 200,
          "success": true
        },
        {
          "timestamp": "2026-03-01T09:55:40.710Z",
          "responseTime": 106,
          "statusCode": 200,
          "success": true
        }
      ],
      "createdAt": "2026-03-01T09:44:05.263Z",
      "updatedAt": "2026-03-01T09:55:40.711Z",
      "__v": 0
    },
    "result": {
      "timestamp": "2026-03-01T09:55:40.710Z",
      "responseTime": 106,
      "statusCode": 200,
      "success": true
    }
  }
}
```

### Error Responses

- 400 Invalid ID
- 404 Monitor not found
- 500 Internal Server Error

---

# System-Controlled Fields (Not User Editable)

The following fields are managed internally by the system and cannot be set or updated by clients:

- `totalChecks`
- `totalFailures`
- `averageResponseTime`
- `uptimePercentage`
- `consecutiveFailures`
- `logs`
- `lastChecked`
- `lastStatus`
- `lastResponseTime`

---
