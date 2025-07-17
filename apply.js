 // File upload functionality
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        const fileInfo = document.getElementById('fileInfo');
        
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });
        
        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#4e54c8';
            uploadArea.style.backgroundColor = 'rgba(78, 84, 200, 0.1)';
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = '#d1d5db';
            uploadArea.style.backgroundColor = 'transparent';
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#d1d5db';
            uploadArea.style.backgroundColor = 'transparent';
            
            if (e.dataTransfer.files.length) {
                fileInput.files = e.dataTransfer.files;
                updateFileInfo();
            }
        });
        
        fileInput.addEventListener('change', updateFileInfo);
        
        function updateFileInfo() {
            if (fileInput.files.length > 0) {
                fileInfo.style.display = 'block';
                let fileNames = [];
                
                for (let i = 0; i < Math.min(fileInput.files.length, 3); i++) {
                    fileNames.push(fileInput.files[i].name);
                }
                
                fileInfo.innerHTML = `<strong>Selected files:</strong> ${fileNames.join(', ')}`;
                
                if (fileInput.files.length > 3) {
                    fileInfo.innerHTML += `<br><span style="color:#e74c3c;">Only first 3 files will be considered</span>`;
                }
            } else {
                fileInfo.style.display = 'none';
            }
        }
        
        // Form submission
        document.getElementById('artistForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form validation
            if (this.checkValidity()) {
                // In a real app, you would submit to a server here
                alert('Thank you for your application! Our team will review your submission and contact you within 5 business days.');
                this.reset();
                fileInfo.style.display = 'none';
            } else {
                alert('Please fill in all required fields.');
            }
        });