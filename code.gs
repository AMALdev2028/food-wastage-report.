function doGet() {
  return HtmlService.createHtmlOutputFromFile('index');
}

// Get available items from the "Food Items" sheet
function getAvailableItems() {
  const sheet = SpreadsheetApp.openById("1nFuDnG13qq7vUotitx07mHFhDMJ2_7PJnqYiA1dKe3U").getSheetByName("Food Items");
  const data = sheet.getDataRange().getValues();
  const items = [];
 
  // Skip header row (assuming it's on the first row)
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    items.push({
      itemId: row[0],
      itemName: row[1],
      section: row[2],
      costPerPortion: row[3],
    });
  }

  return items;
}

// Submit the form data to the "Wastage Report" sheet
function submitForm(formData) {
  const sheet = SpreadsheetApp.openById("1nFuDnG13qq7vUotitx07mHFhDMJ2_7PJnqYiA1dKe3U").getSheetByName("Wastage Report");

  // Create unique ID
  const uniqueId = 'KCK' + new Date().getTime();

  // Get current date and time
  const currentDate = new Date();
 
  // Timestamp (combined date & time)
  const timestamp = Utilities.formatDate(currentDate, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
 
  // Separate Date and Time
  const date = Utilities.formatDate(currentDate, Session.getScriptTimeZone(), "yyyy-MM-dd");
  const time = Utilities.formatDate(currentDate, Session.getScriptTimeZone(), "HH:mm:ss");

  // Loop through the selected items and log each one
  formData.items.forEach(function (item) {
    sheet.appendRow([
      uniqueId,                      // Unique ID
      item.itemId,                   // Item ID
      item.itemName,                 // Item Name
      item.qty,                      // Quantity
      item.costPerPortion,           // Cost Per Portion
      item.qty * item.costPerPortion, // Total Cost
      item.uom,                      // UOM
      formData.stockTakenBy,         // Stock Taken By
      item.section,                  // Section
      item.image,                    // Image URL
      timestamp,                     // Timestamp (combined date & time)
      date,                          // Date (separate column)
      time,                          // Time (separate column)
    ]);
  });

  return "Form submitted successfully!";
}
