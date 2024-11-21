

import { useCallback, useState } from "react";

// Custom hook for copying data
export const useCopyData = () => {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  const copyData = useCallback((data: any) => {
    // Reset previous errors
    setCopyError(null);

    // Validate input
    if (!data) {
      setCopyError("No data to copy");
      return;
    }

    // Ensure navigator.clipboard exists
    if (!navigator.clipboard) {
      setCopyError("Clipboard API not supported");
      console.error("Clipboard API is not available");
      return;
    }

    // Safely stringify data
    let stringData: string;
    try {
      stringData = JSON.stringify(data, null, 2);
    } catch (stringifyError) {
      setCopyError("Failed to stringify data");
      console.error("Stringify error:", stringifyError);
      return;
    }

    // Attempt to copy
    navigator.clipboard.writeText(stringData)
      .then(() => {
        setCopied(true);
        // Reset copied state after 2 seconds
        const timeoutId = setTimeout(() => {
          setCopied(false);
          clearTimeout(timeoutId);
        }, 2000);
      })
      .catch((err) => {
        setCopyError("Failed to copy to clipboard");
        console.error('Clipboard copy error:', err);
      });
  }, []);

  return { 
    copyData, 
    copied, 
    copyError 
  };
};

// Custom hook for downloading data
export const useDownloadData = () => {
  const [downloaded, setDownloaded] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const downloadData = useCallback((data: any, fileName?: string) => {
    // Reset previous errors
    setDownloadError(null);

    // Validate input
    if (!data) {
      setDownloadError("No data to download");
      return;
    }

    // Validate file name
    const safeFileName = fileName || 
      `form_submission_${new Date().toISOString().replace(/:/g, '-')}.json`;

    try {
      // Safely stringify data
      const jsonData = JSON.stringify(data, null, 2);
      
      // Create blob
      const blob = new Blob([jsonData], { type: 'application/json' });
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.href = url;
      link.download = safeFileName;
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Set downloaded state
      setDownloaded(true);
      
      // Reset downloaded state after 2 seconds
      const timeoutId = setTimeout(() => {
        setDownloaded(false);
        clearTimeout(timeoutId);
      }, 2000);

    } catch (error) {
      setDownloadError("Failed to download data");
      console.error('Download error:', error);
    }
  }, []);

  return { 
    downloadData, 
    downloaded, 
    downloadError 
  };
};
