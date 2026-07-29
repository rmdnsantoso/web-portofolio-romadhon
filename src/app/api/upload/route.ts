import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase'; // Sesuaikan lokasi file jika berbeda

export async function POST(request: Request) {

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Tidak ada file yang diunggah' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Bersihkan nama file dari karakter aneh
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '-');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileName = `${uniqueSuffix}-${safeName}`;

    // 1. Tembak file ke brankas Supabase
    const { data, error } = await supabaseAdmin.storage
      .from('portofolio-images') 
      .upload(fileName, buffer, {
        contentType: file.type,
      });

    if (error) {
      console.error('Supabase Error Details:', error);
      return NextResponse.json({ error: `Supabase Storage Error: ${error.message}` }, { status: 500 });
    }

    // 2. Ambil URL publik dari file yang baru diupload
    const { data: publicUrlData } = supabaseAdmin.storage
      .from('portofolio-images') 
      .getPublicUrl(fileName);

    // 3. Kembalikan URL publik ke halaman Admin
    return NextResponse.json({ url: publicUrlData.publicUrl });
    
  } catch (error: any) {
    console.error('Upload catch error:', error);
    return NextResponse.json({ error: `Server Error: ${error.message || 'Gagal memproses file'}` }, { status: 500 });
  }
}