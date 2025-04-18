import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Wand2, Download, Info, RefreshCw, Sparkles } from 'lucide-react';
import UploadZone from '../components/UploadZone';
import ProgressBar from '../components/ProgressBar';
import TexturePanel from '../components/TexturePanel';
import HowItWorks from '../components/HowItWorks';
import ShowcaseSlider from '../components/ShowcaseSlider';
import UserForm from '../components/UserForm';

function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const steps = [
    { title: 'Upload Image', icon: Upload },
    { title: 'Segment Parts', icon: ImageIcon },
    { title: 'Generate Textures', icon: Wand2 },
    { title: 'Download Result', icon: Download },
  ];

  const showcaseItems = [
    {
      before: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&h=600&fit=crop",
      after: "https://images.unsplash.com/photo-1565374395542-0ce18882c857?w=800&h=600&fit=crop",
      title: "Modern Sofa",
      description: "From classic fabric to premium leather"
    },
    {
      before: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&h=600&fit=crop",
      after: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&h=600&fit=crop",
      title: "Dining Chair",
      description: "Traditional wood to velvet finish"
    },
    {
      before: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
      after: "https://images.unsplash.com/photo-1550226891-ef816aed4a98?w=800&h=600&fit=crop",
      title: "Accent Chair",
      description: "Cotton blend to premium suede"
    }
  ];

  const handleImageUpload = (file: File) => {
    setSelectedImage(file);
    setCurrentStep(1);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setCurrentStep(2);
    }, 2000);
  };

  return (
    <>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        
        {/* Hero Content */}
        {!selectedImage && (
          <>
            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Transform Your Designs with
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                  AI-Powered Textures
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-12">
                Upload any image and watch as our AI transforms it with stunning, realistic textures in seconds.
              </p>
              <div className="flex justify-center space-x-4">
                <div className="flex items-center space-x-2 text-white/80 text-sm">
                  <Sparkles className="h-4 w-4" />
                  <span>Instant Processing</span>
                </div>
                <div className="flex items-center space-x-2 text-white/80 text-sm">
                  <ImageIcon className="h-4 w-4" />
                  <span>High Quality Results</span>
                </div>
                <div className="flex items-center space-x-2 text-white/80 text-sm">
                  <Download className="h-4 w-4" />
                  <span>Easy Export</span>
                </div>
              </div>
            </div>

            {/* User Form */}
            <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
              <UserForm />
            </div>

            {/* Showcase Section */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
              <h3 className="text-2xl font-bold text-white text-center mb-12">
                See the Magic in Action
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {showcaseItems.map((item, index) => (
                  <ShowcaseSlider
                    key={index}
                    before={item.before}
                    after={item.after}
                    title={item.title}
                    description={item.description}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Upload and Preview */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-effect rounded-2xl p-6 border border-white/20">
              <ProgressBar steps={steps} currentStep={currentStep} />
            </div>
            
            <div className="glass-effect rounded-2xl p-6 border border-white/20">
              {!selectedImage ? (
                <UploadZone onUpload={handleImageUpload} />
              ) : (
                <div className="relative rounded-xl overflow-hidden">
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Preview"
                    className="w-full"
                  />
                  {isProcessing && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                      <div className="text-center">
                        <RefreshCw className="h-10 w-10 text-white animate-spin mx-auto mb-4" />
                        <p className="text-white text-lg">Processing your image...</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Texture Options */}
          <div className="lg:col-span-1">
            <TexturePanel isActive={currentStep >= 2} />
          </div>
        </div>
      </main>

      {/* How it Works Modal */}
      {showHowItWorks && <HowItWorks onClose={() => setShowHowItWorks(false)} />}
    </>
  );
}

export default Home;