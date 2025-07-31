/**
 * RRK YouTube Thumbnail Downloader - Protected JavaScript
 * Copyright © 2025 Ravi Ranjan Kashyap - All Rights Reserved
 * This code is protected and cannot be copied or modified without permission
 */

// Privacy Protection - Disable developer tools and inspect
(function() {
    'use strict';
    
    // Disable right-click context menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Disable keyboard shortcuts for developer tools
    document.addEventListener('keydown', function(e) {
        // F12 key
        if (e.keyCode === 123) {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+Shift+I (Chrome DevTools)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+Shift+J (Chrome Console)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+U (View Source)
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+S (Save Page)
        if (e.ctrlKey && e.keyCode === 83) {
            e.preventDefault();
            return false;
        }
    });
    
    // Detect developer tools
    let devtools = {
        open: false,
        orientation: null
    };
    
    const threshold = 160;
    
    setInterval(() => {
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        
        if (widthThreshold || heightThreshold) {
            if (!devtools.open) {
                devtools.open = true;
                devtools.orientation = widthThreshold ? 'vertical' : 'horizontal';
                document.body.innerHTML = '<div style="position:fixed;top:0;left:0;width:100%;height:100%;background:#000;color:#fff;display:flex;align-items:center;justify-content:center;font-size:24px;z-index:999999;">⚠️ Developer Tools Detected - Content Protected by Ravi Ranjan Kashyap</div>';
            }
        } else {
            devtools.open = false;
            devtools.orientation = null;
        }
    }, 500);
    
    // Disable text selection
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Disable drag and drop
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    });
    
})();

// App state
let currentQuality = 'maxresdefault';
let currentVideoId = '';
let downloadHistory = [];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadHistory();
    selectQuality('maxresdefault');
    
    // Additional protection
    console.log('%c⚠️ WARNING ⚠️', 'color: red; font-size: 20px; font-weight: bold;');
    console.log('%cThis is a protected application by Ravi Ranjan Kashyap', 'color: red; font-size: 14px;');
    console.log('%cAny unauthorized copying or modification is prohibited', 'color: red; font-size: 14px;');
});

// Extract video ID from URL
function extractVideoId(url) {
    const regex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|shorts\/|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
    const match = url.match(regex);
    return match ? match[6] : null;
}

// Select quality
function selectQuality(quality) {
    currentQuality = quality;
    
    // Update active card
    document.querySelectorAll('.quality-card').forEach(card => {
        card.classList.remove('active');
    });
    document.querySelector(`[data-quality="${quality}"]`).classList.add('active');
}

// Clear URL input
function clearUrl() {
    document.getElementById('urlInput').value = '';
    hideThumbnail();
}

// Show loading state
function showLoading() {
    document.getElementById('loadingState').style.display = 'block';
    document.getElementById('errorState').style.display = 'none';
    hideThumbnail();
}

// Hide loading state
function hideLoading() {
    document.getElementById('loadingState').style.display = 'none';
}

// Show error state
function showError(message) {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorState').style.display = 'block';
    document.getElementById('loadingState').style.display = 'none';
    hideThumbnail();
}

// Hide error state
function hideError() {
    document.getElementById('errorState').style.display = 'none';
}

// Hide thumbnail
function hideThumbnail() {
    document.getElementById('thumbnailSection').style.display = 'none';
}

// Show success toast
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
}

// Preview thumbnail
function previewThumbnail() {
    const url = document.getElementById('urlInput').value.trim();
    if (!url) {
        showError('Please enter a YouTube URL');
        return;
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
        showError('Invalid YouTube URL format');
        return;
    }

    currentVideoId = videoId;
    showLoading();

    // Generate thumbnail URL
    let imgUrl;
    if (currentQuality === 'webp') {
        imgUrl = `https://img.youtube.com/vi_webp/${videoId}/maxresdefault.webp`;
    } else {
        imgUrl = `https://img.youtube.com/vi/${videoId}/${currentQuality}.jpg`;
    }

    // Test if image exists
    const img = new Image();
    img.onload = function() {
        hideLoading();
        displayThumbnail(imgUrl);
        addToHistory(url, currentQuality, imgUrl);
        showToast('Thumbnail loaded successfully!', 'success');
    };
    img.onerror = function() {
        hideLoading();
        showError('Thumbnail not available for this quality. Try another quality.');
    };
    img.src = imgUrl;
}

