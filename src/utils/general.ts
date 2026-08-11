import { editorContainer } from './../index';
export const category = {
    bold: ["STRONG", "B"],
    italic: ["EM", "I"],
    underline: ["U", "INS"]
}

export const splitSelectionText = (selectionText: Selection | null) => {
    if (!selectionText) return null;
    if (selectionText.rangeCount === 0) return null;

    const range = selectionText.getRangeAt(0);

    const startContainer = range.startContainer;
    const endContainer = range.endContainer;

    if (startContainer !== endContainer || startContainer.nodeType !== Node.TEXT_NODE) {
        return null;
    }
    const startOffset = range.startOffset;
    const endOffset = range.endOffset;

    const container = range.commonAncestorContainer;

    const textNode = startContainer as Text;

    // const textContent = container.firstChild
    console.log('textContent1', textNode)

    // const text = textContent?.textContent || '';

    const rightPart = textNode.splitText(endOffset);

    const middlePart = textNode.splitText(startOffset);

    const parent = textNode.parentNode;

    console.log('startOffset', startOffset, 'endOffset', endOffset, 'middlePart', middlePart)

    // 此时 textNode 为左部分（leftPart）
    const leftPart = textNode;

    if (!parent) return null;

    // 判断是否已在 <strong> 内
    if (parent.nodeName === 'STRONG') {
        // 取消加粗：将整个 <strong> 替换为纯文本节点
        const strong = parent as HTMLElement;
        const grandParent = strong.parentNode;
        if (!grandParent) return;

        const textContent = strong.textContent || '';
        const newTextNode = document.createTextNode(textContent);
        grandParent.replaceChild(newTextNode, strong);
        return;
    }


    // 创建 <strong> 元素，并将中间部分移入其中
    const strong = document.createElement('strong');
    parent.insertBefore(strong, middlePart); // 在 middlePart 前插入 strong
    strong.appendChild(middlePart);           // 将 middlePart 移动到 strong 内部

}

export const bold = (selection: Selection | null): boolean => {
    if (!selection || selection.rangeCount === 0) return false;

    try {
        // 直接调用浏览器内置的加粗切换命令
        document.execCommand('bold', false, '');
        return true;
    } catch (error) {
        console.warn('execCommand bold 失败:', error);
        return false;
    }
};

export const italic = (selection: Selection | null): boolean => {
    if (!selection || selection.rangeCount === 0) return false;

    try {
        document.execCommand('italic', false, '');
        return true;
    } catch (error) {
        console.warn('execCommand italic 失败:', error);
        return false;
    }
};

// export const getBoldState = (selection: Selection | null): boolean | 'mixed' | null => {
//     if (!selection || selection.rangeCount === 0) return null;

//     const range = selection.getRangeAt(0);
//     // 获取选区内的所有文本节点
//     const walker = document.createTreeWalker(
//         range.commonAncestorContainer,
//         NodeFilter.SHOW_TEXT,
//         {
//             acceptNode: (node) => {
//                 // 只选择在选区范围内的文本节点
//                 if (range.intersectsNode(node)) {
//                     return NodeFilter.FILTER_ACCEPT;
//                 }
//                 return NodeFilter.FILTER_REJECT;
//             }
//         }
//     );

//     console.log('walker', walker);

//     let hasBold = false;
//     let hasNotBold = false;
//     let node: Node | null;
//     while ((node = walker.nextNode())) {
//         // 向上查找最近的 strong/b 标签
//         let parent = node.parentNode;
//         let isBold = false;
//         while (parent && parent !== range.commonAncestorContainer) {
//             if (parent.nodeName === 'STRONG' || parent.nodeName === 'B') {
//                 isBold = true;
//                 break;
//             }
//             parent = parent.parentNode;
//         }
//         if (isBold) hasBold = true;
//         else hasNotBold = true;
//         // 如果两种状态都已出现，提前返回 'mixed'
//         if (hasBold && hasNotBold) return 'mixed';
//     }

//     if (hasBold && !hasNotBold) return true;
//     if (!hasBold && hasNotBold) return false;
//     // 没有文本节点（空选区）视为 null
//     return null;
// };

