// Menu Items are defined here, no need to adjust other code.
const MENU = {
  APP_AND_EMAIL: {
    id: 'onesignal-search',
    title: '🔍 Search OS For "%s"',
    baseUrls: {
      email: "https://dashboard.onesignal.com/super-user?email=",
      uuid: "https://dashboard.onesignal.com/super-user/identify?search="
    }
  },
  RECURLY: {
    id: 'recurly-search',
    title: '💳 Search RECURLY For "%s"',
    baseUrl: "https://onesignal.recurly.com/accounts?q="
  },
  SFDC: {
    id: 'sfdc-search',
    title: '⚡️ Search SFDC For "%s"',
    baseUrl: "https://onesignal.lightning.force.com/one/one.app#"
  }
};

function createContextMenus() {
  // Create the parent menu item
  const parentId = chrome.contextMenus.create({ 
    id: 'parent-menu',
    title: 'Super User Search',
    contexts: ['selection']
  });

  // Create child menu items
  Object.values(MENU).forEach(({ id, title }) => {
    chrome.contextMenus.create({
      id,
      title,
      contexts: ['selection'],
      parentId: parentId
    });
  });
} 

// SFDC Lightning, only accepts Base64 encoded JSON url.
function generateSFDCUrl(searchTerm) {
  const sfdcPayload = {
    componentDef: "forceSearch:searchPageDesktop",
    attributes: {
      term: searchTerm,
      scopeMap: { type: "TOP_RESULTS" },
      context: {
        FILTERS: {},
        searchSource: "ASSISTANT_DIALOG",
        disableIntentQuery: false,
        disableSpellCorrection: false,
        searchDialogSessionId: "ac23caa2-7615-2343-b482-f2f9be3af303",
        debugInfo: {
          appName: "LightningSales",
          appType: "Standard",
          appNamespace: "standard",
          location: "home:landing"
        }
      },
      groupId: "DEFAULT"
    },
    state: {}
  };

  const jsonString = JSON.stringify(sfdcPayload);
  const base64Encoded = btoa(jsonString);

  return `${MENU.SFDC.baseUrl}${base64Encoded}`;
}

function handleMenuClick(info) {
  const { menuItemId, selectionText } = info;
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(selectionText);
  const isEmail = /@.{1,}/.test(selectionText);

  console.log(`Menu clicked: ${menuItemId}, Selection: "${selectionText}"`);

  for (const key in MENU) {
    const { id, baseUrls, baseUrl } = MENU[key];
    if (menuItemId === id) {
      const searchUrl = menuItemId === MENU.SFDC.id
        ? generateSFDCUrl(selectionText)
        : baseUrls
          ? isUUID
            ? `${baseUrls.uuid}${selectionText}`
            : isEmail
              ? `${baseUrls.email}${selectionText}`
              : null
          : baseUrl
            ? `${baseUrl}${selectionText}`
            : null;

      if (searchUrl) {
        console.log(`Opening URL: ${searchUrl}`);
        chrome.tabs.create({ url: searchUrl });
      } else {
        console.warn(`Validation Error: Invalid selection "${selectionText}".`);
      }
      break;
    }
  }
}

// Setup event listeners on install
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension Installed");
  // Create context menus for the extension
  createContextMenus();
});

// Listen for menu item clicks
chrome.contextMenus.onClicked.addListener(handleMenuClick);