// Display thumbnail
function displayThumbnail(imgUrl) {
    const thumbnailImg = document.getElementById('thumbnailImg');
    const thumbnailSection = document.getElementById('thumbnailSection');
    const qualityBadge = document.getElementById('qualityBadge');

    thumbnailImg.src = imgUrl;
    qualityBadge.textContent = getQualityName(currentQuality);
    thumbnailSection.style.display = 'block';
}

// Get quality name
function getQualityName(quality) {
    const names = {
        'maxresdefault': 'Ultra HD',
        'hqdefault': 'High Quality',
        'mqdefault': 'Medium Quality',
        'webp': 'WebP Format'
    };
    return names[quality] || quality;
}

// Download thumbnail
function downloadThumbnail() {
    const url = document.getElementById('urlInput').value.trim();
    if (!url) {
        showError('Please enter a YouTube URL');
        return;
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
        showError('Invalid YouTube URL format');
        return;
    }

    currentVideoId = videoId;
    previewThumbnail();
}

// Download current thumbnail
function downloadCurrentThumbnail() {
    const thumbnailImg = document.getElementById('thumbnailImg');
    if (!thumbnailImg.src) {
        showError('No thumbnail to download');
        return;
    }

    // Create a more descriptive filename
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `RRK-YouTube-Thumbnail-${currentVideoId}-${currentQuality}-${timestamp}.jpg`;
    
    showToast('Preparing download...', 'success');
    
    // Enhanced download with proper blob handling
    fetch(thumbnailImg.src)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then(blob => {
            // Create blob URL
            const blobUrl = URL.createObjectURL(blob);
            
            // Create download link
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            link.style.display = 'none';
            
            // Append to body, click, and cleanup
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Cleanup blob URL
            setTimeout(() => {
                URL.revokeObjectURL(blobUrl);
            }, 100);
            
            showToast(`✅ Downloaded: ${filename}`, 'success');
            
            // Add to history
            const url = document.getElementById('urlInput').value.trim();
            addToHistory(url, currentQuality, thumbnailImg.src);
        })
        .catch(error => {
            console.error('Download failed:', error);
            
            // Fallback method using canvas
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set canvas dimensions
            canvas.width = thumbnailImg.naturalWidth || 1280;
            canvas.height = thumbnailImg.naturalHeight || 720;
            
            // Draw image on canvas
            ctx.drawImage(thumbnailImg, 0, 0);
            
            // Convert to blob and download
            canvas.toBlob((blob) => {
                const blobUrl = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = filename;
                link.style.display = 'none';
                
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                setTimeout(() => {
                    URL.revokeObjectURL(blobUrl);
                }, 100);
                
                showToast(`✅ Downloaded: ${filename} (Fallback)`, 'success');
            }, 'image/jpeg', 0.95);
        });
}

// Download all qualities
function downloadAllQualities() {
    const url = document.getElementById('urlInput').value.trim();
    if (!url) {
        showError('Please enter a YouTube URL');
        return;
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
        showError('Invalid YouTube URL format');
        return;
    }

    const qualities = ['maxresdefault', 'hqdefault', 'mqdefault'];
    let downloaded = 0;
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');

    showToast('Starting batch download...', 'success');

    qualities.forEach((quality, index) => {
        setTimeout(() => {
            const imgUrl = `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
            const filename = `RRK-YouTube-Thumbnail-${videoId}-${quality}-${timestamp}.jpg`;
            
            // Enhanced download for each quality
            fetch(imgUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to download ${quality}`);
                    }
                    return response.blob();
                })
                .then(blob => {
                    const blobUrl = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = blobUrl;
                    link.download = filename;
                    link.style.display = 'none';
                    
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    
                    setTimeout(() => {
                        URL.revokeObjectURL(blobUrl);
                    }, 100);
                    
                    downloaded++;
                    showToast(`✅ Downloaded ${quality} (${downloaded}/${qualities.length})`, 'success');
                    
                    if (downloaded === qualities.length) {
                        showToast('🎉 All qualities downloaded successfully!', 'success');
                    }
                })
                .catch(error => {
                    console.error(`Download failed for ${quality}:`, error);
                    downloaded++;
                    showToast(`❌ Failed to download ${quality}`, 'error');
                    
                    if (downloaded === qualities.length) {
                        showToast('Some downloads failed. Please try again.', 'error');
                    }
                });
        }, index * 1000); // Increased delay to prevent browser blocking
    });
}

