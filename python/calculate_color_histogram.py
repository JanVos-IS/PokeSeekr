import cv2
import numpy as np
import matplotlib.pyplot as plt
import argparse
from scipy.ndimage import gaussian_filter1d

def calculate_color_histogram(image_path, bins=128):
    """
    Calculate color histogram for an image with specified number of bins.
    
    Args:
        image_path (str): Path to the input image
        bins (int): Number of bins for the histogram (default: 128)
        
    Returns:
        dict: Dictionary containing histograms for each channel and the combined histogram
    """
    # Read the image
    image = cv2.imread(image_path)
    
    if image is None:
        raise ValueError(f"Could not read image at: {image_path}")
    
    # Convert BGR to RGB (OpenCV loads images in BGR)
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    
    # Calculate histograms for each channel
    hist_r = cv2.calcHist([image_rgb], [0], None, [bins], [0, 256])
    hist_g = cv2.calcHist([image_rgb], [1], None, [bins], [0, 256])
    hist_b = cv2.calcHist([image_rgb], [2], None, [bins], [0, 256])
    
    # Normalize histograms
    hist_r = cv2.normalize(hist_r, hist_r, 0, 1, cv2.NORM_MINMAX)
    hist_g = cv2.normalize(hist_g, hist_g, 0, 1, cv2.NORM_MINMAX)
    hist_b = cv2.normalize(hist_b, hist_b, 0, 1, cv2.NORM_MINMAX)
    
    # Combine histograms into a single feature vector
    combined_hist = np.concatenate([hist_r.flatten(), hist_g.flatten(), hist_b.flatten()])
    
    return {
        'red': hist_r.flatten(),
        'green': hist_g.flatten(),
        'blue': hist_b.flatten(),
        'combined': combined_hist
    }

def rgb_to_histogram(rgb_color, bins=128, smoothing=0):
    """
    Converts a single RGB color to a histogram representation.
    
    Args:
        rgb_color (list or tuple): RGB color as [R, G, B] with values 0-255
        bins (int): Number of bins for the histogram (default: 128)
        smoothing (float): Sigma value for Gaussian smoothing (default: 0, no smoothing)
        
    Returns:
        dict: Dictionary containing histograms for each channel and the combined histogram
    """
    # Validate input
    if len(rgb_color) != 3:
        raise ValueError("RGB color must have exactly 3 values (R, G, B)")
    
    if not all(0 <= value <= 255 for value in rgb_color):
        raise ValueError("RGB values must be in the range 0-255")
    
    # Initialize empty histograms
    hist_r = np.zeros((bins, 1), dtype=np.float32)
    hist_g = np.zeros((bins, 1), dtype=np.float32)
    hist_b = np.zeros((bins, 1), dtype=np.float32)
    
    # Calculate bin indices for each channel
    bin_r = min(bins - 1, int(rgb_color[0] * bins / 256))
    bin_g = min(bins - 1, int(rgb_color[1] * bins / 256))
    bin_b = min(bins - 1, int(rgb_color[2] * bins / 256))
    
    # Set the corresponding bins to 1.0 (maximum value after normalization)
    hist_r[bin_r] = 1.0
    hist_g[bin_g] = 1.0
    hist_b[bin_b] = 1.0
    
    # Apply smoothing if requested
    if smoothing > 0:
        hist_r = gaussian_filter1d(hist_r.flatten(), sigma=smoothing).reshape(-1, 1)
        hist_g = gaussian_filter1d(hist_g.flatten(), sigma=smoothing).reshape(-1, 1)
        hist_b = gaussian_filter1d(hist_b.flatten(), sigma=smoothing).reshape(-1, 1)
        
        # Re-normalize after smoothing
        hist_r = hist_r / np.max(hist_r) if np.max(hist_r) > 0 else hist_r
        hist_g = hist_g / np.max(hist_g) if np.max(hist_g) > 0 else hist_g
        hist_b = hist_b / np.max(hist_b) if np.max(hist_b) > 0 else hist_b
    
    # Combine histograms into a single feature vector
    combined_hist = np.concatenate([hist_r.flatten(), hist_g.flatten(), hist_b.flatten()])
    
    return {
        'red': hist_r.flatten(),
        'green': hist_g.flatten(),
        'blue': hist_b.flatten(),
        'combined': combined_hist
    }

def visualize_histogram(histogram_data, output_path=None):
    """
    Visualize the color histogram.
    
    Args:
        histogram_data (dict): Dictionary containing histogram data
        output_path (str, optional): Path to save the visualization
    """
    fig, ax = plt.subplots(2, 2, figsize=(12, 8))
    
    bins = len(histogram_data['red'])
    x_axis = np.arange(bins)
    
    ax[0, 0].plot(x_axis, histogram_data['red'], color='red')
    ax[0, 0].set_title('Red Channel Histogram')
    ax[0, 0].set_xlim([0, bins-1])
    
    ax[0, 1].plot(x_axis, histogram_data['green'], color='green')
    ax[0, 1].set_title('Green Channel Histogram')
    ax[0, 1].set_xlim([0, bins-1])
    
    ax[1, 0].plot(x_axis, histogram_data['blue'], color='blue')
    ax[1, 0].set_title('Blue Channel Histogram')
    ax[1, 0].set_xlim([0, bins-1])
    
    # Combined histogram (just displaying, can be used for similarity comparisons)
    ax[1, 1].plot(histogram_data['combined'])
    ax[1, 1].set_title('Combined Histogram (RGB)')
    ax[1, 1].set_xlim([0, len(histogram_data['combined'])-1])
    
    plt.tight_layout()
    
    if output_path:
        plt.savefig(output_path)
        print(f"Histogram visualization saved to {output_path}")
    else:
        plt.show()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Calculate color histogram of an image')
    parser.add_argument('image_path', type=str, nargs='?', help='Path to the input image')
    parser.add_argument('--bins', type=int, default=128, help='Number of histogram bins (default: 128)')
    parser.add_argument('--visualize', action='store_true', help='Visualize the histogram')
    parser.add_argument('--output', type=str, help='Path to save the visualization')
    parser.add_argument('--color', type=str, help='RGB color in format "R,G,B" (0-255) to generate histogram from')
    parser.add_argument('--smoothing', type=float, default=0, help='Apply Gaussian smoothing to the histogram (sigma value, default: 0 - no smoothing)')
    
    args = parser.parse_args()
    
    if args.color:
        try:
            rgb_values = [int(x) for x in args.color.split(',')]
            histogram = rgb_to_histogram(rgb_values, args.bins, args.smoothing)
            print(f"Generated histogram for RGB color {rgb_values} with smoothing={args.smoothing}")
        except (ValueError, IndexError) as e:
            print(f"Error parsing color: {e}")
            print("Please provide color in format '255,0,0' for red")
            exit(1)
    elif args.image_path:
        histogram = calculate_color_histogram(args.image_path, args.bins)
    else:
        parser.error("Either --color or image_path must be provided")
    
    print(f"Histogram shape: {histogram['combined'].shape}")
    
    if args.visualize:
        visualize_histogram(histogram, args.output)
