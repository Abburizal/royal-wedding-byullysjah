#!/usr/bin/env node

/**
 * Performance Testing Script
 * Royal Wedding by Ully Sjah
 * 
 * This script helps monitor and test website performance
 */

const fs = require('fs');
const path = require('path');

class PerformanceMonitor {
    constructor() {
        this.results = {
            timestamp: new Date().toISOString(),
            assets: {
                css: {},
                js: {},
                images: {}
            },
            recommendations: []
        };
    }

    // Analyze CSS files
    analyzeCSSFiles() {
        const cssPath = path.join(__dirname, 'public/assets/css');
        
        if (fs.existsSync(cssPath)) {
            const files = fs.readdirSync(cssPath).filter(file => file.endsWith('.css'));
            
            files.forEach(file => {
                const filePath = path.join(cssPath, file);
                const stats = fs.statSync(filePath);
                const sizeKB = (stats.size / 1024).toFixed(2);
                
                this.results.assets.css[file] = {
                    size: `${sizeKB} KB`,
                    isMinified: file.includes('.min') || this.isMinified(filePath),
                    status: sizeKB < 100 ? 'Good' : sizeKB < 200 ? 'Warning' : 'Critical'
                };
                
                if (sizeKB > 100) {
                    this.results.recommendations.push(`CSS file ${file} is ${sizeKB}KB - consider further optimization`);
                }
            });
        }
    }

    // Analyze JavaScript files
    analyzeJSFiles() {
        const jsPath = path.join(__dirname, 'public/js');
        
        if (fs.existsSync(jsPath)) {
            const files = fs.readdirSync(jsPath).filter(file => file.endsWith('.js'));
            
            files.forEach(file => {
                const filePath = path.join(jsPath, file);
                const stats = fs.statSync(filePath);
                const sizeKB = (stats.size / 1024).toFixed(2);
                
                this.results.assets.js[file] = {
                    size: `${sizeKB} KB`,
                    isMinified: file.includes('.min') || this.isMinified(filePath),
                    status: sizeKB < 50 ? 'Good' : sizeKB < 100 ? 'Warning' : 'Critical'
                };
                
                if (sizeKB > 50 && !file.includes('.min')) {
                    this.results.recommendations.push(`JavaScript file ${file} is ${sizeKB}KB - run minification`);
                }
            });
        }
    }

    // Check for image optimization
    analyzeImages() {
        const imagePath = path.join(__dirname, 'public/assets/images');
        
        if (fs.existsSync(imagePath)) {
            this.scanImagesRecursively(imagePath);
        } else {
            this.results.assets.images.status = 'No images directory found';
            this.results.recommendations.push('Create images directory structure: /public/assets/images/');
        }
    }

    scanImagesRecursively(dir) {
        const files = fs.readdirSync(dir);
        let totalImages = 0;
        let webpImages = 0;
        let largeImages = 0;

        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stats = fs.statSync(filePath);

            if (stats.isDirectory()) {
                this.scanImagesRecursively(filePath);
            } else if (this.isImageFile(file)) {
                totalImages++;
                const sizeKB = (stats.size / 1024).toFixed(2);

                if (file.endsWith('.webp')) {
                    webpImages++;
                }

                if (stats.size > 500000) { // 500KB
                    largeImages++;
                    this.results.recommendations.push(`Image ${file} is ${sizeKB}KB - consider compression`);
                }
            }
        });

        this.results.assets.images = {
            total: totalImages,
            webpCount: webpImages,
            webpPercentage: totalImages > 0 ? ((webpImages / totalImages) * 100).toFixed(1) + '%' : '0%',
            largeImages: largeImages,
            status: largeImages === 0 ? 'Good' : 'Needs Optimization'
        };

        if (webpImages === 0 && totalImages > 0) {
            this.results.recommendations.push('Consider converting images to WebP format for better compression');
        }
    }

    // Check if file is minified (basic check)
    isMinified(filePath) {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        
        // If file has very few lines relative to its size, it's likely minified
        const avgCharsPerLine = content.length / lines.length;
        return avgCharsPerLine > 100;
    }

    // Check if file is an image
    isImageFile(filename) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
        return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
    }

    // Check build configuration
    checkBuildConfig() {
        const packageJsonPath = path.join(__dirname, 'package.json');
        
        if (fs.existsSync(packageJsonPath)) {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            const scripts = packageJson.scripts || {};
            
            // Check for build scripts
            if (!scripts.build) {
                this.results.recommendations.push('Add build script to package.json');
            }
            
            if (!scripts['build:css']) {
                this.results.recommendations.push('Add CSS build script with minification');
            }
            
            if (!scripts['build:js']) {
                this.results.recommendations.push('Add JavaScript build script with minification');
            }

            // Check for performance-related dependencies
            const devDeps = packageJson.devDependencies || {};
            if (!devDeps.terser) {
                this.results.recommendations.push('Install Terser for JavaScript minification: npm install --save-dev terser');
            }
        }
    }

    // Run all analyses
    analyze() {
        console.log('🔍 Analyzing website performance...\n');
        
        this.analyzeCSSFiles();
        this.analyzeJSFiles();
        this.analyzeImages();
        this.checkBuildConfig();
        
        this.generateReport();
    }

    // Generate performance report
    generateReport() {
        console.log('📊 PERFORMANCE ANALYSIS REPORT');
        console.log('=====================================\n');
        
        // CSS Analysis
        console.log('📄 CSS FILES:');
        Object.entries(this.results.assets.css).forEach(([file, data]) => {
            const icon = data.status === 'Good' ? '✅' : data.status === 'Warning' ? '⚠️' : '❌';
            console.log(`${icon} ${file}: ${data.size} (${data.isMinified ? 'Minified' : 'Not Minified'})`);
        });
        console.log('');
        
        // JavaScript Analysis
        console.log('📜 JAVASCRIPT FILES:');
        Object.entries(this.results.assets.js).forEach(([file, data]) => {
            const icon = data.status === 'Good' ? '✅' : data.status === 'Warning' ? '⚠️' : '❌';
            console.log(`${icon} ${file}: ${data.size} (${data.isMinified ? 'Minified' : 'Not Minified'})`);
        });
        console.log('');
        
        // Images Analysis
        console.log('🖼️ IMAGES:');
        if (this.results.assets.images.total !== undefined) {
            console.log(`📊 Total Images: ${this.results.assets.images.total}`);
            console.log(`🗜️ WebP Images: ${this.results.assets.images.webpCount} (${this.results.assets.images.webpPercentage})`);
            console.log(`⚠️ Large Images: ${this.results.assets.images.largeImages}`);
            console.log(`📈 Status: ${this.results.assets.images.status}`);
        } else {
            console.log('ℹ️ No images found or directory doesn\'t exist');
        }
        console.log('');
        
        // Recommendations
        if (this.results.recommendations.length > 0) {
            console.log('💡 RECOMMENDATIONS:');
            this.results.recommendations.forEach((rec, index) => {
                console.log(`${index + 1}. ${rec}`);
            });
        } else {
            console.log('🎉 No performance issues found! Your website is well optimized.');
        }
        
        console.log('\n=====================================');
        console.log('Analysis completed at:', this.results.timestamp);
        
        // Save detailed report
        this.saveDetailedReport();
    }

    // Save detailed JSON report
    saveDetailedReport() {
        const reportPath = path.join(__dirname, 'performance-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
        console.log(`\n📋 Detailed report saved to: ${reportPath}`);
    }
}

// Run the performance analysis
if (require.main === module) {
    const monitor = new PerformanceMonitor();
    monitor.analyze();
}

module.exports = PerformanceMonitor;