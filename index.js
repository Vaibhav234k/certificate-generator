const userName = document.getElementById("name");
const submitBtn = document.getElementById("submitBtn");

const { PDFDocument, rgb, degrees } = PDFLib;


const capitalize = (str, lower = false) =>
  (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, (match) =>
    match.toUpperCase()
  );

submitBtn.addEventListener("click", () => {
  const val = capitalize(userName.value);

  //check if the text is empty or not
  if (val.trim() !== "" && userName.checkValidity()) {
    console.log(val);
    generatePDF(val);
  } else {
    userName.reportValidity();
  }
});

const generatePDF = async (name) => {
  const existingPdfBytes = await fetch("./cert.pdf").then((res) =>
    res.arrayBuffer()
  );

  // Load a PDFDocument from the existing PDF bytes
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  pdfDoc.registerFontkit(fontkit);

  const page = pdfDoc.addPage()
  const { width, height } = page.getSize()
  //get font
  const fontBytes = await fetch("./GreatVibes-Regular.ttf").then((res) =>
    res.arrayBuffer()
  );

  // Embed our custom font in the document
  const GreatVibes = await pdfDoc.embedFont(fontBytes);

  // Get the first page of the document
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  var Textwidth = getTextWidth(userName.value, 65);
  var x = ((width/2) - (Textwidth / 2)) + 90;
  // Draw a string of text diagonally across the first page
  firstPage.drawText(name, {
    x: x,
    y: 275,
    size: 65,
    font: GreatVibes,
    color: rgb(0.36470588235294116, 0.23137254901960785, 0),
  });
  console.log("Calculated width", x)
  console.log("width of page", width);
  console.log("Width of the text:", Math.ceil(Textwidth));

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();
  console.log("Done creating");

  // this was for creating uri and showing in iframe

  // const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
  // document.getElementById("pdf").src = pdfDataUri;

  var file = new File(
    [pdfBytes],
    "Certificate.pdf",
    {
      type: "application/pdf;charset=utf-8",
    }
  );
 saveAs(file);
};

function getTextWidth(text, fontSize) {
  // Create a canvas element
  var canvas = document.getElementById('myCanvas');
  var context = canvas.getContext('2d');
  
  // Set the font size and family
  context.font = fontSize + 'px MyCustomFont';  // You can change 'Arial' to any font family you are using
  
  // Measure the text width
  var metrics = context.measureText(text);
  
  return metrics.width;
}


// init();
