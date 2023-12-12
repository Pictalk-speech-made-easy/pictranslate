
// Function to check the current browser storage quota
export function getStorageQuota(): Promise<StorageEstimate["quota"]> {
  return new Promise((resolve, reject) => {
    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then((estimate) => {
        if (estimate.quota) {
          resolve(estimate.quota);
        } else {
          reject(new Error('Unable to retrieve storage quota'));
        }
      }).catch((error) => {
        reject(error);
      });
    } else {
      reject(new Error('Storage estimate API not supported'));
    }
  });
}

// Function to get the space still left in the browser storage
export function getStorageSpaceLeft(): Promise<number> {
  return new Promise((resolve, reject) => {
    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then((estimate) => {
        if (estimate.usage && estimate.quota) {
          const spaceLeft = estimate.quota - estimate.usage;
          resolve(spaceLeft);
        } else {
          reject(new Error('Unable to retrieve storage space left'));
        }
      }).catch((error) => {
        reject(error);
      });
    } else {
      reject(new Error('Storage estimate API not supported'));
    }
  });
}
