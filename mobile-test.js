#!/usr/bin/env node

/**
 * Mobile Testing Script
 * Royal Wedding by Ully Sjah
 * 
 * This script helps test mobile responsiveness and performance
 */

const fs = require('fs');
const path = require('path');

class MobileTestRunner {
    constructor() {
        this.testResults = {
            timestamp: new Date().toISOString(),
            mobileCSSAnalysis: {},
            viewportConfiguration: {},
            touchTargets: {},
            mobilePerformance: {},
            recommendations: []
        };
    }

    // Analyze mobile-specific CSS
    analyzeMobileCSSClasses() {
        const cssPath = path.join(__dirname, 'src/css/input.css');
        
        if (fs.existsSync(cssPath)) {
            const cssContent = fs.readFileSync(cssPath, 'utf8');
            
            // Count responsive breakpoint classes
            const breakpointMatches = {
                'sm:': (cssContent.match(/sm:/g) || []).length,
                'md:': (cssContent.match(/md:/g) || []).length,
                'lg:': (cssContent.match(/lg:/g) || []).length,
                'xl:': (cssContent.match(/xl:/g) || []).length,
                '2xl:': (cssContent.match(/2xl:/g) || []).length
            };

            // Check for mobile-active classes
            const mobileActiveClasses = (cssContent.match(/body\.mobile-active/g) || []).length;
            
            // Check for touch-friendly button sizing
            const touchFriendlyButtons = cssContent.includes('min-height: 48px') || 
                                       cssContent.includes('min-height: 56px');

            this.testResults.mobileCSSAnalysis = {
                responsiveBreakpoints: breakpointMatches,
                mobileActiveClasses: mobileActiveClasses,
                hasTouchFriendlyButtons: touchFriendlyButtons,
                status: mobileActiveClasses > 0 ? 'Good' : 'Needs Improvement'
            };

            if (mobileActiveClasses === 0) {
                this.testResults.recommendations.push('Consider adding mobile-specific CSS classes for better mobile experience');
            }

            if (!touchFriendlyButtons) {
                this.testResults.recommendations.push('Add touch-friendly button sizing (minimum 48px height)');
            }
        }
    }

    // Check viewport configuration
    checkViewportConfiguration() {
        const layoutPath = path.join(__dirname, 'src/view/layouts/app.ejs');
        
        if (fs.existsSync(layoutPath)) {
            const layoutContent = fs.readFileSync(layoutPath, 'utf8');
            
            const hasViewportMeta = layoutContent.includes('name="viewport"');
            const hasCorrectViewport = layoutContent.includes('width=device-width, initial-scale=1.0');
            
            this.testResults.viewportConfiguration = {
                hasViewportMeta: hasViewportMeta,
                hasCorrectViewport: hasCorrectViewport,
                status: hasCorrectViewport ? 'Good' : 'Critical'
            };

            if (!hasCorrectViewport) {
                this.testResults.recommendations.push('Add proper viewport meta tag for mobile responsiveness');
            }
        }
    }

    // Analyze JavaScript mobile handling
    analyzeMobileJavaScript() {
        const jsPath = path.join(__dirname, 'public/js/main.js');
        
        if (fs.existsSync(jsPath)) {
            const jsContent = fs.readFileSync(jsPath, 'utf8');
            
            const hasMobileController = jsContent.includes('MobileController');
            const hasTouch = jsContent.includes('touch') || jsContent.includes('Touch');
            const hasOrientationChange = jsContent.includes('orientationchange');
            const hasViewportListener = jsContent.includes('resize');

            this.testResults.mobileJavaScript = {
                hasMobileController: hasMobileController,
                hasTouchHandling: hasTouch,
                hasOrientationChange: hasOrientationChange,
                hasViewportListener: hasViewportListener,
                status: hasMobileController ? 'Good' : 'Needs Improvement'
            };

            if (!hasMobileController) {
                this.testResults.recommendations.push('Consider adding mobile-specific JavaScript controller');
            }
        }
    }

    // Check image optimization for mobile
    checkImageOptimization() {
        const imagesPath = path.join(__dirname, 'public/assets/images');
        
        if (fs.existsSync(imagesPath)) {
            const allImages = this.getAllImages(imagesPath);
            const webpImages = allImages.filter(img => img.endsWith('.webp'));
            const jpgImages = allImages.filter(img => img.endsWith('.jpg') || img.endsWith('.jpeg'));
            
            this.testResults.imageOptimization = {
                totalImages: allImages.length,
                webpImages: webpImages.length,
                jpgImages: jpgImages.length,
                webpPercentage: allImages.length > 0 ? Math.round((webpImages.length / allImages.length) * 100) : 0,
                status: webpImages.length > 0 ? 'Good' : 'Needs Improvement'
            };

            if (webpImages.length === 0 && jpgImages.length > 0) {
                this.testResults.recommendations.push('Consider converting images to WebP format for better mobile performance');
            }
        }
    }

