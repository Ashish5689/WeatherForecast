import { motion } from 'framer-motion';

type DynamicBackgroundProps = {
  condition: string;
};

export const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ condition }) => {
  const getBackgroundClass = (condition: string) => {
    if (condition.includes('sun') || condition.includes('clear')) {
      return 'bg-gradient-to-br from-yellow-300 to-orange-500';
    }
    if (condition.includes('cloud') || condition.includes('overcast')) {
      return 'bg-gradient-to-br from-gray-300 to-gray-500';
    }
    if (condition.includes('rain') || condition.includes('drizzle')) {
      return 'bg-gradient-to-br from-blue-300 to-blue-600';
    }
    return 'bg-gradient-to-br from-purple-400 to-indigo-600';
  };

  return (
    <motion.div
      className={`fixed inset-0 ${getBackgroundClass(condition)}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {condition.includes('sun') && (
        <motion.div
          className="absolute top-10 right-10 w-32 h-32 bg-yellow-300 rounded-full"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
      {condition.includes('rain') && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-blue-300 w-0.5 h-8"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-8px`,
              }}
              animate={{
                y: ['0%', '100vh'],
              }}
              transition={{
                duration: Math.random() * 1.5 + 0.5,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};