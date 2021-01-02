import numpy as np
from scipy.io import wavfile

# Defining the input frequencies can be done by the user
freq1 = 440 # Hz
freq2 = 447 # Hz 

sampleRate = 44100
length = 5

t = np.linspace(0, length, sampleRate * length)  #  Produces a 5 second Audio-File
y1 = 0.1*np.sin(freq1 * 2 * np.pi * t)
y2 = 0.1*np.sin(freq2 * 2 * np.pi * t)

combined = np.vstack((y1, y2))

data = combined.transpose()

outputRoot = "C:\\Users\\Luke\\Documents\\"

wavfile.write(outputRoot + 'Sine.wav', sampleRate, data)