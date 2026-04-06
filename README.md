# Accessible Restroom Navigator (Texas A&M)

This project is a mobile application developed for **CSCE 432: Accessible Computing** at Texas A&M University.  
The app helps users quickly find and navigate to **accessible restrooms** across campus.

## Overview

The app displays accessible restroom locations on an interactive map, shows the user’s current location, and allows users to navigate to the nearest restroom using walking directions.

This tool is designed to improve accessibility and reduce the time required for users to locate usable restrooms on campus.


<img width="382.5" height="759" alt="Simulator Screenshot - iPhone 15 Pro Max - 2026-04-06 at 11 15 34-portrait" src="https://github.com/user-attachments/assets/7141b2f0-367d-4ea0-bf71-464ad953b01c" />

<img width="382.5" height="759" alt="Simulator Screenshot - iPhone 15 Pro Max - 2026-04-06 at 11 15 48-portrait" src="https://github.com/user-attachments/assets/3ad8c627-43d8-4edd-95ac-fc07c9b4217a" />


## Features

- Interactive campus map
- Displays accessible restroom locations
- Shows user’s current location
- Tap a marker to view restroom details
- Find nearest restroom
- Distance displayed in miles
- Walking directions to selected restroom
- Opens Apple Maps / Google Maps for navigation

## Data Source

Restroom location data is provided by Texas A&M GIS:

https://gis.tamu.edu/arcgis/rest/services/FCOR/MapInfo_20190529/MapServer/1/query

## User Flow

1. User opens the app
2. Map shows nearby accessible restrooms
3. User taps a restroom marker
4. Restroom information modal appears
5. User taps "Directions"
6. Walking navigation opens in Maps

## Tech Stack

- React Native (Expo)
- Expo Router
- React Native Maps
- Expo Location
- TypeScript

## Purpose

This app was created to support accessibility on campus by helping users:

- Locate wheelchair accessible restrooms
- Reduce travel time
- Navigate campus more easily
- Find appropriate restroom facilities quickly

## Course

CSCE 432 — Accessible Computing  
Texas A&M University
