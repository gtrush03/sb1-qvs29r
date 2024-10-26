import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Mic, Radio, Timer } from 'lucide-react';

const TIMER_DURATION = 5 * 60; // 5 minutes in seconds

const Synthos = () => {
  const [isListening, setIsListening] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [isPaused, setIsPaused] = useState(false);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    let interval;
    if (isListening && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isListening, isPaused, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClick = () => {
    if (timeLeft === 0) {
      return; // Prevent further usage if time is up
    }
    
    if (!isListening) {
      setIsListening(true);
      setIsPaused(false);
    } else {
      setIsPaused(true);
      setIsListening(false);
    }
  };

  return (
    <section id="synthos" className="py-20 px-6 relative overflow-hidden">
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        className="container mx-auto"
      >
        <motion.div
          className="text-center mb-16"
          initial={{ y: 20 }}
          animate={inView ? { y: 0 } : { y: 20 }}
        >
          <h2 className="text-5xl font-light gradient-text mb-6">DATA SYNTHESIS</h2>
          <p className="text-gray-400 text-lg font-light tracking-wide max-w-2xl mx-auto">
            Engage with our AI assistant to explore our advanced data synthesis capabilities and enterprise solutions
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center">
          <motion.div 
            className="w-[300px] h-[300px] rounded-full relative bg-black/30 backdrop-blur-lg border border-primary/20 flex items-center justify-center mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }}
          >
            {/* Central Button */}
            <motion.button
              className={`w-32 h-32 rounded-full flex items-center justify-center relative z-10 ${
                isListening ? 'bg-primary/20' : timeLeft === 0 ? 'bg-black/30 cursor-not-allowed' : 'bg-black/50'
              } border border-primary/30`}
              onClick={handleClick}
              whileHover={timeLeft > 0 ? { scale: 1.1 } : {}}
              whileTap={timeLeft > 0 ? { scale: 0.95 } : {}}
              disabled={timeLeft === 0}
            >
              <AnimatePresence mode="wait">
                {isListening ? (
                  <motion.div
                    key="listening"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="flex flex-col items-center"
                  >
                    <Radio className="w-10 h-10 text-primary animate-pulse" />
                    <span className="text-xs text-primary/70 mt-2">{formatTime(timeLeft)}</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="not-listening"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="flex flex-col items-center"
                  >
                    {timeLeft > 0 ? (
                      <>
                        <Mic className="w-10 h-10 text-primary/70" />
                        {isPaused && <Timer className="w-4 h-4 text-primary/50 mt-2" />}
                      </>
                    ) : (
                      <Timer className="w-10 h-10 text-primary/30" />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Ripple Effect */}
              <AnimatePresence>
                {isListening && (
                  <motion.div
                    className="absolute inset-0 rounded-full border border-primary/30"
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    exit={{ scale: 1, opacity: 0 }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>

          {/* Status Text */}
          <AnimatePresence mode="wait">
            {timeLeft === 0 ? (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-primary/50 text-sm tracking-wide"
              >
                Session limit reached. Please try again later.
              </motion.p>
            ) : isPaused ? (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-primary/50 text-sm tracking-wide"
              >
                Session paused. Time remaining: {formatTime(timeLeft)}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
};

export default Synthos;