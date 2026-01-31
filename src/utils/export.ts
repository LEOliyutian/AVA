import html2canvas from 'html2canvas';

/**
 * 将指定元素导出为 JPG 图片
 */
export async function exportToJpg(
  element: HTMLElement,
  filename: string
): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    height: element.scrollHeight,
    windowHeight: element.scrollHeight,
  });

  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/jpeg', 0.9);
  link.click();
}

/**
 * 将指定元素导出为 PNG 图片
 */
export async function exportToPng(
  element: HTMLElement,
  filename: string
): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    height: element.scrollHeight,
    windowHeight: element.scrollHeight,
  });

  const link = document.createElement('a');
  link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

/**
 * 生成预报导出文件名
 */
export function generateFilename(date: string, ext: string = 'jpg'): string {
  return `AvalancheForecast_${date}.${ext}`;
}
