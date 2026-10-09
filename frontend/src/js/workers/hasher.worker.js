import CryptoJS from 'crypto-js';

// Listen for the postMessage coming from the screen's main thread.
self.addEventListener('message', (event) => {
    const { arrayBuffer, algorithm } = event.data;

    try {
        // Native conversion to crypto-js WordArray
        const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
        let hash = '';

        // Map the 4 encryption schemes
        if (algorithm === 'MD5') {
            hash = CryptoJS.MD5(wordArray).toString(CryptoJS.enc.Hex);
        } else if (algorithm === 'SHA1') {
            hash = CryptoJS.SHA1(wordArray).toString(CryptoJS.enc.Hex);
        } else if (algorithm === 'SHA256') {
            hash = CryptoJS.SHA256(wordArray).toString(CryptoJS.enc.Hex);
        } else if (algorithm === 'SHA512') {
            hash = CryptoJS.SHA512(wordArray).toString(CryptoJS.enc.Hex);
        }

        // Output the hexadecimal hash to the screen as a clean text string
        self.postMessage({ status: 'success', hash });
    } catch (error) {
        self.postMessage({ status: 'error', error: error.message });
    }
});
