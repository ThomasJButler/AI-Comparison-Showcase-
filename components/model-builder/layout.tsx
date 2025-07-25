"use client";

import { useState, useEffect, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { 
  ResizablePanelGroup, 
  ResizablePanel, 
  ResizableHandle 
} from '@/components/ui/resizable';
import { X, Maximize, Minimize, Command, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ModelBuilderLayoutProps {
  leftPanel: ReactNode;
  centerPanel: ReactNode;
  rightPanel: ReactNode;
  topBarContent?: ReactNode;
  bottomBarContent?: ReactNode;
  onClose?: () => void;
}

export function ModelBuilderLayout({
  leftPanel,
  centerPanel,
  rightPanel,
  topBarContent,
  bottomBarContent,
  onClose
}: ModelBuilderLayoutProps) {
  const router = useRouter();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [leftPanelSize, setLeftPanelSize] = useState(25);
  const [rightPanelSize, setRightPanelSize] = useState(25);
  
  // Handle fullscreen mode
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC already handles exiting fullscreen by browser default
      
      // Ctrl+F for fullscreen
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        toggleFullscreen();
      }
      
      // Ctrl+/ for command bar focus (will implement later)
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        // Focus command bar logic will go here
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.push('/models');
    }
  };
  
  // Handle panel resize
  const handlePanelResize = (sizes: number[]) => {
    setLeftPanelSize(sizes[0]);
    setRightPanelSize(sizes[2]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col">
      {/* Top bar with title, commands, close */}
      <div className="h-14 border-b border-border flex items-center justify-between px-4 bg-background/90">
        {topBarContent || (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <button
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-matrix-primary/10 text-foreground/70 hover:text-matrix-primary transition-colors"
                aria-label="Back to Models"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold bg-gradient-to-r from-matrix-primary to-matrix-secondary text-transparent bg-clip-text">
                AI Model Builder
              </h2>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="p-1.5 px-3 rounded-md border border-matrix-primary/20 bg-matrix-primary/5 text-sm text-foreground/60 flex items-center gap-1">
                <Command className="w-3.5 h-3.5" />
                <span>Ctrl+/</span>
              </div>
              
              <button 
                onClick={toggleFullscreen}
                className="p-2 rounded-lg hover:bg-matrix-primary/10 text-foreground/70 hover:text-matrix-primary transition-colors"
                aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </button>
              
              <button
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-matrix-primary/10 text-foreground/70 hover:text-matrix-primary transition-colors"
                aria-label="Close Builder"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main resizable panel group */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup 
          direction="horizontal" 
          className="h-full"
          onLayout={handlePanelResize}
          style={{
            // Matrix-inspired subtle glow effect on panel edges
            '--panel-border-glow': '0 0 2px var(--matrix-primary-50)',
          } as React.CSSProperties}
        >
          <ResizablePanel 
            defaultSize={leftPanelSize} 
            minSize={15} 
            maxSize={40}
            className="border-r border-matrix-primary/20 bg-card/20"
          >
            <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-matrix-primary/20 p-4">
              {leftPanel}
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle className="bg-matrix-primary/5 hover:bg-matrix-primary/20 transition-colors data-[active]:bg-matrix-primary/30" />
          
          <ResizablePanel 
            defaultSize={100 - leftPanelSize - rightPanelSize}
            className="bg-card/10"
          >
            <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-matrix-primary/20">
              {centerPanel}
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle className="bg-matrix-primary/5 hover:bg-matrix-primary/20 transition-colors data-[active]:bg-matrix-primary/30" />
          
          <ResizablePanel 
            defaultSize={rightPanelSize} 
            minSize={15} 
            maxSize={40}
            className="border-l border-matrix-primary/20 bg-card/20"
          >
            <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-matrix-primary/20 p-4">
              {rightPanel}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Bottom bar with actions, status */}
      <div className="h-14 border-t border-border px-4 bg-background/90">
        {bottomBarContent || (
          <div className="flex items-center justify-between h-full">
            <div className="text-sm text-foreground/50">
              Press <kbd className="px-1.5 py-0.5 rounded bg-matrix-primary/10 border border-matrix-primary/20 text-xs">ESC</kbd> to exit • 
              <kbd className="ml-1 px-1.5 py-0.5 rounded bg-matrix-primary/10 border border-matrix-primary/20 text-xs">Ctrl+S</kbd> to save • 
              <kbd className="ml-1 px-1.5 py-0.5 rounded bg-matrix-primary/10 border border-matrix-primary/20 text-xs">Ctrl+Space</kbd> for commands
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center px-2 py-1 rounded-full bg-matrix-primary/10 text-xs text-matrix-primary border border-matrix-primary/20">
                <span>Recommended: Use Fullscreen</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Matrix-inspired background effect */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="matrix-code-bg"></div>
        <div className="scanline-effect"></div>
      </div>
    </div>
  );
}