// Copy image URL
function copyImageUrl() {
    const thumbnailImg = document.getElementById('thumbnailImg');
    if (!thumbnailImg.src) {
        showError('No thumbnail to copy');
        return;
    }

    navigator.clipboard.writeText(thumbnailImg.src).then(() => {
        showToast('URL copied to clipboard!', 'success');
    }).catch(() => {
        showError('Failed to copy URL');
    });
}

// Add to history
function addToHistory(url, quality, imgUrl) {
    const historyItem = {
        url: url,
        quality: quality,
        imgUrl: imgUrl,
        timestamp: new Date().toISOString()
    };

    downloadHistory.unshift(historyItem);
    if (downloadHistory.length > 10) {
        downloadHistory = downloadHistory.slice(0, 10);
    }

    saveHistory();
    updateHistoryDisplay();
}

// Save history to localStorage
function saveHistory() {
    localStorage.setItem('thumbnailHistory', JSON.stringify(downloadHistory));
}

// Load history from localStorage
function loadHistory() {
    const saved = localStorage.getItem('thumbnailHistory');
    if (saved) {
        downloadHistory = JSON.parse(saved);
        updateHistoryDisplay();
    }
}

// Update history display
function updateHistoryDisplay() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';

    downloadHistory.forEach((item, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="history-info">
                <div class="history-url">${item.url.substring(0, 50)}...</div>
                <div class="history-quality">${getQualityName(item.quality)}</div>
            </div>
            <div class="history-actions">
                <button class="history-btn history-download" onclick="downloadFromHistory('${item.imgUrl}', '${item.quality}')">
                    <i class="fas fa-download"></i>
                </button>
                <button class="history-btn history-remove" onclick="removeFromHistory(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        historyList.appendChild(historyItem);
    });
}

// Download from history
function downloadFromHistory(imgUrl, quality) {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `RRK-YouTube-Thumbnail-${quality}-${timestamp}.jpg`;
    
    showToast('Preparing download...', 'success');
    
    fetch(imgUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then(blob => {
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            link.style.display = 'none';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            setTimeout(() => {
                URL.revokeObjectURL(blobUrl);
            }, 100);
            
            showToast(`✅ Downloaded: ${filename}`, 'success');
        })
        .catch(error => {
            console.error('Download failed:', error);
            showError('Download failed. Please try again.');
        });
}

// Remove from history
function removeFromHistory(index) {
    downloadHistory.splice(index, 1);
    saveHistory();
    updateHistoryDisplay();
    showToast('Removed from history', 'success');
}

// Auto-paste from clipboard
document.getElementById('urlInput').addEventListener('focus', function() {
    if (navigator.clipboard) {
        navigator.clipboard.readText().then(text => {
            if (text.includes('youtube.com') || text.includes('youtu.be')) {
                if (!this.value) {
                    this.value = text;
                    showToast('URL automatically detected!', 'success');
                }
            }
        }).catch(() => {});
    }
});

// Enter key to download
document.getElementById('urlInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        downloadThumbnail();
    }
});

// Additional protection - Disable console access
Object.defineProperty(window, 'console', {
    value: {
        log: function() {},
        warn: function() {},
        error: function() {},
        info: function() {},
        debug: function() {}
    },
    writable: false,
    configurable: false
});

// Disable view source
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        return false;
    }
});

// Final protection message
console.log('%c🔒 PROTECTED CONTENT 🔒', 'color: #ff0000; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);');
console.log('%cThis application is protected by Ravi Ranjan Kashyap', 'color: #ff0000; font-size: 16px;');
console.log('%cUnauthorized copying is prohibited', 'color: #ff0000; font-size: 14px;'); 