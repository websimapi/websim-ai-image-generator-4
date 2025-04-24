const promptInput = document.getElementById('promptInput');
const generateBtn = document.getElementById('generateBtn');
const loadingIndicator = document.getElementById('loadingIndicator');
const imageContainer = document.getElementById('imageContainer');
const generatedImage = document.getElementById('generatedImage');
const downloadBtn = document.getElementById('downloadBtn');

let currentImageUrl = null; // To store the URL for download

generateBtn.addEventListener('click', async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) {
        alert('Please enter a prompt.');
        return;
    }

    // --- UI Updates: Start loading ---
    generateBtn.disabled = true;
    loadingIndicator.style.display = 'block';
    generatedImage.style.display = 'none'; // Hide previous image
    imageContainer.style.minHeight = '200px'; // Reset min height
    downloadBtn.style.display = 'none';
    currentImageUrl = null;

    try {
        const result = await websim.imageGen({ prompt: prompt });
        currentImageUrl = result.url; // Store the URL

        // --- UI Updates: Display image ---
        generatedImage.onload = () => { // Wait for image to load before showing/resizing
            loadingIndicator.style.display = 'none';
            generatedImage.style.display = 'block';
            imageContainer.style.minHeight = 'auto'; // Adjust container height to image
            downloadBtn.style.display = 'block';
            generateBtn.disabled = false;
        };
        generatedImage.onerror = () => { // Handle image loading errors
             loadingIndicator.style.display = 'none';
             alert('Failed to load the generated image.');
             generateBtn.disabled = false;
        };
        generatedImage.src = currentImageUrl; // Set the src AFTER defining onload/onerror


    } catch (error) {
        console.error('Image generation failed:', error);
        alert('Image generation failed. Please try again.');
        // --- UI Updates: Finish loading (on error) ---
        loadingIndicator.style.display = 'none';
        generateBtn.disabled = false;
    }
});

downloadBtn.addEventListener('click', () => {
    if (!currentImageUrl) return;

    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = currentImageUrl;

    // Suggest a filename (optional)
    // Extracting a decent filename might be tricky, use a generic one
    const filename = `generated-image-${Date.now()}.png`; // Adding timestamp for uniqueness
    link.download = filename;

    // Append to the document, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

