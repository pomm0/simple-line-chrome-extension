let destructorFunctions = [];

const setup = () => {
  const style = document.createElement('style');
  style.appendChild(document.createTextNode(`
    #sl-tool-box {
      position: fixed;
      bottom: 0;
      left: 0;
      background-color: #1967d2;
      padding: 16px;
      color: white;
    }
    #sl-tool-box ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .sl-horizontal-line {
      background: red;
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      height: 1px;
      width: 100%;
      z-index: 9999;
    }
    .sl-vertical-line {
      background: red;
      position: fixed;
      top: 0;
      bottom: 0;
      width: 1px;
      height: 100%;
      z-index: 9999;
    }
  `));
  document.head.appendChild(style);
  destructorFunctions.push(() => style.remove());

  const container = document.createElement('div');
  container.id = 'sl-extension';
  container.innerHTML = `
    <div id="sl-tool-box">
      <ul>
        <li>h: draw horizontal line</li>
        <li>v: draw vertical line</li>
        <li>x: remove all lines</li>
      </ul>
    </div>
    <div id="sl-horizontal-line" class="sl-horizontal-line"></div>
    <div id="sl-vertical-line" class="sl-vertical-line"></div>
  `
  document.body.appendChild(container);
  destructorFunctions.push(() => container.remove());

  const horizontalLine = document.getElementById('sl-horizontal-line');
  const verticalLine = document.getElementById('sl-vertical-line');
  const cloneClass = 'sl-clone';

  const cloneAndFreeze = (target) => {
    const element = target === 'horizontal' ? horizontalLine : verticalLine;
    const clone = element.cloneNode();
    clone.classList.add(cloneClass);
    container.appendChild(clone);
    destructorFunctions.push(() => clone.remove());
  };

  const moveListener = (event) => {
    const { clientX, clientY } = event;

    horizontalLine.style.top = `${clientY}px`;
    verticalLine.style.left = `${clientX}px`;
  };
  document.addEventListener('mousemove', moveListener);
  destructorFunctions.push(() => document.removeEventListener('mousemove', moveListener));

  const keyupListener = ({ code }) => {
    switch (code) {
      case 'KeyH':
        cloneAndFreeze('horizontal');
        break;
      case 'KeyV':
        cloneAndFreeze('vertical');
        break;
      case 'KeyX':
        [...document.querySelectorAll(`#sl-extension .${cloneClass}`)].forEach((element) => element.remove());
        break;
    }
  };
  document.addEventListener('keyup', keyupListener);
  destructorFunctions.push(() => document.removeEventListener('keyup', keyupListener));
};

const cleanUp = () => {
  destructorFunctions.forEach((destructorFunction) => destructorFunction());
  destructorFunctions = [];
};

chrome.runtime.onMessage.addListener(
  function(request/*, sender, sendResponse*/) {
    switch (request.command) {
      case 'cleanup':
        cleanUp();
        break;
      case 'setup':
        setup();
        break;
    }
  }
);
