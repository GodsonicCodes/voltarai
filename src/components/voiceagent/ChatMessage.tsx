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
                className="flex justify-end mb-3"
            >
                <div className="flex items-end gap-1.5 max-w-md">
                    {source === 'voice' && (
                        <Mic className="w-3 h-3 text-violet-400 mb-1 shrink-0" />
                    )}
                    <div className="bg-violet-700 text-white px-3 md:px-4 py-2 md:py-2.5 rounded-2xl rounded-tr-sm text-xs md:text-sm shadow-sm">
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
            className="flex items-start gap-2 mb-3"
        >
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden border border-indigo-400">
                <img
                    src="/assets/voiceagent/voiceagent.png"
                    alt="Assistant"
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="bg-white border border-gray-200 px-3 md:px-4 py-2 md:py-2.5 rounded-2xl rounded-tl-sm max-w-[85%] md:max-w-md text-xs md:text-sm text-gray-700 shadow-sm overflow-hidden">
                {isThinking ? (
                    <div className="py-1">
                        <ThinkingIndicator />
                    </div>
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
