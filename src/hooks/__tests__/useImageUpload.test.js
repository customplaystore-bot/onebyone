import { renderHook, act } from '@testing-library/react';
import { useImageUpload } from '../useImageUpload';
import * as fileHelpers from '../../utils/fileHelpers';
import { describe, it, expect, vi } from 'vitest';

describe('useImageUpload', () => {
  it('should initialize with null image and no error', () => {
    const { result } = renderHook(() => useImageUpload());
    expect(result.current.image).toBeNull();
    expect(result.current.isUploading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle image change via target.files', async () => {
    const { result } = renderHook(() => useImageUpload());
    const file = new File(['image content'], 'test.png', { type: 'image/png' });
    const event = { target: { files: [file] }, preventDefault: vi.fn() };

    vi.spyOn(fileHelpers, 'readFileAsDataURL').mockResolvedValue('data:image/png;base64,mock-data');

    await act(async () => {
      await result.current.handleImageChange(event);
    });

    expect(result.current.image).toBe('data:image/png;base64,mock-data');
    expect(result.current.isUploading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle image change via dataTransfer.files (drag & drop)', async () => {
    const { result } = renderHook(() => useImageUpload());
    const file = new File(['image content'], 'test.png', { type: 'image/png' });
    const event = { dataTransfer: { files: [file] }, preventDefault: vi.fn() };

    vi.spyOn(fileHelpers, 'readFileAsDataURL').mockResolvedValue('data:image/png;base64,mock-data');

    await act(async () => {
      await result.current.handleImageChange(event);
    });

    expect(result.current.image).toBe('data:image/png;base64,mock-data');
    expect(result.current.isUploading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle file reading error', async () => {
    const { result } = renderHook(() => useImageUpload());
    const file = new File(['image content'], 'test.png', { type: 'image/png' });
    const event = { target: { files: [file] }, preventDefault: vi.fn() };

    vi.spyOn(fileHelpers, 'readFileAsDataURL').mockRejectedValue(new Error('Read error'));

    await act(async () => {
      await result.current.handleImageChange(event);
    });

    expect(result.current.image).toBeNull();
    expect(result.current.error).toBe('Failed to read image file.');
    expect(result.current.isUploading).toBe(false);
  });

  it('should reset image', async () => {
    const { result } = renderHook(() => useImageUpload());
    
    // First, set an image
    const file = new File(['image content'], 'test.png', { type: 'image/png' });
    const event = { target: { files: [file] }, preventDefault: vi.fn() };
    vi.spyOn(fileHelpers, 'readFileAsDataURL').mockResolvedValue('data:image/png;base64,mock-data');
    
    await act(async () => {
      await result.current.handleImageChange(event);
    });
    
    expect(result.current.image).toBe('data:image/png;base64,mock-data');

    // Then, reset it
    act(() => {
      result.current.resetImage();
    });

    expect(result.current.image).toBeNull();
    expect(result.current.error).toBeNull();
  });
});