    // Helper function to get all images recursively
    getAllImages(dir) {
        let images = [];
        const items = fs.readdirSync(dir);
        
        items.forEach(item => {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                images = images.concat(this.getAllImages(fullPath));
            } else if (/\.(jpg|jpeg|png|gif|webp|avif)$/i.test(item)) {
                images.push(item);
            }
        });
        
        return images;
    }

    // Run all mobile tests
    async runAllTests() {
        console.log('🔍 Running mobile responsiveness tests...\n');

        this.analyzeMobileCSSClasses();
        this.checkViewportConfiguration();
        this.analyzeMobileJavaScript();
        this.checkImageOptimization();

        this.generateReport();
        this.saveReport();
    }

    // Generate console report
    generateReport() {
        console.log('📱 MOBILE TESTING REPORT');
        console.log('====================================\n');

        // CSS Analysis
        console.log('🎨 CSS RESPONSIVENESS:');
        console.log(`   Status: ${this.testResults.mobileCSSAnalysis.status || 'Not Analyzed'}`);
        if (this.testResults.mobileCSSAnalysis.responsiveBreakpoints) {
            Object.entries(this.testResults.mobileCSSAnalysis.responsiveBreakpoints).forEach(([breakpoint, count]) => {
                console.log(`   ${breakpoint} classes: ${count}`);
            });
        }
        console.log(`   Mobile-active classes: ${this.testResults.mobileCSSAnalysis.mobileActiveClasses || 0}`);
        console.log(`   Touch-friendly buttons: ${this.testResults.mobileCSSAnalysis.hasTouchFriendlyButtons ? '✅' : '❌'}\n`);

        // Viewport Configuration
        console.log('📐 VIEWPORT CONFIGURATION:');
        console.log(`   Status: ${this.testResults.viewportConfiguration.status || 'Not Analyzed'}`);
        console.log(`   Has viewport meta: ${this.testResults.viewportConfiguration.hasViewportMeta ? '✅' : '❌'}`);
        console.log(`   Correct viewport: ${this.testResults.viewportConfiguration.hasCorrectViewport ? '✅' : '❌'}\n`);

        // JavaScript Mobile Handling
        if (this.testResults.mobileJavaScript) {
            console.log('⚡ MOBILE JAVASCRIPT:');
            console.log(`   Status: ${this.testResults.mobileJavaScript.status}`);
            console.log(`   Mobile Controller: ${this.testResults.mobileJavaScript.hasMobileController ? '✅' : '❌'}`);
            console.log(`   Touch Handling: ${this.testResults.mobileJavaScript.hasTouchHandling ? '✅' : '❌'}`);
            console.log(`   Orientation Change: ${this.testResults.mobileJavaScript.hasOrientationChange ? '✅' : '❌'}\n`);
        }

        // Image Optimization
        if (this.testResults.imageOptimization) {
            console.log('🖼️ IMAGE OPTIMIZATION:');
            console.log(`   Status: ${this.testResults.imageOptimization.status}`);
            console.log(`   Total Images: ${this.testResults.imageOptimization.totalImages}`);
            console.log(`   WebP Images: ${this.testResults.imageOptimization.webpImages}`);
            console.log(`   WebP Percentage: ${this.testResults.imageOptimization.webpPercentage}%\n`);
        }

        // Recommendations
        if (this.testResults.recommendations.length > 0) {
            console.log('💡 RECOMMENDATIONS:');
            this.testResults.recommendations.forEach((rec, index) => {
                console.log(`   ${index + 1}. ${rec}`);
            });
        } else {
            console.log('🎉 No mobile improvements needed! Your website is mobile-ready.');
        }

        console.log('\n====================================');
        console.log(`Analysis completed at: ${this.testResults.timestamp}`);
    }

    // Save detailed report
    saveReport() {
        const reportPath = path.join(__dirname, 'mobile-test-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(this.testResults, null, 2));
        console.log(`\n📋 Detailed report saved to: ${reportPath}`);
    }
}

// Run the mobile tests
if (require.main === module) {
    const tester = new MobileTestRunner();
    tester.runAllTests();
}

module.exports = MobileTestRunner;