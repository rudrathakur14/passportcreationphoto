         let processedImageUrl = '';
let originalFileName = '';

// File input handling
document.getElementById('file-input').addEventListener('change', e => {
  if (e.target.files[0]) handleFile(e.target.files[0]);
});

// Drag‑and‑drop
const uploadBox = document.querySelector('.upload-box');
uploadBox.addEventListener('dragover', e => {
  e.preventDefault(); uploadBox.classList.add('dragover');
});
uploadBox.addEventListener('dragleave', () => {
  uploadBox.classList.remove('dragover');
});
uploadBox.addEventListener('drop', e => {
  e.preventDefault();
  uploadBox.classList.remove('dragover');
  if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
});

function handleFile(file) {
  const allowed = ['image/jpeg','image/png','image/webp','image/gif','image/bmp'];
  if (!allowed.includes(file.type)) {
    return showStatus('❌ Invalid file type — JPG/PNG/WebP/GIF/BMP only.', 'error');
  }
  if (file.size > 10 * 1024 * 1024) {
    return showStatus('❌ File too large (max 10 MB).', 'error');
  }
  originalFileName = file.name;
  processImage(file);
}

function processImage(file) {
  showStatus('🔄 Processing...', 'info');
  document.getElementById('progress-container').style.display = 'block';
  document.getElementById('loading-spinner').style.display = 'block';
  let progress = 0;
  const pi = setInterval(() => {
    progress = Math.min(90, progress + Math.random() * 20);
    document.getElementById('progress-fill').style.width = progress + '%';
  }, 200);

  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      setTimeout(() => {
        clearInterval(pi);
        document.getElementById('progress-fill').style.width = '100%';
        const processed = createPassportPhoto(img);
        displayResults(e.target.result, processed);

        setTimeout(() => {
          document.getElementById('progress-container').style.display = 'none';
          document.getElementById('loading-spinner').style.display = 'none';
          document.getElementById('progress-fill').style.width = '0%';
        }, 500);
      }, 1000);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function createPassportPhoto(img) {
  const size = 600;
  const dpr = window.devicePixelRatio || 1;
  const canvas = document.createElement('canvas');
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width = `${size}px`;
  canvas.style.height = `${size}px`;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, size, size);

  const ar = img.width / img.height;
  let sx, sy, s;
  if (ar > 1) {
    s = img.height;
    sx = (img.width - img.height) / 2;
    sy = 0;
  } else {
    s = img.width;
    sx = 0;
    sy = (img.height - img.width) / 2;
  }
  ctx.drawImage(img, sx, sy, s, s, 0, 0, size, size);

  const id = ctx.getImageData(0, 0, size * dpr, size * dpr);
  const d = id.data;
  for (let i = 0; i < d.length; i += 4) {
    d[i] = Math.min(255, d[i] * 1.05);
    d[i + 1] = Math.min(255, d[i + 1] * 1.05);
    d[i + 2] = Math.min(255, d[i + 2] * 1.05);
  }
  ctx.putImageData(id, 0, 0);

  return canvas.toDataURL('image/jpeg', 0.95);
}

function displayResults(orig, proc) {
  showStatus('✅ Photo ready!', 'success');
  const preview = document.getElementById('preview-section');
  document.getElementById('image-preview').innerHTML = `
    <div class="image-container">
      <h3>📸 Original</h3>
      <img src="${orig}" alt="Original">
    </div>
    <div class="image-container">
      <h3>🪪 Passport</h3>
      <img src="${proc}" alt="Passport">
      <p>600×600 • White background</p>
    </div>`;
  processedImageUrl = proc;
  preview.style.display = 'block';
  document.getElementById('download-section').style.display = 'block';
  setTimeout(() => preview.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
}

function downloadImage() {
  if (!processedImageUrl) return;
  const a = document.createElement('a');
  a.href = processedImageUrl;
  a.download = `passport_${originalFileName.replace(/\.\w+$/, '')}.jpg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showStatus('📁 Download started!', 'success');
}

function resetApp() {
  document.getElementById('preview-section').style.display = 'none';
  document.getElementById('file-input').value = '';
  document.getElementById('status-message').style.display = 'none';
  processedImageUrl = '';
  originalFileName = '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showStatus(msg, type) {
  const el = document.getElementById('status-message');
  el.textContent = msg;
  el.className = `status-message status-${type}`;
  el.style.display = 'block';
  if (type === 'success') setTimeout(() => el.style.display = 'none', 5000);
}
