
// Create one test item for each context type.
var contexts = ["page","selection","link","editable","image","video","audio"];
for (var i = 0; i < contexts.length; i++) {
  var context = contexts[i];
  var title = "Test '" + context + "' menu item";
  var id = chrome.contextMenus.create({"title": title, "contexts":[context], "onclick": getClickedElement});

}

function getClickedElement(info, tab) {
    chrome.tabs.sendMessage(tab.id, "getClickedEl", function(data) {
        var element = document.createElement('div');
        element.innerHTML = data.outerHTML;
        var myElement = element.firstChild;

        var selector = myElement.tagName;

        if (myElement.id !== "" && myElement.id !== null){
          selector += "#" + myElement.id;
        }

        myElement.classList.forEach(function(elementsClass){
          selector += "." + elementsClass;
        });

        console.log(selector);

        eleBlacklistDB.open();

    });
}
