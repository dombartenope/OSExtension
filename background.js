chrome.runtime.onInstalled.addListener(()=> {
    console.log("Extension Installed");
    chrome.contextMenus.create({
        id: "1",
        title: "Search for \"%s\"",
        contexts: ["selection"]
    })
});


chrome.contextMenus.onClicked.addListener((info, tab) => {
    //REGEX FOR VALIDATION
    const uuid_re = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i; //Accepts UUID format {8}{4}{3}{3}{12}
    const email_re = /@.{1,}/; //Anything with an @ sign and characters after;
    const emailURL = "https://dashboard.onesignal.com/super-user?email="
    const uuidURL = "https://dashboard.onesignal.com/apps/"

    const uuid_ok = uuid_re.exec(info.selectionText);
    const email_ok = email_re.exec(info.selectionText);

    if(uuid_ok) {
        console.log("Searching for app id on submit");
        const newUrl = `${uuidURL + info.selectionText}`;
        chrome.tabs.create({url: newUrl});
    } else if (email_ok) {
        console.log("Searching for email on submit");
        const newUrl = `${emailURL + info.selectionText}`;
        chrome.tabs.create({url: newUrl});
    } else {
        console.log(info)
        console.log("Validation Error, please try again")
    }
});