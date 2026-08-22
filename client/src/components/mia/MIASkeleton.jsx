import { motion } from 'framer-motion';

function Line({ w = '100%', h = '12px' }) {
  return <div className="mia-skel-line" style={{ width: w, height: h }} />;
}

export function ChatSkeleton() {
  return (
    <motion.div className="mia-skel-chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="mia-skel-row mia-skel-row--ai">
        <div className="mia-skel-dot" />
        <div className="mia-skel-bubble">
          <Line w="90%" /><Line w="75%" /><Line w="55%" />
        </div>
      </div>
      <div className="mia-skel-row mia-skel-row--user">
        <div className="mia-skel-bubble mia-skel-bubble--user">
          <Line w="80%" /><Line w="60%" />
        </div>
      </div>
      <div className="mia-skel-row mia-skel-row--ai">
        <div className="mia-skel-dot" />
        <div className="mia-skel-bubble">
          <Line w="85%" /><Line w="70%" /><Line w="40%" />
        </div>
      </div>
    </motion.div>
  );
}

export function CardSkeleton() {
  return (
    <div className="mia-skel-card">
      <div className="mia-skel-card-hd">
        <div className="mia-skel-avatar" />
        <div style={{ flex: 1 }}>
          <Line w="55%" h="11px" />
          <Line w="35%" h="9px" />
        </div>
      </div>
      <Line w="100%" h="10px" />
      <Line w="80%" h="10px" />
    </div>
  );
}

export function ListSkeleton({ count = 3 }) {
  return (
    <motion.div className="mia-skel-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {Array.from({ length: count }).map((_, i) => <CardSkeleton key={i} />)}
    </motion.div>
  );
}

export default function MIASkeleton({ type = 'list', count = 3 }) {
  if (type === 'chat') return <ChatSkeleton />;
  return <ListSkeleton count={count} />;
}
