
const enableSelector = () => {
  let isSelecting = true;

  const hasIdentifier = (element: HTMLElement) => element.getAttribute('data-hook') || element.id;

  const disableClick = (event: MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
  };

  const enableOutline = (element: HTMLElement) => {
    element.setAttribute('data-outline', element.style.outline);
    element.style.outline = '2px solid red';
    element.style.outlineOffset = '-1px';
  };

  const disableOutline = (element: HTMLElement) => {
    const outline = element.getAttribute('data-outline');
    element.style.outline = outline;
    element.style.outlineOffset = '';
    element.removeAttribute('data-outline');
  };

  const disableParentsOutline = (element: HTMLElement) => {
    disableOutline(element);
    if (element.parentElement) {
      disableParentsOutline(element.parentElement);
    }
  };

  const closestIdentifiedElement = (element: HTMLElement): HTMLElement | null => element.closest('[data-hook],[id]');

  const handleSelectedElement = (event: MouseEvent) => {
    if (isSelecting) {
      disableClick(event);
      const target = event.target as HTMLElement;
      const closestElement = closestIdentifiedElement(target);
      if (closestElement) {
        chrome.storage.local.set({ toolcastElementDataHook: closestElement.getAttribute('data-hook'), toolcastElementId: closestElement.id });
        disableParentsOutline(closestElement);
        isSelecting = false;
      }
    }
  };

  document.querySelectorAll('[data-hook],[id]').forEach((element: HTMLElement) => {
    element.addEventListener('mouseenter', (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const relatedTarget = event.relatedTarget as HTMLElement;
      if (hasIdentifier(target) && isSelecting) {
        disableParentsOutline(target);
        enableOutline(target);
        relatedTarget && disableParentsOutline(relatedTarget);
      }
    });
    element.addEventListener('mouseleave', (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (hasIdentifier(target)) {
        disableParentsOutline(target);
        const closestParent = closestIdentifiedElement(target.parentElement);
        if (closestParent && isSelecting) {
          enableOutline(closestParent);
        }
      }
    });
    element.addEventListener('click', handleSelectedElement);
  });
};

chrome.storage.local.get(['toolcastElementDataHook', 'toolcastElementId'], ({ toolcastElementDataHook: dataHook, toolcastElementId: id }) => {
  const input1 = document.querySelector('#data-hook-selector');
  input1.setAttribute('value', dataHook || '');
  const input2 = document.querySelector('#id-selector');
  input2.setAttribute('value', id || '');
});
const button = document.querySelector('#selector-button');
button.addEventListener('click', () => chrome.tabs.executeScript({ code: `(${enableSelector})();` }));
