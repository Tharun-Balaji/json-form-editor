import { useCallback, useState } from "react";

// Custom hook for copying data
export const useCopyData = () => {
  const [copied, setCopied] = useState(false);

  const copyData = useCallback((data: any) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2))
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy data:', err);
      });
  }, []);

  return { copyData, copied };
};

// Custom hook for downloading data
export const useDownloadData = () => {
  const [downloaded, setDownloaded] = useState(false);

  const downloadData = useCallback((data: any, fileName?: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || `form_submission_${new Date().toISOString().replace(/:/g, '-')}.json`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  }, []);

  return { downloadData, downloaded };
};
