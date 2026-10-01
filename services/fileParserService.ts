/**
 * Dịch vụ Trích xuất văn bản từ File tài liệu (Word .docx, .txt, .md, .json)
 * Hỗ trợ giáo viên kéo thả file giáo án, đề cương vào ứng dụng.
 */

import mammoth from 'mammoth';

export async function extractTextFromFile(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop()?.toLowerCase();

  if (fileExt === 'docx') {
    // Trích xuất văn bản từ file Word .docx bằng mammoth
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value || '';
  } else if (fileExt === 'txt' || fileExt === 'md' || fileExt === 'json' || fileExt === 'csv') {
    // Đọc văn bản thông thường
    return await file.text();
  } else {
    throw new Error('Định dạng file chưa được hỗ trợ. Vui lòng tải lên file Word (.docx) hoặc file văn bản (.txt).');
  }
}
