
var workspace = null;
var StartBlockId = "";
var startXmlText;
var block = true;

function PageLoad() {
  window.localStorage.setItem("Page", "Horizontal");
  setAppearance();
  // setEditor();
  // setLangulageHorizontal();

  // Panel.init();
   
  // $(document).on('click', '.tab-controller', function() {
  //   Panel.togglePanel();
  // });

  // Panel.hidePanel();

 // if(localStorage.getItem("isIntroHorizontal") != "false")
 // {
    //  localStorage.setItem("isIntroHorizontal", "false");
      // StartIntro();
 //}
}

function setAppearance() {
  // setTimeout(function() {
  //     fadeOutEffect();
  // }, 500);

  var availWidth = window.screen.availWidth;
  var myStartScale = 0.8 + ((availWidth - 1000) / 300) * 0.1;

  var height = innerHeight * 0.90;

  $("#BlocksPannel").height(height);
  $("#blocklyDiv").height(height);

  var toolbox = document.getElementById("toolbox");

  workspace = Blockly.inject('blocklyDiv', {
    comments: false,
    disable: true,
    collapse: false,
    media: 'media/',
    readOnly: false,
    // scrollbars: false,  
    // toolbox: false,
    trashcan: true,
    horizontalLayout: true,
    oneBasedIndex : true,  
    maxBlocks: 2,
    css : true, 
    toolboxPosition: 'end',  
    // rtl: rtl,
    //horizontalLayout: side == 'top' || side == 'bottom',
    //toolboxPosition: side == 'top' || side == 'start' ? 'start' : 'end',
    toolbox: toolbox,
    toolboxOptions: {
      color: true,
      inverted: true
    },
    maxInstances: {
      // new_event_start: 1
    },
    sounds: true,
    move: {
      scrollbars: true,
      drag: true,
      wheel: true,
    },
    zoom: {
      controls: true,
      wheel: true,
      startScale: myStartScale,
      maxScale: 4,
      minScale: 0.75,
      scaleSpeed: 1.1
    },
    colours: {
      fieldShadow: 'rgba(255, 255, 255, 0.3)',
      dragShadowOpacity: 0.6
      // workspace: '#e5e5e5',
      // flyout: '#F2f2f2',
      // scrollbar: '#bbbbbb',
      // scrollbarHover: '#0C111A',
      // insertionMarker: '#FFFFFF',
      // insertionMarkerOpacity: 0.3,
      // fieldShadow: 'rgba(255, 255, 255, 0.3)',
      // dragShadowOpacity: 0.6
    },
    scrollbars: {
      horizontal: false,
      vertical: true,
    },
    grid:
    {
        spacing: 20,
        length: 2,
        colour: '#ccc',
        snap: true
    },
  });

  
  workspace.addChangeListener(change);

  let startCode = '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="new_event_start" maxInstances="1" id="}^Xg:jW-h7O?ksLFb:ke" x="290" y="270" deletable="false"></block></xml>';
  var dom = Blockly.Xml.textToDom(startCode);
  Blockly.Xml.domToWorkspace(workspace, dom);
}


function change(event) {
  var output = document.getElementById('importExport');
  var xmlDom = Blockly.Xml.workspaceToDom(workspace);
  xmlText = Blockly.Xml.domToText(xmlDom);

  // if (event.type === Blockly.Events.BLOCK_CREATE || Blockly.Events.BLOCK_MOVE) {
  //   const blocks = Blockly.mainWorkspace.getAllBlocks(true);
  //   let stopBlock = null;

  //   // Find the stop block
  //   for (const block of blocks) {
  //     if (block.type === 'control_stop') {
  //       stopBlock = block;
  //       break;
  //     }
  //   }

  //   if (stopBlock) {
  //     const lastBlock = blocks[blocks.length - 1];
  //     // If Stop is not the last block, move it to the end
  //     if (lastBlock !== stopBlock) {
  //       stopBlock.unplug();
  //       // stopBlock.moveBy(0, lastBlock.getRelativeToSurfaceXY().y + 50);
  //     }
  //   }
  // }

  if(event.type == "ui")
  {
    var id = event.blockId;

    var block = workspace.getBlockById(event.blockId);
    
    if (block != null && block.type == "new_event_start") {
      // Bloğun üzerine tıklandığında yapılacak işlemler buraya gelecek
      RunCode();
    }

    if(id != null && workspace.getBlockById(id) != null)
    {
      var block = workspace.getBlockById(id);

      if(block.childBlocks_ != null && block.type == "new_event_start")
      {
          StartBlockId = id;
      }
    }
  }
  else
  {
    var id = StartBlockId;

    if(id == null || id == "")
    {
      id = ottoStartclickedID(xmlText);
    }

    if(id != null && workspace.getBlockById(id) != null)
    {
      var block = workspace.getBlockById(id);

      if(block.childBlocks_ != null && block.type == "new_event_start")
      {
          // startCode = Blockly.Python.blockToCode(block.childBlocks_[0]);
          startCode = Blockly.KukiLive.blockToCode(block.childBlocks_[0]);
      }
    }
  }

  if (startXmlText != xmlText) {
      latestCode = Blockly.KukiLive.workspaceToCode(workspace);
      // latestCode = Blockly.Python.workspaceToCode(workspace);
  }
}

function ottoStartclickedID(xml) {

  var startIndex = xml.indexOf('<block type="new_event_start" id="');
  startIndex = startIndex + 29;

  var tmp = xml.substring(startIndex);

  var endIndex = tmp.indexOf('"');

  var id = tmp.substring(0, endIndex);

  return id;
}

function RunCode() {
  if (isConnected && !on_running_code ) {
      var code = latestCode;
      on_running_code = true;
      if (code !== "") {
          if (connectionType === "Serial") {
              // showProgressPanel(false);
              sendCommand(code);
          } else if (connectionType === "WebRepl") {
              showProgressPanel(false);
              pythoncode = pythoncode.replace(/\n/g, "\r");
              ws.send(pythoncode);
              setTimeout(hideProgressPanel, 1000);
          } else if (connectionType === "BLE") {
              showProgressPanel(true);
              sendCode(pythoncode);
          }
      }
  } else {
      console.log("Cannot Run Not Connected");
      // showModalDialog(ConnectOttoSerialText, "warning");
  }
}