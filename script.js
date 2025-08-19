document.getElementById('shrinkBtn').addEventListener('click', () => {
  const files = document.getElementById('imageInput').files;
  const scale = parseInt(document.getElementById('scaleInput').value) / 100;
  const preview = document.getElementById('preview');
  preview.innerHTML = '';

  const useZip = files.length > 5;
  const zip = useZip ? new JSZip() : null;
  let processed = 0;

  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Show preview
        const previewImg = new Image();
        previewImg.src = canvas.toDataURL();
        preview.appendChild(previewImg);

        canvas.toBlob(blob => {
          if (useZip) {
            zip.file(`${file.name}`, blob);
            processed++;
            if (processed === files.length) {
              zip.generateAsync({ type: 'blob' }).then(content => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(content);
                link.download = 'shrunk_images.zip';
                link.click();
              });
            }
          } else {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${file.name}`;
            link.click();
          }
        }, 'image/png');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
});