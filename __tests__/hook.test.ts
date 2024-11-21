import { renderHook, act } from '@testing-library/react-hooks';
import { useCopyData, useDownloadData } from '../src/hooks/FormSubmission';

describe('Form Submission Hooks', () => {
  // Mock clipboard and URL methods
  const originalClipboard = { ...navigator.clipboard };
  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock clipboard
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: jest.fn(),
      },
      configurable: true,
    });

    // Mock URL methods
    URL.createObjectURL = jest.fn(() => 'mock-blob-url');
    URL.revokeObjectURL = jest.fn();
  });

  afterEach(() => {
    // Restore original implementations
    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
    });
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
  });

  describe('useCopyData Hook', () => {
    it('should successfully copy data to clipboard', async () => {
      // Arrange
      const testData = { name: 'Test Project', value: 123 };
      
      // Mock successful clipboard write
      (navigator.clipboard.writeText as jest.Mock).mockResolvedValue(undefined);

      // Act
      const { result, waitForNextUpdate } = renderHook(() => useCopyData());

      // Trigger copy
      await act(async () => {
        result.current.copyData(testData);
      });

      // Assert
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        JSON.stringify(testData, null, 2)
      );
      expect(result.current.copied).toBe(true);
    });

    it('should handle clipboard copy error', async () => {
      // Arrange
      const testData = { name: 'Test Project', value: 123 };
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Mock failed clipboard write
      (navigator.clipboard.writeText as jest.Mock).mockRejectedValue(new Error('Copy failed'));

      // Act
      const { result, waitForNextUpdate } = renderHook(() => useCopyData());

      // Trigger copy
      await act(async () => {
        result.current.copyData(testData);
      });

      // Assert
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        JSON.stringify(testData, null, 2)
      );
      expect(result.current.copyError).toBe('Failed to copy to clipboard');
      expect(consoleErrorSpy).toHaveBeenCalled();

      // Cleanup
      consoleErrorSpy.mockRestore();
    });

    it('should reset copied state after timeout', async () => {
      // Arrange
      jest.useFakeTimers();
      const testData = { name: 'Test Project', value: 123 };
      (navigator.clipboard.writeText as jest.Mock).mockResolvedValue(undefined);

      // Act
      const { result, waitForNextUpdate } = renderHook(() => useCopyData());

      // Trigger copy
      await act(async () => {
        result.current.copyData(testData);
      });

      // Assert initial state
      expect(result.current.copied).toBe(true);

      // Fast-forward timers
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      // Assert state reset
      expect(result.current.copied).toBe(false);

      // Cleanup
      jest.useRealTimers();
    });
  });

  describe('useDownloadData Hook', () => {
    it('should successfully download data', () => {
      // Arrange
      const testData = { name: 'Test Project', value: 123 };
      const mockCreateElement = jest.spyOn(document, 'createElement');
      const mockAppendChild = jest.spyOn(document.body, 'appendChild');
      const mockRemoveChild = jest.spyOn(document.body, 'removeChild');

      // Act
      const { result } = renderHook(() => useDownloadData());

      // Trigger download
      act(() => {
        result.current.downloadData(testData, 'test-download.json');
      });

      // Assert
      expect(URL.createObjectURL).toHaveBeenCalledWith(
        expect.any(Blob)
      );
      expect(mockCreateElement).toHaveBeenCalledWith('a');
      expect(mockAppendChild).toHaveBeenCalled();
      expect(mockRemoveChild).toHaveBeenCalled();
      expect(result.current.downloaded).toBe(true);

      // Cleanup
      mockCreateElement.mockRestore();
      mockAppendChild.mockRestore();
      mockRemoveChild.mockRestore();
    });

    it('should use default filename when not provided', () => {
      // Arrange
      const testData = { name: 'Test Project', value: 123 };
      const mockCreateElement = jest.spyOn(document, 'createElement');

      // Act
      const { result } = renderHook(() => useDownloadData());

      // Trigger download
      act(() => {
        result.current.downloadData(testData);
      });

      // Assert
      const downloadLink = mockCreateElement.mock.results[0].value;
      expect(downloadLink.download).toMatch(/^form_submission_.*\.json$/);

      // Cleanup
      mockCreateElement.mockRestore();
    });

    it('should reset downloaded state after timeout', () => {
      // Arrange
      jest.useFakeTimers();
      const testData = { name: 'Test Project', value: 123 };

      // Act
      const { result } = renderHook(() => useDownloadData());

      // Trigger download
      act(() => {
        result.current.downloadData(testData);
      });

      // Assert initial state
      expect(result.current.downloaded).toBe(true);

      // Fast-forward timers
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      // Assert state reset
      expect(result.current.downloaded).toBe(false);

      // Cleanup
      jest.useRealTimers();
    });
  });
});