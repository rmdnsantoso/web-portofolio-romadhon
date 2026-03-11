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

    // Buat nama file unik agar tidak bentrok jika namanya sama
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileName = `${uniqueSuffix}-${file.name.replace(/\s+/g, '-')}`;

    // 1. Tembak file ke brankas Supabase
    const { data, error } = await supabaseAdmin.storage
      .from('portfolio-images') // GANTI ini jika nama bucket-mu berbeda
      .upload(fileName, buffer, {
        contentType: file.type,
      });

    if (error) throw error;

    // 2. Ambil URL publik dari file yang baru diupload
    const { data: publicUrlData } = supabaseAdmin.storage
      .from('portofolio-images') // GANTI ini juga jika nama bucket berbeda
      .getPublicUrl(fileName);

    // 3. Kembalikan URL publik ke halaman Admin
    return NextResponse.json({ url: publicUrlData.publicUrl });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Gagal upload file ke server' }, { status: 500 });
  }
}