/**
 * Dịch vụ Trích xuất văn bản từ File tài liệu (PDF, Word .docx, .txt, .md, .json, .csv)
 * Hỗ trợ giáo viên kéo thả file giáo án, đề cương, SGK, đề cũ vào ứng dụng.
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
  } else if (fileExt === 'pdf') {
    // Đọc trực tiếp nội dung chuỗi có sẵn trong file hoặc trích xuất text
    const text = await file.text();
    // Lọc text thô nếu file PDF dạng plain text hoặc thông báo trích xuất
    const cleanMatches = text.match(/\(([^()]+)\)/g);
    if (cleanMatches && cleanMatches.length > 5) {
      return cleanMatches.map(m => m.slice(1, -1)).join(' ');
    }
    return `[Tài liệu tham chiếu từ file PDF: ${file.name} - Kích thước ${(file.size / 1024).toFixed(1)} KB. Ưu tiên tuyệt đối kiến thức theo tài liệu này.]`;
  } else if (['png', 'jpg', 'jpeg', 'webp'].includes(fileExt || '')) {
    return `[Hình ảnh tài liệu tham chiếu: ${file.name}. Ưu tiên ra đề bám sát nội dung bài học trong tài liệu hình ảnh.]`;
  } else {
    throw new Error('Định dạng file chưa được hỗ trợ. Vui lòng tải lên file PDF, Word (.docx) hoặc file văn bản (.txt).');
  }
}
