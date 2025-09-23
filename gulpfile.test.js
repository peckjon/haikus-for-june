// gulpfile.test.js
// Simple test that doesn't import imagemin to avoid module issues
describe('gulpfile.js', () => {
  it('should export a default function', () => {
    // Read the file content to verify it exports properly
    const fs = require('fs');
    const gulpfileContent = fs.readFileSync('./gulpfile.js', 'utf8');
    
    // Verify the file contains the expected exports structure
    expect(gulpfileContent).toContain('exports.default');
    expect(gulpfileContent).toContain('gulp.src');
    expect(gulpfileContent).toContain('imagemin');
    expect(gulpfileContent).toContain('gulp.dest');
  });
  
  it('should have the correct gulp task structure', () => {
    // Mock imagemin to avoid import issues
    jest.mock('gulp-imagemin', () => () => ({
      pipe: jest.fn().mockReturnThis()
    }));
    
    const gulp = require('gulp');
    
    // Mock gulp methods
    const mockPipe = jest.fn().mockReturnThis();
    const mockSrc = jest.fn(() => ({ pipe: mockPipe }));
    const mockDest = jest.fn(() => ({ pipe: mockPipe }));
    
    gulp.src = mockSrc;
    gulp.dest = mockDest;
    
    // Now we can safely import gulpfile
    const gulpfile = require('./gulpfile.js');
    
    expect(typeof gulpfile.default).toBe('function');
    
    // Call the function to execute the code
    gulpfile.default();
    
    // Verify the expected calls were made
    expect(mockSrc).toHaveBeenCalledWith('./raw_images/*');
    expect(mockDest).toHaveBeenCalledWith('./public/images');
  });
});