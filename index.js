export const controlDialogWithUrlHash = (dialog, overflow) => {
    if (typeof window === 'undefined')
        throw new ReferenceError('window is not defined');
    if (dialog.tagName !== 'DIALOG')
        throw new TypeError('invalid dialog argument');
    if (['auto', 'manual'].indexOf(overflow) === -1)
        throw new TypeError('invalid overflow argument');
    const closeDialog = () => {
        const { hash } = window.location;
        window.history.pushState(null, '', ' ');
        if (overflow === 'auto')
            document.body.style.overflow = 'visible';
        dialog.close();
        if (hash) {
            const anchor = document.querySelector(`[href='${hash}']`);
            if (anchor)
                anchor.focus();
        }
    };
    const handleHash = () => {
        const { hash } = window.location;
        if (!hash || !document.querySelector(`[href='${hash}']`))
            return closeDialog();
        if (overflow === 'auto')
            document.body.style.overflow = 'hidden';
        if (!dialog.open)
            dialog.showModal();
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    dialog.addEventListener('close', closeDialog);
    return {
        removeEventListeners: () => {
            window.removeEventListener('hashchange', handleHash);
            dialog.removeEventListener('close', closeDialog);
        },
    };
};
