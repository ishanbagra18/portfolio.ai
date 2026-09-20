import React, { createContext, useContext } from 'react';

export const SectionContext = createContext({ sectionIndex: 1, sectionNumber: '01' });

export function useSectionNumber(fallback = '01') {
  const ctx = useContext(SectionContext);
  return ctx?.sectionNumber || fallback;
}

export default function SectionRenderer({ 
  sectionOrder = [], 
  sectionVisibility = {}, 
  sectionMap = {} 
}) {
  const defaultOrder = Object.keys(sectionMap);
  const currentOrder = sectionOrder.length ? sectionOrder : defaultOrder;

  // Append any sections in sectionMap that aren't in sectionOrder
  const fullOrder = [...currentOrder];
  defaultOrder.forEach(id => {
    if (!fullOrder.includes(id)) fullOrder.push(id);
  });

  let visibleCount = 0;

  return (
    <>
      {fullOrder.map(id => {
        const componentNode = sectionMap[id];
        const isVisible = sectionVisibility[id] !== false; // Visible by default

        if (!componentNode || !isVisible) return null;

        visibleCount++;
        const sectionIndex = visibleCount;
        const sectionNumber = String(sectionIndex).padStart(2, '0');

        const contextValue = { sectionIndex, sectionNumber };

        const elementToRender = typeof componentNode === 'function'
          ? componentNode(contextValue)
          : React.isValidElement(componentNode)
          ? React.cloneElement(componentNode, { sectionIndex, sectionNumber })
          : componentNode;

        return (
          <SectionContext.Provider key={id} value={contextValue}>
            {elementToRender}
          </SectionContext.Provider>
        );
      })}
    </>
  );
}

