/**
 * Dịch vụ Xuất File PowerPoint (.pptx) Giảng Dạy Trên Lớp Cho Học Sinh
 * Chuyển đổi dữ liệu Slide đã được Gemini thiết kế chuyên biệt cho học sinh thành file trình chiếu 16:9 chuyên nghiệp.
 */

import PptxGenJS from 'pptxgenjs';
import type { SlidePresentationData, SlideItem } from './slideGeneratorService';

export async function exportTeachingSlidesToPowerPoint(
  slideData: SlidePresentationData,
  fileNamePrefix: string = 'BaiGiang'
): Promise<void> {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'EduAI - Trợ Lý Giáo Dục AI';
  pptx.title = slideData.lessonTitle;

  // Bảng màu hiện đại cho slide giảng dạy
  const THEME = {
    coverBg: 'F0FDF4', // Soft mint
    cardBg: 'FFFFFF',
    textDark: '0F172A', // Slate 900
    textMuted: '475569', // Slate 600
    primary: '1E3A8A', // Deep Indigo / Navy
    warmup: 'D97706', // Warm Amber
    knowledge: '2563EB', // Royal Blue
    practice: '059669', // Emerald
    quiz: '7C3AED', // Purple
    application: '0D9488', // Teal
    homework: '4338CA', // Indigo
  };

  const getSlideThemeColor = (type: SlideItem['type']): string => {
    switch (type) {
      case 'warmup':
        return THEME.warmup;
      case 'knowledge':
        return THEME.knowledge;
      case 'practice':
        return THEME.practice;
      case 'quiz':
        return THEME.quiz;
      case 'application':
        return THEME.application;
      case 'homework':
        return THEME.homework;
      default:
        return THEME.primary;
    }
  };

  for (const s of slideData.slides) {
    const slide = pptx.addSlide();
    slide.background = { color: 'F8FAFC' };

    // Thêm lời thoại giáo viên (Speaker Notes)
    if (s.speakerNotes) {
      slide.addNotes(`[GỢI Ý LỜI THOẠI CỦA GIÁO VIÊN TRÊN LỚP]:\n${s.speakerNotes}`);
    }

    if (s.type === 'cover') {
      // ==========================================
      // SLIDE BÌA (Cover Slide)
      // ==========================================
      slide.background = { color: THEME.coverBg };

      // Khối viền màu trên cùng
      slide.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: 0,
        w: '100%',
        h: 0.35,
        fill: { color: THEME.practice },
      });

      // Tag môn học & khối lớp
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.8,
        y: 0.8,
        w: 3.8,
        h: 0.45,
        rectRadius: 0.08,
        fill: { color: 'DCFCE7' },
        line: { color: '86EFAC', width: 1 },
      });
      slide.addText(`${slideData.subject.toUpperCase()} - ${slideData.grade.toUpperCase()}`, {
        x: 0.9,
        y: 0.85,
        w: 3.6,
        h: 0.35,
        fontSize: 12,
        bold: true,
        color: THEME.practice,
        fontFace: 'Arial',
        align: 'center',
      });

      // Tên bài học to rõ cho học sinh dễ đọc từ xa
      slide.addText(s.title || slideData.lessonTitle, {
        x: 0.8,
        y: 1.5,
        w: 11.5,
        h: 2.2,
        fontSize: 32,
        bold: true,
        color: THEME.textDark,
        fontFace: 'Arial',
        isTextBox: true,
      });

      // Thông tin bộ sách & định hướng
      slide.addText('Bộ sách: Kết nối tri thức với cuộc sống • Tích hợp Khung năng lực số (TT 02/2025)', {
        x: 0.8,
        y: 3.9,
        w: 11.5,
        h: 0.4,
        fontSize: 13,
        italic: true,
        color: THEME.textMuted,
        fontFace: 'Arial',
      });

      // Card giáo viên & trường
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.8,
        y: 4.6,
        w: 6.8,
        h: 1.8,
        rectRadius: 0.1,
        fill: { color: THEME.cardBg },
        line: { color: 'CBD5E1', width: 1 },
      });
      slide.addText(s.meta || 'Chào mừng các em học sinh đến với tiết học!', {
        x: 1.1,
        y: 4.8,
        w: 6.2,
        h: 1.4,
        fontSize: 14,
        color: THEME.textDark,
        fontFace: 'Arial',
        lineSpacingMultiple: 1.25,
      });
    } else if (s.type === 'quiz') {
      // ==========================================
      // SLIDE CÂU HỎI TRẮC NGHIỆM TƯƠNG TÁC (Quiz)
      // ==========================================
      const headerColor = getSlideThemeColor(s.type);

      // Header Banner
      slide.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: 0,
        w: '100%',
        h: 1.0,
        fill: { color: headerColor },
      });
      slide.addText(s.title || 'THỬ TÀI NHANH MẮT NHANH TRÍ', {
        x: 0.8,
        y: 0.25,
        w: 11.5,
        h: 0.5,
        fontSize: 20,
        bold: true,
        color: 'FFFFFF',
        fontFace: 'Arial',
      });

      // Hộp Câu hỏi
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.8,
        y: 1.3,
        w: 11.5,
        h: 1.6,
        rectRadius: 0.1,
        fill: { color: THEME.cardBg },
        line: { color: 'C4B5FD', width: 1.5 },
      });
      slide.addText(`❓ Câu hỏi: ${s.question || ''}`, {
        x: 1.1,
        y: 1.45,
        w: 10.9,
        h: 1.3,
        fontSize: 16,
        bold: true,
        color: THEME.textDark,
        fontFace: 'Arial',
        lineSpacingMultiple: 1.2,
      });

      // 4 Lựa chọn A, B, C, D xếp 2x2
      const opts = s.options || [];
      opts.forEach((optText, optIdx) => {
        const col = optIdx % 2;
        const row = Math.floor(optIdx / 2);
        const posX = 0.8 + col * 5.9;
        const posY = 3.1 + row * 1.5;

        slide.addShape(pptx.ShapeType.roundRect, {
          x: posX,
          y: posY,
          w: 5.6,
          h: 1.3,
          rectRadius: 0.1,
          fill: { color: THEME.cardBg },
          line: { color: 'E2E8F0', width: 1.2 },
        });

        slide.addText(optText, {
          x: posX + 0.3,
          y: posY + 0.2,
          w: 5.0,
          h: 0.9,
          fontSize: 14,
          bold: true,
          color: THEME.textDark,
          fontFace: 'Arial',
        });
      });

      // Hộp đáp án và giải thích ở dưới
      if (s.explanation) {
        slide.addShape(pptx.ShapeType.roundRect, {
          x: 0.8,
          y: 6.2,
          w: 11.5,
          h: 0.8,
          rectRadius: 0.08,
          fill: { color: 'F5F3FF' },
          line: { color: 'DDD6FE', width: 1 },
        });
        slide.addText(`🎉 Đáp án: ${s.correctAnswer || 'A'} • ${s.explanation}`, {
          x: 1.1,
          y: 6.3,
          w: 10.9,
          h: 0.6,
          fontSize: 13,
          bold: true,
          color: THEME.quiz,
          fontFace: 'Arial',
        });
      }
    } else {
      // ==========================================
      // CÁC SLIDE NỘI DUNG (Khởi động, Khám phá, Luyện tập, Vận dụng, Dặn dò)
      // ==========================================
      const headerColor = getSlideThemeColor(s.type);

      // Header Banner
      slide.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: 0,
        w: '100%',
        h: 1.0,
        fill: { color: headerColor },
      });
      slide.addText(s.title, {
        x: 0.8,
        y: 0.25,
        w: 11.5,
        h: 0.5,
        fontSize: 20,
        bold: true,
        color: 'FFFFFF',
        fontFace: 'Arial',
      });

      // Card nội dung chính (Bullet points)
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.8,
        y: 1.3,
        w: 11.5,
        h: s.highlightBox ? 4.1 : 5.5,
        rectRadius: 0.1,
        fill: { color: THEME.cardBg },
        line: { color: 'CBD5E1', width: 1 },
      });

      // Render danh sách bullet points
      const bullets = s.bullets || [];
      const bulletText = bullets.map((b) => `• ${b}`).join('\n\n');

      slide.addText(bulletText || 'Tham gia tích cực các hoạt động học tập!', {
        x: 1.2,
        y: 1.5,
        w: 10.7,
        h: s.highlightBox ? 3.7 : 5.1,
        fontSize: 15,
        color: THEME.textDark,
        fontFace: 'Arial',
        lineSpacingMultiple: 1.25,
        isTextBox: true,
      });

      // Hộp Điểm Nhấn (Highlight Box) ở chân slide
      if (s.highlightBox) {
        slide.addShape(pptx.ShapeType.roundRect, {
          x: 0.8,
          y: 5.6,
          w: 11.5,
          h: 1.4,
          rectRadius: 0.1,
          fill: { color: 'FEF3C7' }, // Light amber
          line: { color: 'FCD34D', width: 1.5 },
        });

        slide.addText(s.highlightBox, {
          x: 1.1,
          y: 5.75,
          w: 10.9,
          h: 1.1,
          fontSize: 14,
          bold: true,
          color: '92400E', // Dark amber text
          fontFace: 'Arial',
          lineSpacingMultiple: 1.2,
        });
      }
    }
  }

  // Tải file về máy tính
  const cleanName = fileNamePrefix.replace(/[\\/:*?"<>|]/g, '').slice(0, 40).trim();
  await pptx.writeFile({ fileName: `Slide_GiangDay_${cleanName}.pptx` });
}
