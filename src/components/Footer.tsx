import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-corporate text-corporate-foreground mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <p className="text-sm">
            &copy; 2024 QuotientOne. All rights reserved.
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <a 
              href="https://privacypolicy-quotient-one.carrd.co/" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Privacy Policy
            </a>
            <a 
              href="https://privacypolicy-quotient-one.carrd.co/" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Terms of Service
            </a>
            <a 
              href="https://quotient-one.web.app/" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              QuotientOne
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};