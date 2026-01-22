// src/app/api/reviews/route.js

import { NextResponse } from 'next/server';

export async function GET() {
  // ضع مفتاحك هنا مباشرة (مؤقتًا أو من env)
  const apiKey = process.env.GOOGLE_PLACES_API_KEY || 'AIzaSyD8_7SK48J-IQC0qpCwKVJwSnnog7NqUvE';
                                                       

  // Place IDs للفروع
  const branchIds = [
    'ChIJlVGux1IBLz4RPtRzCAHaj4Q', // الفرع الأول
    'ChIJpy0TWcf_Lj4Ro_8-q6Ky6Q8'  // الفرع الثاني
  ];

  if (!apiKey) {
    return NextResponse.json(
      { error: 'API Key is missing. Please set GOOGLE_PLACES_API_KEY.' },
      { status: 500 }
    );
  }

  try {
    let allReviews = [];

    for (const placeId of branchIds) {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}&language=ar`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();

      // تحقق من حالة Google API
      if (data.status !== 'OK') {
        let message = '';

        switch (data.status) {
          case 'REQUEST_DENIED':
            message = data.error_message || 'Request denied. Check API key, billing, and restrictions.';
            break;
          case 'OVER_QUERY_LIMIT':
            message = 'Quota exceeded. Please check your Google API quota.';
            break;
          case 'INVALID_REQUEST':
            message = 'Invalid request. Please check the place_id.';
            break;
          case 'NOT_FOUND':
            message = 'Place not found.';
            break;
          default:
            message = `Google API error: ${data.status}`;
        }

        console.error(`Google API Status for ${placeId}: ${data.status} - ${message}`);
        continue; // استمر للفروع الأخرى
      }

      if (data.result && data.result.reviews) {
        allReviews = [...allReviews, ...data.result.reviews];
      }
    }

    if (allReviews.length === 0) {
      return NextResponse.json(
        { error: 'No reviews found or all requests were denied by Google API.' },
        { status: 500 }
      );
    }

    // فلترة التقييمات عالية الجودة
    const highRatingReviews = allReviews.filter(review => review.rating >= 4);

    return NextResponse.json({ reviews: highRatingReviews });
  } catch (error) {
    console.error('Error fetching Google Reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews. Check API key, billing, and network.' },
      { status: 500 }
    );
  }
}
