import { splitSelectionText } from './utils/general';

const editorContainer = document.getElementById('editor-container') as HTMLDivElement;
let timer: number;

const state = {
    isFocused: false, // 光标/选区是否在编辑器内（即编辑器是否"聚焦"）
    selectText: null as Selection | null, // 当前选区对象
    selectRange: null as Range | null, // 当前选区对象的范围对象
}

const boldBtn = document.getElementById('boldBtn') as HTMLButtonElement;
const italicBtn = document.getElementById('italicBtn') as HTMLButtonElement;
 
const toolBtn = [boldBtn, italicBtn];

const init = () => {
    editorContainer.contentEditable = 'true';
    addListeners();
    
      // 1. 鼠标松开时执行切割（此时选区已稳定）
    editorContainer.addEventListener('mouseup', () => {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        // 只处理选区在编辑器内部的情况
        if (editorContainer.contains(range.commonAncestorContainer)) {
            splitSelectionText(sel);
            // 切割后更新状态（选区已被清除）
            state.selectText = null;
            state.isFocused = false;
            ctrlAllToolBtn();
        }
        }
    });
    
    document.addEventListener('selectionchange', () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            state.selectText = getSelectText();
            // splitSelectionText(state.selectText);
            state.isFocused = isSelectTextInContainer();
            ctrlAllToolBtn()
        }, 100);
    });
}


const getSelectText = (): Selection | null => {
    const selectText = window.getSelection();
    return selectText;
}

const isSelectTextInContainer = () => {
    const selectText = state.selectText;
    const range = selectText?.getRangeAt(0);
    state.selectRange = range || null;
    const container = range?.commonAncestorContainer as HTMLElement;
    console.log('range', range)
    return editorContainer.contains(container);
}

const toolBtnListener = () => {
    boldBtn.addEventListener('click', () => {
        const strong = document.createElement('strong');
        console.log('boldBtn clicked');
    });
}

const ctrlAllToolBtn = () => {
    toolBtn.forEach(btn => {
        btn.disabled = !state.isFocused;
    });
}

const addListeners = () => {
    toolBtnListener();
}
init();
