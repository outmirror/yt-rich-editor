import { bold, getBoldState, getItalicState, italic, splitSelectionText, getTextState, category, toggleStyle } from './utils/general';

// 1. 工具配置表
const toolConfig = {
    bold: {
        btn: document.getElementById('boldBtn') as HTMLButtonElement,
        getState: getTextState,
        option: "bold"
    },
    italic: {
        btn: document.getElementById('italicBtn') as HTMLButtonElement,
        getState: getTextState,
        option: "italic"
    },
    // 后续扩展只需在此添加，例如：
    // underline: {
    //   btn: document.getElementById('underlineBtn') as HTMLButtonElement,
    //   getState: getUnderlineState,
    // },
};



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
                // splitSelectionText(sel);
                // // 切割后更新状态（选区已被清除）
                // state.selectText = null;
                // state.isFocused = false;
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
    console.log('container', container)
    return editorContainer.contains(container);
}

const toolBtnListener = () => {
    Object.values(toolConfig).forEach((tool) => {
        tool.btn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            toggleStyle(state.selectText, tool.option as keyof typeof category);

            requestAnimationFrame(() => {
                ctrlAllToolBtn();
            });
            console.log('toolBtn clicked');
        })
    })

    // boldBtn.addEventListener('mousedown', (e) => {
    //     e.preventDefault();
    //     bold(state.selectText);
    //     // getBoldState(state.selectText);
    //     console.log('boldBtn clicked');

    //     requestAnimationFrame(() => {
    //         ctrlAllToolBtn();
    //     });
    // });

    // italicBtn.addEventListener('mousedown', (e) => {
    //     e.preventDefault();
    //     italic(state.selectText);

    //     requestAnimationFrame(() => {
    //         ctrlAllToolBtn();
    //     });
    //     console.log('italicBtn clicked');
    // });
}

const updateToolState = (
    btn: HTMLButtonElement,
    state: boolean | 'mixed' | null
) => {
    btn.classList.remove('active', 'mixed');
    if (state === true) {
        btn.classList.add('active');
    } else if (state === 'mixed') {
        btn.classList.add('mixed');
    }
};

// const ctrlAllToolBtn = () => {
//     toolBtn.forEach(btn => {
//         btn.disabled = !state.isFocused;
//     });

//     if (state.selectText && state.isFocused) {
//         const boldState = getBoldState(state.selectText);
//         const italicState = getItalicState(state.selectText);
//         // console.log('boldState', boldState)
//         // console.log('italicState', italicState)
//         if (boldState === true) {
//             boldBtn.classList.add('active');
//             boldBtn.classList.remove('mixed');
//         } else if (boldState === 'mixed') {
//             boldBtn.classList.add('mixed');
//             boldBtn.classList.remove('active');
//         } else {
//             boldBtn.classList.remove('active', 'mixed');
//         }

//         if (italicState === true) {
//             italicBtn.classList.add('active');
//             italicBtn.classList.remove('mixed');
//         } else if (italicState === 'mixed') {
//             italicBtn.classList.add('mixed');
//             italicBtn.classList.remove('active');
//         } else {
//             italicBtn.classList.remove('active', 'mixed');
//         }
//     } else {
//         boldBtn.classList.remove('active', 'mixed');
//         italicBtn.classList.remove('active', 'mixed');
//     }
// }

const ctrlAllToolBtn = () => {
    const disabled = !state.isFocused;
    Object.values(toolConfig).forEach((tool) => {
        tool.btn.disabled = disabled;

        if (state.selectText && state.isFocused) {
            const toolState = tool.getState(state.selectText, tool.option as keyof typeof category);
            updateToolState(tool.btn, toolState);
        } else {
            updateToolState(tool.btn, null);
        }
    })
}

const addListeners = () => {
    toolBtnListener();
}
init();