export const getBoldState = (selection: Selection | null): boolean | 'mixed' | null => {
    if (!selection || selection.rangeCount === 0) return null;
    const range = selection.getRangeAt(0);

    // ⭐ 没有选中文字，只有光标
    if (range.collapsed) {
        return document.queryCommandState('bold');
    }

    // ⭐ 处理折叠选区（光标）
    // if (range.collapsed) {
    //     let node = range.startContainer;
    //     // 如果当前节点是文本节点，取其父节点
    //     if (node.nodeType === Node.TEXT_NODE) {
    //         node = node.parentNode!;
    //     }
    //     // 向上查找加粗标签，直到 editor 容器（避免越界）
    //     const editor = document.getElementById('editor-container');
    //     while (node && node !== editor) {
    //         if (node.nodeName === 'STRONG' || node.nodeName === 'B') {
    //             return true;
    //         }
    //         node = node.parentNode!;
    //     }
    //     return false; // 未加粗
    // }


    // 直接这样写会导致，假设ABCDEFG，用户选择了BCDE，那么此时range.commonAncestorContainer就是整个文本节点range123 "BCDE"，而不是B、C、D、E的父节点（不是div），所以需要使用startContainer和endContainer来获取范围内的所有节点
    // const root = range.commonAncestorContainer

    // console.log(
    //     "range123",
    //     range.commonAncestorContainer
    // )

    const root = range.commonAncestorContainer.nodeType === Node.TEXT_NODE
        ? range.commonAncestorContainer.parentNode!
        : range.commonAncestorContainer;

    console.log('root', root)
    const filter = {
        acceptNode: function (node: Node) {
            if (range.intersectsNode(node)) {
                return NodeFilter.FILTER_ACCEPT
            } else {
                return NodeFilter.FILTER_REJECT
            }
        }
    }

    const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT,
        filter
    )

    let hasBold = false;
    let hasNotBold = false;
    let node: Node | null;
    let time = 1;

    // ⭐ 这里的walker拿到的是文本节点，而不是外面的标签，所以需要向上查找父节点，判断是否有加粗标签
    // node是最内部的文本节点，所以第一轮的时候node是最内部的
    while ((node = walker.nextNode()) !== null) {
        console.log(`第${time}轮`)
        time += 1
        // 这里walker拿到的是文本节点，而不是外面的标签
        // const node = walker.nextNode()

        let parent = node?.parentNode
        let isBold = false

        // 这种写法会导致<b>ABC</b>这种情况下，用户选择ABC，由于此时parent就是range.commonAncestorContainer，所以此时不会被标记为加粗
        // while (parent && parent !== range.commonAncestorContainer) { 
        //     // 判断是否有加粗
        //     if (parent.nodeName === 'STRONG' || parent.nodeName === 'B') { 

        //     }

        // }

        if (!parent) {
            return null
        }

        console.log('parent', parent)
        console.log("parentName", parent.nodeName)

        // 这样写的话当第一层是i的时候，那么他下一次内部循环就是parent === range.commonAncestorContainer, 就变成mixed了

        // if (parent.nodeName === 'STRONG' || parent.nodeName === 'B') { 
        //     isBold = true
        // }

        // if (!isBold) {
        //     while (parent && parent !== range.commonAncestorContainer) { 
        //         console.log('while内部parent', parent)
        //         // 判断是否有加粗
        //         if (parent.nodeName === 'STRONG' || parent.nodeName === 'B') { 
        //             isBold = true
        //             break
        //         }
        //         parent = parent.parentNode
        //     }
        // }

        if (!isBold) {
            while (parent) {
                console.log('while内部parent', parent)
                // 判断是否有加粗
                if (parent.nodeName === 'STRONG' || parent.nodeName === 'B') {
                    isBold = true
                    break
                }
                if (parent === range.commonAncestorContainer) {
                    break
                }
                parent = parent.parentNode
            }
        }

        if (isBold) {
            hasBold = true
        } else {
            hasNotBold = true
        }

        if (hasBold && hasNotBold) {
            return 'mixed'
        }
    }

    if (hasBold && !hasNotBold) {
        return true
    }
    if (!hasBold && hasNotBold) {
        return false
    }

    return null
}

