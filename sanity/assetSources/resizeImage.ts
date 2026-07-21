const MAX_WIDTH = 1600;

export async function resizeImageFile(
  file: File,
): Promise<{ blob: Blob; filename: string }> {
  const bitmap = await createImageBitmap(file, {
    imageOrientation: "from-image",
  });

  if (bitmap.width <= MAX_WIDTH) {
    bitmap.close();
    return { blob: file, filename: file.name };
  }

  const targetWidth = MAX_WIDTH;
  const targetHeight = Math.round(bitmap.height * (MAX_WIDTH / bitmap.width));

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context not available");
  ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
  bitmap.close();

  const isPng = file.type === "image/png";
  const mime = isPng ? "image/png" : "image/jpeg";

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
      mime,
      isPng ? undefined : 0.82,
    );
  });

  const filename = isPng ? file.name : file.name.replace(/\.\w+$/, ".jpg");
  return { blob, filename };
}
