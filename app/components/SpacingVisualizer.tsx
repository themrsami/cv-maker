'use client';

import { FC, useEffect, useState, useCallback } from 'react';

interface ElementSpacing {
  padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  element: HTMLElement;
  styles: {
    padding: { [key: string]: string };
    margin: { [key: string]: string };
    color: string;
    backgroundColor: string;
    borderWidth: string;
    borderStyle: string;
    borderColor: string;
    borderRadius: string;
    fontSize: string;
    fontWeight: string;
  };
  tailwindClasses: {
    padding: string[];
    margin: string[];
  };
  isEditable: boolean;
  hasTailwind: boolean;
}

interface SpacingVisualizerProps {
  containerRef: React.RefObject<HTMLElement>;
}

const SpacingVisualizer: FC<SpacingVisualizerProps> = ({ containerRef }) => {
  const [selectedElement, setSelectedElement] = useState<ElementSpacing | null>(null);
  const [showCssPanel, setShowCssPanel] = useState(false);
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
  const [activeTab, setActiveTab] = useState('spacing');

  const getElementSpacing = useCallback((element: HTMLElement): ElementSpacing => {
    const computedStyle = window.getComputedStyle(element);
    const inlineStyle = element.style;
    
    // Get Tailwind classes
    const tailwindClasses = {
      padding: Array.from(element.classList).filter(cls => 
        cls.startsWith('p-') || cls.startsWith('px-') || cls.startsWith('py-') ||
        cls.startsWith('pt-') || cls.startsWith('pb-') || cls.startsWith('pl-') || cls.startsWith('pr-')
      ),
      margin: Array.from(element.classList).filter(cls =>
        cls.startsWith('m-') || cls.startsWith('mx-') || cls.startsWith('my-') ||
        cls.startsWith('mt-') || cls.startsWith('mb-') || cls.startsWith('ml-') || cls.startsWith('mr-')
      )
    };
    
    const hasTailwind = tailwindClasses.padding.length > 0 || tailwindClasses.margin.length > 0;
    
    return {
      padding: {
        top: parseInt(computedStyle.paddingTop),
        right: parseInt(computedStyle.paddingRight),
        bottom: parseInt(computedStyle.paddingBottom),
        left: parseInt(computedStyle.paddingLeft),
      },
      margin: {
        top: parseInt(computedStyle.marginTop),
        right: parseInt(computedStyle.marginRight),
        bottom: parseInt(computedStyle.marginBottom),
        left: parseInt(computedStyle.marginLeft),
      },
      element,
      styles: {
        padding: {
          top: inlineStyle.paddingTop || computedStyle.paddingTop,
          right: inlineStyle.paddingRight || computedStyle.paddingRight,
          bottom: inlineStyle.paddingBottom || computedStyle.paddingBottom,
          left: inlineStyle.paddingLeft || computedStyle.paddingLeft,
        },
        margin: {
          top: inlineStyle.marginTop || computedStyle.marginTop,
          right: inlineStyle.marginRight || computedStyle.marginRight,
          bottom: inlineStyle.marginBottom || computedStyle.marginBottom,
          left: inlineStyle.marginLeft || computedStyle.marginLeft,
        },
        color: inlineStyle.color || computedStyle.color,
        backgroundColor: inlineStyle.backgroundColor || computedStyle.backgroundColor,
        borderWidth: inlineStyle.borderWidth || computedStyle.borderWidth,
        borderStyle: inlineStyle.borderStyle || computedStyle.borderStyle,
        borderColor: inlineStyle.borderColor || computedStyle.borderColor,
        borderRadius: inlineStyle.borderRadius || computedStyle.borderRadius,
        fontSize: inlineStyle.fontSize || computedStyle.fontSize,
        fontWeight: inlineStyle.fontWeight || computedStyle.fontWeight
      },
      tailwindClasses,
      isEditable: true,
      hasTailwind
    };
  }, []);

  const updateElementSpacing = useCallback((
    element: HTMLElement,
    type: 'padding' | 'margin',
    side: 'top' | 'right' | 'bottom' | 'left',
    value: number
  ) => {
    if (!element) return;
    
    // Use inline styles
    const property = `${type}-${side}`;
    element.style.setProperty(property, `${value}px`);
    
    // Update the selected element state
    setSelectedElement(prev => prev ? getElementSpacing(prev.element) : null);
  }, [getElementSpacing]);

  const updateElementStyle = useCallback((
    element: HTMLElement,
    property: string,
    value: string
  ) => {
    if (!element) return;
    element.style.setProperty(property, value);
    setSelectedElement(prev => prev ? getElementSpacing(prev.element) : null);
  }, [getElementSpacing]);

  const handleElementClick = useCallback((element: HTMLElement) => {
    if (element === selectedElement?.element) {
      setSelectedElement(null);
      setShowCssPanel(false);
    } else {
      const spacing = getElementSpacing(element);
      setSelectedElement(spacing);
      setShowCssPanel(true);
    }
  }, [getElementSpacing, selectedElement]);

  const handleMouseOver = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    
    const target = e.target as HTMLElement;
    if (target.classList.contains('spacing-visualizer') || !containerRef.current.contains(target)) {
      setHoveredElement(null);
      return;
    }

    if (target === selectedElement?.element) {
      setHoveredElement(null);
      return;
    }

    setHoveredElement(target);
    e.stopPropagation();
  }, [containerRef, selectedElement]);

  const handleMouseOut = useCallback(() => {
    setHoveredElement(null);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.classList.contains('spacing-visualizer')) {
        handleElementClick(target);
        e.stopPropagation();
      }
    };

    container.addEventListener('mouseover', handleMouseOver);
    container.addEventListener('mouseout', handleMouseOut);
    container.addEventListener('click', handleClick);

    return () => {
      container.removeEventListener('mouseover', handleMouseOver);
      container.removeEventListener('mouseout', handleMouseOut);
      container.removeEventListener('click', handleClick);
    };
  }, [containerRef, handleMouseOver, handleMouseOut, handleElementClick]);

  const renderSpacingOverlay = (element: HTMLElement) => {
    if (!element) return null;

    const rect = element.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return null;

    const spacing = getElementSpacing(element);
    const isSelected = selectedElement?.element === element;

    return (
      <>
        {/* Element highlight */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: rect.top - containerRect.top,
            left: rect.left - containerRect.left,
            width: rect.width,
            height: rect.height,
            border: `2px solid ${isSelected ? '#4299e1' : '#60a5fa'}`,
            backgroundColor: 'rgba(66, 153, 225, 0.1)',
            zIndex: 999
          }}
        />

        {/* Padding overlay */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: rect.top - containerRect.top + spacing.padding.top,
            left: rect.left - containerRect.left + spacing.padding.left,
            width: rect.width - spacing.padding.left - spacing.padding.right,
            height: rect.height - spacing.padding.top - spacing.padding.bottom,
            border: '1px dashed rgba(0, 255, 0, 0.5)',
            backgroundColor: 'rgba(0, 255, 0, 0.1)',
            zIndex: 1000
          }}
        />

        {/* Margin overlays */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: rect.top - containerRect.top - spacing.margin.top,
            left: rect.left - containerRect.left - spacing.margin.left,
            width: rect.width + spacing.margin.left + spacing.margin.right,
            height: spacing.margin.top,
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            border: '1px dashed rgba(255, 0, 0, 0.5)',
            zIndex: 1000
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            top: rect.bottom - containerRect.top,
            left: rect.left - containerRect.left - spacing.margin.left,
            width: rect.width + spacing.margin.left + spacing.margin.right,
            height: spacing.margin.bottom,
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            border: '1px dashed rgba(255, 0, 0, 0.5)',
            zIndex: 1000
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            top: rect.top - containerRect.top,
            left: rect.left - containerRect.left - spacing.margin.left,
            width: spacing.margin.left,
            height: rect.height,
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            border: '1px dashed rgba(255, 0, 0, 0.5)',
            zIndex: 1000
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            top: rect.top - containerRect.top,
            left: rect.right - containerRect.left,
            width: spacing.margin.right,
            height: rect.height,
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            border: '1px dashed rgba(255, 0, 0, 0.5)',
            zIndex: 1000
          }}
        />
      </>
    );
  };

  return (
    <>
      <div className="spacing-visualizer absolute inset-0 pointer-events-none">
        {hoveredElement && hoveredElement !== selectedElement?.element && renderSpacingOverlay(hoveredElement)}
        {selectedElement && renderSpacingOverlay(selectedElement.element)}
      </div>

      {/* CSS Panel */}
      {showCssPanel && selectedElement && (
        <div 
          className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg border-l border-gray-200 p-4 overflow-y-auto"
          style={{ zIndex: 1001 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">Custom Styles</h3>
            <button 
              onClick={() => setShowCssPanel(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          {/* Style Type Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <nav className="flex space-x-4" aria-label="Tabs">
              {['Spacing', 'Colors', 'Border', 'Typography'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`px-3 py-2 text-sm font-medium border-b-2 ${
                    activeTab === tab.toLowerCase()
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {activeTab === 'spacing' && (
            <>
              {/* Padding Controls */}
              <div className="mb-6">
                <h4 className="font-medium text-sm text-gray-600 mb-2">Padding</h4>
                <div className="space-y-2">
                  {(['top', 'right', 'bottom', 'left'] as const).map(side => (
                    <div key={`padding-${side}`} className="flex items-center justify-between">
                      <label className="text-sm text-gray-600 capitalize">{side}</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          value={selectedElement.padding[side]}
                          onChange={(e) => {
                            updateElementSpacing(
                              selectedElement.element,
                              'padding',
                              side,
                              parseInt(e.target.value) || 0
                            );
                          }}
                          className="w-16 px-2 py-1 border rounded text-sm"
                          min="0"
                        />
                        <span className="text-sm text-gray-500">px</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Margin Controls */}
              <div className="mb-6">
                <h4 className="font-medium text-sm text-gray-600 mb-2">Margin</h4>
                <div className="space-y-2">
                  {(['top', 'right', 'bottom', 'left'] as const).map(side => (
                    <div key={`margin-${side}`} className="flex items-center justify-between">
                      <label className="text-sm text-gray-600 capitalize">{side}</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          value={selectedElement.margin[side]}
                          onChange={(e) => {
                            updateElementSpacing(
                              selectedElement.element,
                              'margin',
                              side,
                              parseInt(e.target.value) || 0
                            );
                          }}
                          className="w-16 px-2 py-1 border rounded text-sm"
                          min="0"
                        />
                        <span className="text-sm text-gray-500">px</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'colors' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Text Color</label>
                <input
                  type="color"
                  value={selectedElement.styles.color}
                  onChange={(e) => updateElementStyle(selectedElement.element, 'color', e.target.value)}
                  className="mt-1 p-1 w-full rounded border border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Background Color</label>
                <input
                  type="color"
                  value={selectedElement.styles.backgroundColor}
                  onChange={(e) => updateElementStyle(selectedElement.element, 'background-color', e.target.value)}
                  className="mt-1 p-1 w-full rounded border border-gray-300"
                />
              </div>
            </div>
          )}

          {activeTab === 'border' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Border Width</label>
                <input
                  type="number"
                  value={parseInt(selectedElement.styles.borderWidth) || 0}
                  onChange={(e) => updateElementStyle(selectedElement.element, 'border-width', `${e.target.value}px`)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Border Style</label>
                <select
                  value={selectedElement.styles.borderStyle}
                  onChange={(e) => updateElementStyle(selectedElement.element, 'border-style', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  {['none', 'solid', 'dashed', 'dotted', 'double'].map(style => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Border Color</label>
                <input
                  type="color"
                  value={selectedElement.styles.borderColor}
                  onChange={(e) => updateElementStyle(selectedElement.element, 'border-color', e.target.value)}
                  className="mt-1 p-1 w-full rounded border border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Border Radius</label>
                <input
                  type="number"
                  value={parseInt(selectedElement.styles.borderRadius) || 0}
                  onChange={(e) => updateElementStyle(selectedElement.element, 'border-radius', `${e.target.value}px`)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  min="0"
                />
              </div>
            </div>
          )}

          {activeTab === 'typography' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Font Size</label>
                <input
                  type="number"
                  value={parseInt(selectedElement.styles.fontSize) || 16}
                  onChange={(e) => updateElementStyle(selectedElement.element, 'font-size', `${e.target.value}px`)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  min="8"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Font Weight</label>
                <select
                  value={selectedElement.styles.fontWeight}
                  onChange={(e) => updateElementStyle(selectedElement.element, 'font-weight', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  {['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'].map(weight => (
                    <option key={weight} value={weight}>{weight}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Current Styles */}
          <div className="mt-8">
            <h4 className="font-medium text-sm text-gray-600 mb-2">Applied Styles</h4>
            <div className="space-y-4 text-xs font-mono bg-gray-50 p-2 rounded">
              <div>
                <div className="font-medium text-gray-700 mb-1">Computed Styles:</div>
                {Object.entries(selectedElement.styles).map(([property, value]) => (
                  typeof value === 'string' ? (
                    <div key={property} className="text-gray-600">
                      {property}: {value};
                    </div>
                  ) : null
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SpacingVisualizer;
