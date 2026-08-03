const editorContainer  = document.getElementById('editor-container') as HTMLDivElement;
let timer: number;

const state = {
    isFocused: false, // 光标/选区是否在编辑器内（即编辑器是否"聚焦"）
    selectText: null as Selection | null, // 当前选区对象
}

const boldBtn = document.getElementById('boldBtn') as HTMLButtonElement;
const italicBtn = document.getElementById('italicBtn') as HTMLButtonElement;
 
const toolBtn = [boldBtn, italicBtn];

const init = () => {
    editorContainer.contentEditable = 'true';
    
    
    document.addEventListener('selectionchange', () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            state.selectText = getSelectText();
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
    const container = range?.commonAncestorContainer as HTMLElement;
    // console.log('range', range)
    return editorContainer.contains(container);
}

const toolBtnListener = () => {
    boldBtn.addEventListener('click', () => {
        console.log('boldBtn clicked');
    });
}

const ctrlAllToolBtn = () => {
    toolBtn.forEach(btn => {
        btn.disabled = !state.isFocused;
    });
}
init();
