import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-warm-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <p className="font-display text-[200px] leading-none text-gray-100 mb-0 select-none">
          404
        </p>
        <div className="-mt-16 relative z-10">
          <h1 className="font-display text-4xl text-matte-black mb-4">Page Not Found</h1>
          <div className="w-12 h-[1px] bg-champagne-gold mx-auto mb-6" />
          <p className="text-gray-400 font-light mb-12 max-w-sm mx-auto">
            The page you are looking for has moved or does not exist in our collection.
          </p>
          <Link to="/">
            <Button size="lg" variant="gold">Return to Maison</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