export const getItalicState = (selection: Selection | null): boolean | 'mixed' | null => {
    if (!selection || selection.rangeCount === 0) return null;
    const range = selection.getRangeAt(0);

    // ⭐ 没有选中文字，只有光标
    if (range.collapsed) {
        return document.queryCommandState('italic');
    }

    const root = range.commonAncestorContainer.nodeType === Node.TEXT_NODE
        ? range.commonAncestorContainer.parentNode!
        : range.commonAncestorContainer;

    const filter = {
        acceptNode: function (node: Node) {
            if (range.intersectsNode(node)) {
                return NodeFilter.FILTER_ACCEPT
            } else {
                return NodeFilter.FILTER_REJECT
            }
        }
    }

    const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT,
        filter
    )

    let hasBold = false;
    let hasNotBold = false;
    let node: Node | null;
    while ((node = walker.nextNode()) !== null) {
        let parent = node?.parentNode
        let isBold = false

        if (!parent) {
            return null
        }

        // if (parent.nodeName === 'EM' || parent.nodeName === 'I') {
        //     isBold = true
        // }

        // if (!isBold) {
        //     while (parent && parent !== range.commonAncestorContainer) {
        //         // 判断是否有加粗
        //         if (parent.nodeName === 'EM' || parent.nodeName === 'I') {
        //             isBold = true
        //             break
        //         }
        //         parent = parent.parentNode
        //     }
        // }

        if (!isBold) {
            while (parent) {
                // 判断是否有加粗
                if (parent.nodeName === 'EM' || parent.nodeName === 'I') {
                    isBold = true
                    break
                }
                if (parent === range.commonAncestorContainer) {
                    break
                }
                parent = parent.parentNode
            }
        }

        if (isBold) {
            hasBold = true
        } else {
            hasNotBold = true
        }

        if (hasBold && hasNotBold) {
            return 'mixed'
        }
    }

    if (hasBold && !hasNotBold) {
        return true
    }
    if (!hasBold && hasNotBold) {
        return false
    }

    return null
}

export const toggleStyle  = (selection: Selection | null, style: keyof typeof category): boolean => {
    if (!selection || selection.rangeCount === 0) return false;

    try {
        document.execCommand(style, false, '');
        return true;
    } catch (error) {
        console.warn(`execCommand ${style} 失败:`, error);
        return false;
    }
};

export const getTextState = (selection: Selection | null, option: keyof typeof category): boolean | "mixed" | null => {
    if (!selection || selection.rangeCount === 0) return null
    const range = selection.getRangeAt(0)
    if (range.collapsed) {
        return document.queryCommandState(option)
    }

    const filter = {
        acceptNode: function (node: Node) {
            if (range.intersectsNode(node)) {
                return NodeFilter.FILTER_ACCEPT
            } else {
                return NodeFilter.FILTER_REJECT
            }
        }
    }

    // ⚠️ 问题
    // TreeWalker 的 root 必须是容器节点（元素或文档），虽然可以传文本节点，但：

    // 如果 root 是文本节点，walker 只会遍历这个文本节点本身（因为文本节点没有子节点），而无法访问到选区可能涉及的其他文本节点（例如跨多个标签的选区）。

    // 如果选区跨多个文本节点（如 <b>AB</b><i>CD</i> 中选中 "ABCD"），commonAncestorContainer 可能是 <body> 或某个块级元素，但若恰巧 commonAncestorContainer 是文本节点（比如选区只在一个文本节点内），walker 只扫描这一个节点，其他文本节点的样式就会被遗漏，导致 hasState / hasNotState 统计不全，最终返回错误结果。

    // ✅ 正确做法
    // 必须将 root 规范化为一个元素节点（即文本节点的父节点），确保 walker 能覆盖选区所在的所有可能节点。
    // const root = range.commonAncestorContainer
    const root = range.commonAncestorContainer.nodeType === Node.TEXT_NODE
        ? range.commonAncestorContainer.parentNode!
        : range.commonAncestorContainer;
    const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT,
        filter,
    )

    let node: Node | null
    let hasNotState: boolean = false
    let hasState: boolean = false

    while ((node = walker.nextNode()) !== null) {
        let parent = node.parentNode
        let isState = false

        while (parent && parent !== editorContainer) {
            if (!parent) {
                return null
            }

            if (category[option].includes(parent.nodeName)) {
                isState = true
                break
            }

            // 这样不会阻止向上查询，但是使用parent ===root会
            console.log("root", root)
            console.log("commonAncestorContainer", range.commonAncestorContainer)
            // if (parent === range.commonAncestorContainer) {
            //     break
            // }

            parent = parent.parentNode
        }

        if (isState) {
            hasState = true
        } else {
            hasNotState = true
        }

        if (hasNotState && hasState) {
            return 'mixed'
        }
    }

    if (!hasNotState && hasState) {
        return true
    } else if (!hasState && hasNotState) {
        return false
    }

    return null
}