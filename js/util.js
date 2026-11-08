function popitup(url, windowName) {
    newwindow=window.open(url, windowName,'height=450,width=600,toolbar=no, menubar=no, location=no, addressbar=no');
    if (window.focus) {newwindow.focus()}
    return false;
}