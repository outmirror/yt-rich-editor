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