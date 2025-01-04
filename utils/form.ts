export const downloadPdf = (url: string, documentId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = `encomenda-${documentId}.pdf`;

      // Add event listeners to track success/failure
      link.addEventListener('click', () => {
        setTimeout(resolve, 1000); // Resolve after a short delay
      });

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      reject(error);
    }
  });
};
