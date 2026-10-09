export default class HasherWidget {
    constructor(container) {
        this.container = container;
        this.dragZone = container.querySelector('#hasher-drag-zone');
        this.hiddenInput = container.querySelector('#hasher-hidden-file-input');
        this.algoSelector = container.querySelector('#hasher-algorithm-selector');
        this.outputDisplay = container.querySelector('#hasher-display-output');

        this.worker = null;
        this.currentFileBuffer = null; // Will store the buffer in RAM for rapid recalculations.
    }

    init() {
        // Web Worker Initialization
        this.worker = new Worker(new URL('./workers/hasher.worker.js', import.meta.url));

        this.bindEvents();
    }

    bindEvents() {
        // CPU secondary thread response channel listener
        this.worker.addEventListener('message', (event) => {
            const { status, hash } = event.data;
            if (status === 'success') {
                this.outputDisplay.innerText = hash; // Print the legitimate hexadecimal hash on the screen
            } else {
                this.outputDisplay.innerText = 'Error calculating hash.';
            }
        });

        // Click to open the traditional file selector of the Windows Explorer
        this.dragZone.addEventListener('click', () => this.hiddenInput.click());
        this.hiddenInput.addEventListener('change', (e) => {
            const file = e.target.files && e.target.files[0];
            if (file) this.processFileReading(file);
        });

        // Mechanical drag-and-drop events
        this.dragZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.dragZone.classList.add('dragover');
        });

        this.dragZone.addEventListener('dragleave', () => {
            this.dragZone.classList.remove('dragover');
        });

        this.dragZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.dragZone.classList.remove('dragover');
            const file = e.dataTransfer.files && e.dataTransfer.files[0];
            if (file) this.processFileReading(file);
        });

        // Automatic recalculation when changing the algorithm in the dropdown list, if a file is already loaded in RAM
        this.algoSelector.addEventListener('change', () => {
            if (this.currentFileBuffer) {
                this.triggerWorkerCalculation(this.currentFileBuffer);
            }
        });
    }

    processFileReading(file) {
        this.outputDisplay.innerText = 'Reading file and calculating hash...';
        const reader = new FileReader();

        reader.addEventListener('load', (e) => {
            this.currentFileBuffer = e.target.result;
            this.triggerWorkerCalculation(this.currentFileBuffer);
        });

        reader.readAsArrayBuffer(file); // Transform the file into a pure binary ArrayBuffer.
    }

    triggerWorkerCalculation(arrayBuffer) {
        const selectedAlgo = this.algoSelector.value;

        // PARALLEL DATA TRAVEL: We send the raw bytes and the algorithm to the Web Worker
        this.worker.postMessage({
            arrayBuffer,
            algorithm: selectedAlgo
        });
    }
}
