import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const DEV_TO_API_KEY = process.env.DEV_TO_API_KEY;
    
    if (!DEV_TO_API_KEY) {
      return NextResponse.json({ error: 'DEV_TO_API_KEY not configured' }, { status: 500 });
    }

    const response = await fetch('https://dev.to/api/articles/me/published', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'api-key': DEV_TO_API_KEY,
        'Accept': 'application/vnd.forem.api-v1+json',
        'User-Agent': 'macOS-Themed-Portfolio',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const posts = await response.json();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}
