'use client';

import { motion } from 'framer-motion';
import { Mic } from 'lucide-react';
import ThinkingIndicator from './ThinkingIndicator';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessageProps {
    type: 'user' | 'assistant';
    content: string;
    isThinking?: boolean;
    source?: 'voice' | 'chat';
}

export default function ChatMessage({ type, content, isThinking = false, source }: ChatMessageProps) {
    if (type === 'user') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex justify-end w-full"
            >
                <div className="flex items-end gap-1.5 max-w-[85%] md:max-w-md">
                    {source === 'voice' && (
                        <Mic className="w-3 h-3 text-indigo-300 mb-1.5 shrink-0" />
                    )}
                    <div className="bg-[#3B00E6] text-white px-5 py-3.5 rounded-[20px] rounded-br-sm text-[13px] shadow-sm leading-relaxed">
                        <div className="prose prose-sm prose-invert max-w-none">
                        <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                                p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                                ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2" {...props} />,
                                ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                                li: ({node, ...props}) => <li className="mb-1" {...props} />,
                                h1: ({node, ...props}) => <h1 className="text-lg font-bold mb-2" {...props} />,
                                h2: ({node, ...props}) => <h2 className="text-base font-bold mb-2" {...props} />,
                                h3: ({node, ...props}) => <h3 className="text-sm font-bold mb-1" {...props} />,
                            }}
                        >
                            {content}
                        </ReactMarkdown>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-start gap-2 w-full"
        >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 shrink-0 mt-1">
                <img
                    src="/assets/voiceagent/voiceagent.png"
                    alt="Assistant"
                    className="w-full h-full object-cover"
                />
            </div>
            
            <div className={`leading-relaxed ${
                isThinking 
                    ? 'py-2 px-1' // Transparent background for dots
                    : 'bg-[#F3F4F6] border border-gray-100 px-5 py-3.5 rounded-[20px] rounded-bl-sm max-w-[85%] md:max-w-md text-[13px] text-gray-800 shadow-sm'
            }`}>
                {isThinking ? (
                    <ThinkingIndicator />
                ) : (
                    <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-strong:text-gray-900 prose-p:leading-relaxed">
                        <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                                p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                                ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2" {...props} />,
                                ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                                li: ({node, ...props}) => <li className="mb-1" {...props} />,
                                h1: ({node, ...props}) => <h1 className="text-lg font-bold mb-2" {...props} />,
                                h2: ({node, ...props}) => <h2 className="text-base font-bold mb-2" {...props} />,
                                h3: ({node, ...props}) => <h3 className="text-sm font-bold mb-1" {...props} />,
                            }}
                        >
                            {content}
                        </ReactMarkdown>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
