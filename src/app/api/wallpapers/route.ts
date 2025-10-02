import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dir = path.join(process.cwd(), 'public', 'wallpapers');
    let files: string[] = [];
    if (fs.existsSync(dir)) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      files = entries
        .filter((e) => e.isFile())
        .map((e) => e.name)
        .filter((name) => /\.(png|jpe?g|webp|avif)$/i.test(name))
        .sort()
        .map((name) => `/wallpapers/${name}`);
    }
    return NextResponse.json({ wallpapers: files });
  } catch (error) {
    return NextResponse.json({ wallpapers: [] }, { status: 200 });
  }
}


