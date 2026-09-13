const fs = require('fs');
const files = [
  'public/index.html',
  'static/index.html',
  'public/playground.html',
  'static/playground.html'
];

const gtagSnippet = `
		<!-- Google tag (gtag.js) -->
		<script async src="https://www.googletagmanager.com/gtag/js?id=G-CC007RV79S"></script>
		<script>
		  window.dataLayer = window.dataLayer || [];
		  function gtag(){dataLayer.push(arguments);}
		  gtag('js', new Date());

		  gtag('config', 'G-CC007RV79S');
		</script>
`;

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('G-CC007RV79S')) {
      content = content.replace('</head>', gtagSnippet + '\t</head>');
      fs.writeFileSync(file, content);
      console.log(`Updated ${file}`);
    }
  }
});
