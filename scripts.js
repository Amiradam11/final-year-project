// scripts.js

function navigateTo(feature) {
  switch (feature) {
    case 'summarize':
      alert("Navigating to Summarize Notes feature...");
      break;
    case 'quiz':
      alert("Navigating to Generate Quiz feature...");
      break;
    case 'chat':
      alert("Navigating to Chatbot...");
      break;
    default:
      alert("Feature not found!");
  }
}
