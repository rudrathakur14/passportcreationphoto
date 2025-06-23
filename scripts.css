         let processedImageUrl = '';
        
         let originalFileName = '';
        
        // File input handling
        document.getElementById('file-input').addEventListener('change', handleFileSelect);
        
        // Drag and drop handling
        const uploadBox = document.querySelector('.upload-box');
        
        uploadBox.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadBox.classList.add('dragover');
        });
        
        uploadBox.addEventListener('dragleave', () => {
            uploadBox.classList.remove('dragover');
        });
        
        uploadBox.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadBox.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFile(files[0]);
            }
        });
        
        function handleFileSelect(e) {
            const file = e.target.files[0];
            if (file) {
                handleFile(file);
            }
        }
        
        function handleFile(file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'];
            if (!allowedTypes.includes(file.type)) {
                showStatus('❌ Please upload a valid image file (JPG, PNG, WEBP, GIF, BMP)', 'error');
                return;
            }
            
            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                showStatus('❌ File size too large. Please upload an image smaller than 10MB.', 'error');
                return;
            }
            
            originalFileName = file.name;
            processImage(file);
        }
        
        function processImage(file) {
            showStatus('🔄 Processing your photo...', 'success');
            document.getElementById('progress-container').style.display = 'block';
            document.getElementById('loading-spinner').style.display = 'block';
            
            // Simulate processing steps
            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += Math.random() * 20;
                if (progress > 90) progress = 90;
                document.getElementById('progress-fill').style.width = progress + '%';
            }, 200);
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    setTimeout(() => {
                        clearInterval(progressInterval);
                        document.getElementById('progress-fill').style.width = '100%';
                        
                        const processedImageData = createPassportPhoto(img);
                        displayResults(e.target.result, processedImageData);
                        
                        setTimeout(() => {
                            document.getElementById('progress-container').style.display = 'none';
                            document.getElementById('loading-spinner').style.display = 'none';
                            document.getElementById('progress-fill').style.width = '0%';
                        }, 1000);
                    }, 1500);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
        
        function createPassportPhoto(img) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set passport photo dimensions
            const passportSize = 600;
            canvas.width = passportSize;
            canvas.height = passportSize;
            
            // Fill with white background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, passportSize, passportSize);
            
            // Calculate dimensions to maintain aspect ratio
            const imgAspectRatio = img.width / img.height;
            let drawWidth, drawHeight, offsetX, offsetY;
            
            if (imgAspectRatio > 1) {
                // Image is wider than tall
                drawHeight = passportSize;
                drawWidth = drawHeight * imgAspectRatio;
                offsetX = (passportSize - drawWidth) / 2;
                offsetY = 0;
            } else {
                // Image is taller than wide or square
                drawWidth = passportSize;
                drawHeight = drawWidth / imgAspectRatio;
                offsetX = 0;
                offsetY = (passportSize - drawHeight) / 2;
            }
            
            // Draw the image
            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
            
            // Apply slight enhancement
            const imageData = ctx.getImageData(0, 0, passportSize, passportSize);
            const data = imageData.data;
            
            // Subtle brightness and contrast adjustment
            for (let i = 0; i < data.length; i += 4) {
                data[i] = Math.min(255, data[i] * 1.05);     // Red
                data[i + 1] = Math.min(255, data[i + 1] * 1.05); // Green
                data[i + 2] = Math.min(255, data[i + 2] * 1.05); // Blue
            }
            
            ctx.putImageData(imageData, 0, 0);
            
            return canvas.toDataURL('image/jpeg', 0.95);
        }
        
        function displayResults(originalImage, processedImage) {
            showStatus('✅ Photo processed successfully!', 'success');
            
            const previewSection = document.getElementById('preview-section');
            const imagePreview = document.getElementById('image-preview');
            const downloadSection = document.getElementById('download-section');
            
            imagePreview.innerHTML = `
                <div class="image-container">
                    <h3>📸 Original Photo</h3>
                    <img src="${originalImage}" alt="Original Photo">
                    <p style="margin-top: 10px; color: #6c757d;">Your uploaded image</p>
                </div>
                <div class="image-container">
                    <h3>🪪 Passport Photo</h3>
                    <img src="${processedImage}" alt="Passport Photo">
                    <p style="margin-top: 10px; color: #28a745; font-weight: 600;">600x600 • White Background</p>
                </div>
            `;
            
            processedImageUrl = processedImage;
            previewSection.style.display = 'block';
            downloadSection.style.display = 'block';
            
            // Scroll to results
            setTimeout(() => {
                previewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 500);
        }
        
        function downloadImage() {
            if (processedImageUrl) {
                const link = document.createElement('a');
                link.download = `passport_photo_${originalFileName.split('.')[0]}.jpg`;
                link.href = processedImageUrl;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                showStatus('📁 Passport photo downloaded successfully!', 'success');
            }
        }
        
        function resetApp() {
            document.getElementById('preview-section').style.display = 'none';
            document.getElementById('file-input').value = '';
            document.getElementById('status-message').style.display = 'none';
            processedImageUrl = '';
            originalFileName = '';
            
            // Scroll back to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        function showStatus(message, type) {
            const statusEl = document.getElementById('status-message');
            statusEl.innerHTML = message;
            statusEl.className = 'status-message status-' + type;
            statusEl.style.display = 'block';
            
            if (type === 'success') {
                setTimeout(() => {
                    if (statusEl.innerHTML === message) {
                        statusEl.style.display = 'none';
                    }
                }, 5000);
            }
        }
        
        // Add some interactive effects
        document.addEventListener('DOMContentLoaded', function() {
            // Add scroll animations
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animation = 'fadeIn 0.8s ease-out forwards';
                    }
                });
            }, observerOptions);
            
            document.querySelectorAll('.feature').forEach(feature => {
                observer.observe(feature);
            });
        });
