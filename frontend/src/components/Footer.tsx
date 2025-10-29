import React from 'react';
import { motion } from 'framer-motion';

export const Footer: React.FC = () => {
  return (
    <motion.footer
      className="mt-16 py-8 border-t border-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-gray-400 text-sm">
              Built with ❤️ for Solana x402 Hackathon
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <a
              href="https://x.com/Incrypt_defi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-cyan hover:text-neon-magenta transition-colors duration-300 text-sm flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M13.682 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6815 10.6218H13.682ZM11.5541 13.0956L10.8574 12.0991L4.88508 4.16971H7.52789L12.5492 10.5689L13.2459 11.5654L19.2178 19.5065H16.575L11.5541 13.0962V13.0956Z" />
              </svg>
              <span>@Incrypt_defi</span>
            </a>
            <a
              href="mailto:incryptinvestments@protonmail.com"
              className="text-neon-cyan hover:text-neon-magenta transition-colors duration-300 text-sm flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>incryptinvestments@protonmail.com</span>
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

