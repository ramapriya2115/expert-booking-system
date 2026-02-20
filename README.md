# Real-Time Expert Session Booking System

## Overview
A full-stack real-time expert booking system built using:

- React (Frontend)
- Node.js + Express (Backend)
- MongoDB (Database)
- Socket.io (Real-Time Updates)

## Features

### Expert Listing
- Pagination
- Search by name
- Filter by category
- Loading & error handling

### Expert Detail
- View expert details
- View available slots grouped by date
- Real-time slot updates when booked

### Booking System
- Name, Email, Phone, Notes
- Prevents double booking
- Slot disabled after booking
- Success & error messages

### My Bookings
- Search bookings by email
- Shows booking status:
  - Pending
  - Confirmed
  - Completed

## Backend APIs

- GET /api/experts
- GET /api/experts/:id
- POST /api/bookings
- PATCH /api/bookings/:id/status
- GET /api/bookings?email=

## Critical Implementations

### Double Booking Prevention
Implemented using a compound unique index:
(expertId + date + timeSlot)

### Real-Time Updates
Implemented using Socket.io.

### Error Handling
Validation + meaningful error responses.

## How to Run

### Backend
cd Backend  
npm install  
npm run dev  

### Frontend
cd frontend  
npm install  
npm start  
