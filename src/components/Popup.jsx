import { CheckCircle, XCircle } from 'lucide-react';

export default function Popup({ feedback, content, onClose }) {
  const isError = feedback === 'error';

  return (
    // Backdrop overlay centering the popup
    <div className="fixed w-full h-full inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={onClose}
    >
      
      {/* Popup Container */}
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm transform transition-all flex flex-col items-center text-center animate-in fade-in zoom-in duration-200">
        
        {/* Icon based on feedback type */}
        <div className="mb-4">
          {isError ? (
            <XCircle className="w-16 h-16 text-red-500" />
          ) : (
            <CheckCircle className="w-16 h-16 text-green-500" />
          )}
        </div>

        {/* Title */}
        <h3 className={`text-xl font-bold mb-2 ${isError ? 'text-red-600' : 'text-green-600'}`}>
          {isError ? 'Error' : 'Success!'}
        </h3>

        {/* Message Content */}
        <p className="text-gray-600 mb-6">
          {content}
        </p>
      </div>
    </div>
  );
}