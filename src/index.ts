const editorContainer  = document.getElementById('editor-container') as HTMLDivElement;
let timer: number;

const init = () => {
    editorContainer.contentEditable = 'true';
    
    
    document.addEventListener('selectionchange', () => {
        clearTimeout(timer);
        timer = setTimeout(isSelectTextInContainer, 100);
    });
}

const getSelectText = (): Selection | null => {
    const selectText = window.getSelection();
    return selectText;
}

const isSelectTextInContainer = () => {
    const selectText = getSelectText();

    const range = selectText?.getRangeAt(0);

    const container = range?.commonAncestorContainer as HTMLElement;

    return editorContainer.contains(container);
}

init();
