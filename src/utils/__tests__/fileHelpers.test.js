import { describe, it, expect, vi } from 'vitest';
import { readFileAsDataURL, downloadDataURL } from '../fileHelpers';

describe('fileHelpers', () => {
  describe('readFileAsDataURL', () => {
    it('should read a file and return a Data URL', async () => {
      const file = new File(['hello'], 'test.txt', { type: 'text/plain' });
      const result = await readFileAsDataURL(file);
      expect(result).toMatch(/^data:text\/plain;base64,/);
    });

    it('should reject if there is an error reading the file', async () => {
      const file = { 
        // Mocking a file that fails
      };
      // Since File is hard to fail, we can mock FileReader
      const mockFileReader = {
        readAsDataURL: vi.fn(function() {
          this.onerror(new Error('Read error'));
        }),
      };
      vi.stubGlobal('FileReader', vi.fn(() => mockFileReader));

      await expect(readFileAsDataURL(file)).rejects.toThrow();
      
      vi.unstubAllGlobals();
    });
  });

  describe('downloadDataURL', () => {
    it('should create an anchor element and click it', () => {
      const createElementSpy = vi.spyOn(document, 'createElement');
      const clickSpy = vi.fn();
      
      createElementSpy.mockReturnValue({
        set href(val) {},
        set download(val) {},
        click: clickSpy,
      });

      downloadDataURL('data:image/png;base64,123', 'test.png');

      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(clickSpy).toHaveBeenCalled();
      
      createElementSpy.mockRestore();
    });
  });
});
